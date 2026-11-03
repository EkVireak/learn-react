// A tiny fake "Contacts API" — the backend for exercise 13. You don't need to edit this file,
// but reading it shows exactly what the server expects and returns.
//
// It is plain Web-standard code (Request in → Response out), so the SAME logic runs:
//   - as a real HTTP server: `npm run api:contacts` (server/contacts-api.ts, port 3002)
//   - inside the tests, where `fetch` is replaced by `handle()`
//
// Rules:
//   every request      → header `x-api-key: demo-key-123`            else 403
//   POST /auth/login   → body { email, password }                     → 200 { token, user } | 401
//   POST /auth/logout  → needs token                                  → 204
//   /contacts...       → header `Authorization: Bearer <token>`       else 401
//     GET    /contacts?search=&favorite=true   → 200 Contact[]
//     GET    /contacts/:id                     → 200 Contact | 404
//     POST   /contacts                         → 201 Contact | 422 { error, details }
//     PUT    /contacts/:id   (full replace)    → 200 Contact | 404 | 422 (all fields required)
//     PATCH  /contacts/:id   (partial update)  → 200 Contact | 404 | 422
//     DELETE /contacts/:id                     → 204 (no body) | 404

export type Contact = {
  id: string
  name: string
  email: string
  phone: string
  favorite: boolean
}

export const DEMO = {
  apiKey: 'demo-key-123',
  email: 'ada@example.com',
  password: 'password123',
  user: { id: 'u1', name: 'Ada Lovelace', email: 'ada@example.com' },
} as const

const SEED: Contact[] = [
  { id: '1', name: 'Grace Hopper', email: 'grace@example.com', phone: '555-0101', favorite: true },
  { id: '2', name: 'Alan Turing', email: 'alan@example.com', phone: '555-0102', favorite: false },
  {
    id: '3',
    name: 'Margaret Hamilton',
    email: 'margaret@example.com',
    phone: '',
    favorite: false,
  },
]

type Fields = Omit<Contact, 'id'>
type Details = Partial<Record<keyof Fields, string>>

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

const fail = (status: number, error: string, details?: Details) =>
  json(details ? { error, details } : { error }, status)

/** Validates a body for POST (create), PUT (replace: everything required) or PATCH (partial). */
function validate(
  body: unknown,
  mode: 'create' | 'replace' | 'update',
): { ok: true; value: Partial<Fields> } | { ok: false; details: Details } {
  const b = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>
  const details: Details = {}
  const value: Partial<Fields> = {}
  const required = (field: keyof Fields) =>
    mode === 'replace' || (mode === 'create' && (field === 'name' || field === 'email'))

  for (const field of ['name', 'email', 'phone'] as const) {
    const v = b[field]
    if (v === undefined) {
      if (required(field)) details[field] = 'Required'
      continue
    }
    if (typeof v !== 'string') details[field] = 'Must be a string'
    else if (field === 'name' && v.trim().length < 2) details.name = 'Must be at least 2 characters'
    else if (field === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v))
      details.email = 'Must be a valid email'
    else value[field] = v.trim()
  }

  if (b.favorite === undefined) {
    if (required('favorite')) details.favorite = 'Required'
  } else if (typeof b.favorite !== 'boolean') details.favorite = 'Must be true or false'
  else value.favorite = b.favorite

  return Object.keys(details).length ? { ok: false, details } : { ok: true, value }
}

export function createMockApi() {
  let contacts: Contact[] = structuredClone(SEED)
  const tokens = new Set<string>()
  let nextId = SEED.length + 1

  async function handle(req: Request): Promise<Response> {
    const { pathname, searchParams } = new URL(req.url)
    const method = req.method.toUpperCase()

    // CORS preflight (browsers send this before requests with custom headers). No auth here.
    if (method === 'OPTIONS') return new Response(null, { status: 204 })

    if (req.headers.get('x-api-key') !== DEMO.apiKey) {
      return fail(403, 'Invalid or missing API key')
    }

    let body: unknown = undefined
    const text = await req.text()
    if (text) {
      try {
        body = JSON.parse(text)
      } catch {
        return fail(400, 'Body must be valid JSON')
      }
    }

    if (pathname === '/auth/login' && method === 'POST') {
      const { email, password } = (body ?? {}) as { email?: string; password?: string }
      if (email !== DEMO.email || password !== DEMO.password) {
        return fail(401, 'Invalid email or password')
      }
      const token = `tok_${crypto.randomUUID()}`
      tokens.add(token)
      return json({ token, user: DEMO.user })
    }

    const token = req.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1]
    if (!token || !tokens.has(token)) return fail(401, 'Missing or expired token')

    if (pathname === '/auth/logout' && method === 'POST') {
      tokens.delete(token)
      return new Response(null, { status: 204 })
    }

    if (pathname === '/contacts') {
      if (method === 'GET') {
        const search = searchParams.get('search')?.toLowerCase() ?? ''
        const favorite = searchParams.get('favorite')
        return json(
          contacts.filter(
            (c) =>
              (c.name.toLowerCase().includes(search) || c.email.toLowerCase().includes(search)) &&
              (favorite === null || String(c.favorite) === favorite),
          ),
        )
      }
      if (method === 'POST') {
        const result = validate(body, 'create')
        if (!result.ok) return fail(422, 'Validation failed', result.details)
        const contact: Contact = {
          id: String(nextId++),
          name: '',
          email: '',
          phone: '',
          favorite: false,
          ...result.value,
        }
        contacts = [...contacts, contact]
        return json(contact, 201)
      }
      return fail(405, `Method ${method} not allowed`)
    }

    const id = pathname.match(/^\/contacts\/([^/]+)$/)?.[1]
    if (id !== undefined) {
      const existing = contacts.find((c) => c.id === id)
      if (!existing) return fail(404, `Contact ${id} not found`)

      if (method === 'GET') return json(existing)

      if (method === 'PUT' || method === 'PATCH') {
        const result = validate(body, method === 'PUT' ? 'replace' : 'update')
        if (!result.ok) return fail(422, 'Validation failed', result.details)
        const updated: Contact = { ...existing, ...result.value, id }
        contacts = contacts.map((c) => (c.id === id ? updated : c))
        return json(updated)
      }

      if (method === 'DELETE') {
        contacts = contacts.filter((c) => c.id !== id)
        return new Response(null, { status: 204 })
      }
      return fail(405, `Method ${method} not allowed`)
    }

    return fail(404, `No route for ${method} ${pathname}`)
  }

  return {
    handle,
    /** Test helper: simulate every session expiring on the server. */
    expireAllTokens: () => tokens.clear(),
  }
}
