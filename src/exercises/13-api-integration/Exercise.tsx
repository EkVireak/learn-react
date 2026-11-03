// Exercise 13 – API integration. Step 1: finish api.ts. Step 2: wire the UI below.
// The markup is given so you can focus on calling the API and handling tokens & errors.
import { useCallback, useState, type FormEvent } from 'react'
import { ApiError, createApiClient, createContactsApi, type ContactsApi } from './api'
import { API_KEY, API_URL, createTokenStore, type Contact, type User } from './types'

/** Turns any thrown value into a message a user can read. Given to you. */
function describe(err: unknown): string {
  if (err instanceof ApiError) {
    const details = err.details ? Object.entries(err.details).map(([f, m]) => `${f}: ${m}`) : []
    return [err.message, ...details].join(' · ')
  }
  return 'Network error — is the API running? (npm run api:contacts)'
}

export default function ContactsManager() {
  // The token lives in memory (not localStorage — see README). One store + client per component.
  const [{ api, tokens }] = useState(() => {
    const tokens = createTokenStore()
    const client = createApiClient({ baseUrl: API_URL, apiKey: API_KEY, getToken: tokens.get })
    return { api: createContactsApi(client), tokens }
  })
  const [user, setUser] = useState<User | null>(null)
  const [notice] = useState<string | null>(null) // TODO: you'll need the setter for "session expired"

  async function login(email: string, password: string) {
    // TODO: const session = await api.login(email, password)
    //       store it with tokens.set(session.token), then setUser(session.user)
    void [email, password, setUser, tokens]
  }

  async function logout() {
    // TODO: call api.logout() (ignore errors), clear the token (tokens.set(null)) and the user
  }

  // TODO: on any 401, clear the token + user and set the notice
  //       "Your session has expired. Please log in again."
  const onUnauthorized = useCallback(() => {}, [])

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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    try {
      await onLogin(email, password)
    } catch (err) {
      setError(describe(err)) // e.g. "Invalid email or password" from a 401
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
      <button type="submit">Log in</button>
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
  const [contacts] = useState<Contact[]>([])
  const [error] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  // TODO (GET): useEffect that loads api.list({ search }, controller.signal) whenever `search`
  //   changes (and after every mutation — hint: a `version` counter in the deps).
  //   - abort the request in the cleanup; ignore AbortError
  //   - 401 → onUnauthorized(); other errors → setError(describe(err))

  // TODO: a `run(mutation)` helper: await it, then reload the list; on 401 call onUnauthorized(),
  //   otherwise show describe(err). Return true/false so forms know whether to clear.
  void [api, onUnauthorized]

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 640 }}>
      <header style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span>Signed in as {user.name}</span>
        <button onClick={onLogout}>Log out</button>
      </header>

      {/* TODO (POST): api.create(input) */}
      <NewContactForm onCreate={async () => false} />

      <label>
        Search contacts <input value={search} onChange={(e) => setSearch(e.target.value)} />
      </label>

      {error && <p role="alert">{error}</p>}
      {contacts.length === 0 && <p>No contacts found</p>}

      <ul style={{ display: 'grid', gap: 8, padding: 0, listStyle: 'none' }}>
        {contacts.map((c) => (
          <ContactRow
            key={c.id}
            contact={c}
            // TODO (PATCH): api.update(c.id, { favorite: !c.favorite })
            onToggleFavorite={() => {}}
            // TODO (PUT): api.replace(c.id, { ...fields, favorite: c.favorite }) — PUT needs ALL fields
            onSave={async () => false}
            // TODO (DELETE): api.remove(c.id)
            onDelete={() => {}}
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
