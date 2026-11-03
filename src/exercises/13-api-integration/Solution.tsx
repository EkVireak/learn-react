// Solution 13 – API integration: CRUD with an API key + Bearer token
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { ApiError, createApiClient, createContactsApi, type ContactsApi } from './api.solution'
import { API_KEY, API_URL, createTokenStore, type Contact, type User } from './types'

const SESSION_EXPIRED = 'Your session has expired. Please log in again.'

/** Turns any thrown value into a message a user can read. */
function describe(err: unknown): string {
  if (err instanceof ApiError) {
    const details = err.details ? Object.entries(err.details).map(([f, m]) => `${f}: ${m}`) : []
    return [err.message, ...details].join(' · ')
  }
  return 'Network error — is the API running? (npm run api:contacts)'
}

const isAbort = (err: unknown) => err instanceof DOMException && err.name === 'AbortError'

export default function ContactsManager() {
  // The token lives in memory (not localStorage — see README). One store + client per component.
  const [{ api, tokens }] = useState(() => {
    const tokens = createTokenStore()
    const client = createApiClient({ baseUrl: API_URL, apiKey: API_KEY, getToken: tokens.get })
    return { api: createContactsApi(client), tokens }
  })
  const [user, setUser] = useState<User | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  async function login(email: string, password: string) {
    const session = await api.login(email, password) // throws ApiError(401) on bad credentials
    tokens.set(session.token)
    setNotice(null)
    setUser(session.user)
  }

  async function logout() {
    await api.logout().catch(() => {}) // even if it fails, forget the token locally
    tokens.set(null)
    setUser(null)
  }

  // Any 401 means the token is missing/expired: drop it and send the user back to login.
  const onUnauthorized = useCallback(() => {
    tokens.set(null)
    setUser(null)
    setNotice(SESSION_EXPIRED)
  }, [tokens])

  if (!user) return <LoginForm onLogin={login} notice={notice} />
  return <ContactsPage api={api} user={user} onLogout={logout} onUnauthorized={onUnauthorized} />
}

function LoginForm({
  onLogin,
  notice,
}: {
  onLogin: (email: string, password: string) => Promise<void>
  notice: string | null
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)
    try {
      await onLogin(email, password)
    } catch (err) {
      setError(describe(err))
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
      <h3>Log in</h3>
      {notice && <p role="status">{notice}</p>}
      <label>
        Email <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Password{' '}
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="submit" disabled={pending}>
        {pending ? 'Logging in…' : 'Log in'}
      </button>
      {error && <p role="alert">{error}</p>}
      <small>
        Demo account: <code>ada@example.com</code> / <code>password123</code>
      </small>
    </form>
  )
}

type PageProps = {
  api: ContactsApi
  user: User
  onLogout: () => void
  onUnauthorized: () => void
}

function ContactsPage({ api, user, onLogout, onUnauthorized }: PageProps) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [version, setVersion] = useState(0) // bump after a mutation to reload the list

  // GET /contacts?search=… — re-runs when the search or `version` changes.
  useEffect(() => {
    const controller = new AbortController()
    api
      .list({ search }, controller.signal)
      .then((data) => {
        setContacts(data)
        setStatus('ready')
      })
      .catch((err) => {
        if (isAbort(err)) return
        if (err instanceof ApiError && err.status === 401) return onUnauthorized()
        setError(describe(err))
        setStatus('error')
      })
    return () => controller.abort()
  }, [api, search, version, onUnauthorized])

  /** Runs a mutation, then reloads the list. Returns false if it failed. */
  async function run(mutation: () => Promise<unknown>): Promise<boolean> {
    try {
      await mutation()
      setError(null)
      setVersion((v) => v + 1)
      return true
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) onUnauthorized()
      else setError(describe(err))
      return false
    }
  }

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 640 }}>
      <header style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span>Signed in as {user.name}</span>
        <button onClick={onLogout}>Log out</button>
      </header>

      <NewContactForm onCreate={(input) => run(() => api.create(input))} />

      <label>
        Search contacts <input value={search} onChange={(e) => setSearch(e.target.value)} />
      </label>

      {error && <p role="alert">{error}</p>}
      {status === 'loading' && <p>Loading contacts…</p>}
      {status !== 'loading' && contacts.length === 0 && <p>No contacts found</p>}

      <ul style={{ display: 'grid', gap: 8, padding: 0, listStyle: 'none' }}>
        {contacts.map((c) => (
          <ContactRow
            key={c.id}
            contact={c}
            onToggleFavorite={() => run(() => api.update(c.id, { favorite: !c.favorite }))}
            onSave={(fields) => run(() => api.replace(c.id, { ...fields, favorite: c.favorite }))}
            onDelete={() => run(() => api.remove(c.id))}
          />
        ))}
      </ul>
    </div>
  )
}

type Fields = { name: string; email: string; phone: string }

function NewContactForm({ onCreate }: { onCreate: (input: Fields) => Promise<boolean> }) {
  const empty: Fields = { name: '', email: '', phone: '' }
  const [fields, setFields] = useState<Fields>(empty)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (await onCreate(fields)) setFields(empty) // keep the input if the server rejected it
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {(['name', 'email', 'phone'] as const).map((f) => (
        <label key={f}>
          {f[0].toUpperCase() + f.slice(1)}{' '}
          <input
            value={fields[f]}
            onChange={(e) => setFields({ ...fields, [f]: e.target.value })}
          />
        </label>
      ))}
      <button type="submit">Add contact</button>
    </form>
  )
}

type RowProps = {
  contact: Contact
  onToggleFavorite: () => void
  onSave: (fields: Fields) => Promise<boolean>
  onDelete: () => void
}

function ContactRow({ contact, onToggleFavorite, onSave, onDelete }: RowProps) {
  const [editing, setEditing] = useState(false)
  const [fields, setFields] = useState<Fields>(contact)

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (await onSave(fields)) setEditing(false)
  }

  if (editing) {
    return (
      <li>
        <form onSubmit={handleSave} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {(['name', 'email', 'phone'] as const).map((f) => (
            <label key={f}>
              Edit {f}{' '}
              <input
                value={fields[f]}
                onChange={(e) => setFields({ ...fields, [f]: e.target.value })}
              />
            </label>
          ))}
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </form>
      </li>
    )
  }

  return (
    <li style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <strong>
        {contact.favorite ? '★ ' : ''}
        {contact.name}
      </strong>
      <span>{contact.email}</span>
      {contact.phone && <span>{contact.phone}</span>}
      <button onClick={onToggleFavorite}>
        {contact.favorite ? 'Unfavorite' : 'Favorite'} {contact.name}
      </button>
      <button
        onClick={() => {
          setFields(contact)
          setEditing(true)
        }}
      >
        Edit {contact.name}
      </button>
      <button onClick={onDelete}>Delete {contact.name}</button>
    </li>
  )
}
