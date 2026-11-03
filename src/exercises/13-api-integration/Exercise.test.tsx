import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ApiError, createApiClient, createContactsApi } from './api'
import ContactsManager from './Exercise'
import { createMockApi, DEMO } from './mock-server'

/** Replaces global fetch with the in-memory mock server (same code as `npm run api:contacts`). */
function installServer() {
  const server = createMockApi()
  const fetchMock = vi.fn((input: string | URL | Request, init?: RequestInit) =>
    server.handle(
      new Request(String(input), {
        method: init?.method,
        headers: init?.headers,
        body: init?.body,
      }),
    ),
  )
  vi.stubGlobal('fetch', fetchMock)
  const lastCall = () => {
    const [input, init] = fetchMock.mock.calls.at(-1)!
    return {
      url: String(input),
      method: init?.method ?? 'GET',
      headers: new Headers(init?.headers),
    }
  }
  return { server, fetchMock, lastCall }
}

function makeApi(apiKey: string = DEMO.apiKey) {
  let token: string | null = null
  const client = createApiClient({
    baseUrl: 'http://api.test',
    apiKey,
    getToken: () => token,
  })
  const api = createContactsApi(client)
  const loginAsAda = async () => {
    token = (await api.login(DEMO.email, DEMO.password)).token
  }
  return { client, api, loginAsAda }
}

const rejection = (promise: Promise<unknown>) =>
  promise.then(
    () => {
      throw new Error('expected the request to fail')
    },
    (err: unknown) => err as ApiError,
  )

describe('13 – API client: auth headers', () => {
  it('sends the API key on every request, and no token before login', async () => {
    const { lastCall } = installServer()
    const { api } = makeApi()
    const err = await rejection(api.login(DEMO.email, 'wrong'))
    expect(err).toBeInstanceOf(ApiError)
    expect(err.status).toBe(401)
    expect(err.message).toBe('Invalid email or password')
    expect(lastCall().headers.get('x-api-key')).toBe(DEMO.apiKey)
    expect(lastCall().headers.get('authorization')).toBeNull()
  })

  it('fails with 403 when the API key is wrong', async () => {
    installServer()
    const { api } = makeApi('wrong-key')
    const err = await rejection(api.login(DEMO.email, DEMO.password))
    expect(err.status).toBe(403)
  })

  it('needs a Bearer token for /contacts (401 without, 200 with)', async () => {
    const { lastCall } = installServer()
    const { api, loginAsAda } = makeApi()
    expect((await rejection(api.list())).status).toBe(401)

    await loginAsAda()
    expect(await api.list()).toHaveLength(3)
    expect(lastCall().headers.get('authorization')).toMatch(/^Bearer tok_/)
  })
})

describe('13 – API client: CRUD', () => {
  it('GET with query params', async () => {
    const { lastCall } = installServer()
    const { api, loginAsAda } = makeApi()
    await loginAsAda()

    const found = await api.list({ search: 'grace' })
    expect(found.map((c) => c.name)).toEqual(['Grace Hopper'])
    expect(lastCall().url).toBe('http://api.test/contacts?search=grace')

    expect(await api.list({ favorite: true })).toHaveLength(1)
    expect(lastCall().url).toBe('http://api.test/contacts?favorite=true')

    await api.list({ search: '' }) // empty values are left out
    expect(lastCall().url).toBe('http://api.test/contacts')

    expect((await api.get('2')).name).toBe('Alan Turing')
    expect(lastCall()).toMatchObject({ method: 'GET', url: 'http://api.test/contacts/2' })
  })

  it('POST creates (201) and surfaces 422 validation details', async () => {
    const { lastCall } = installServer()
    const { api, loginAsAda } = makeApi()
    await loginAsAda()

    const created = await api.create({ name: 'Linus', email: 'linus@example.com', phone: '' })
    expect(created).toMatchObject({ id: expect.any(String), name: 'Linus', favorite: false })
    expect(lastCall().method).toBe('POST')
    expect(lastCall().headers.get('content-type')).toBe('application/json')

    const err = await rejection(api.create({ name: 'Bo', email: 'nope', phone: '' }))
    expect(err.status).toBe(422)
    expect(err.details).toEqual({ email: 'Must be a valid email' })
  })

  it('PUT replaces the whole resource (every field required)', async () => {
    const { lastCall } = installServer()
    const { api, client, loginAsAda } = makeApi()
    await loginAsAda()

    const err = await rejection(client.put('/contacts/2', { name: 'Only a name' }))
    expect(err.status).toBe(422)

    const replaced = await api.replace('2', {
      name: 'Alan M. Turing',
      email: 'turing@example.com',
      phone: '',
      favorite: true,
    })
    expect(replaced).toEqual({
      id: '2',
      name: 'Alan M. Turing',
      email: 'turing@example.com',
      phone: '',
      favorite: true,
    })
    expect(lastCall()).toMatchObject({ method: 'PUT', url: 'http://api.test/contacts/2' })
  })

  it('PATCH changes only the fields you send', async () => {
    const { lastCall } = installServer()
    const { api, loginAsAda } = makeApi()
    await loginAsAda()
    const updated = await api.update('2', { favorite: true })
    expect(updated).toMatchObject({
      name: 'Alan Turing',
      email: 'alan@example.com',
      favorite: true,
    })
    expect(lastCall()).toMatchObject({ method: 'PATCH', url: 'http://api.test/contacts/2' })
  })

  it('DELETE returns nothing (204), then the resource is 404', async () => {
    const { lastCall } = installServer()
    const { api, loginAsAda } = makeApi()
    await loginAsAda()
    await expect(api.remove('3')).resolves.toBeUndefined()
    expect(lastCall()).toMatchObject({ method: 'DELETE', url: 'http://api.test/contacts/3' })
    expect((await rejection(api.get('3'))).status).toBe(404)
  })
})

describe('13 – ContactsManager UI', () => {
  async function logIn(user: ReturnType<typeof userEvent.setup>, password: string = DEMO.password) {
    await user.type(screen.getByLabelText('Email'), DEMO.email)
    await user.type(screen.getByLabelText('Password'), password)
    await user.click(screen.getByRole('button', { name: 'Log in' }))
  }

  it('shows the server error for bad credentials, then logs in and lists contacts', async () => {
    installServer()
    const user = userEvent.setup()
    render(<ContactsManager />)

    await logIn(user, 'wrong')
    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password')

    await user.clear(screen.getByLabelText('Password'))
    await user.type(screen.getByLabelText('Password'), DEMO.password)
    await user.click(screen.getByRole('button', { name: 'Log in' }))
    expect(await screen.findByText('Signed in as Ada Lovelace')).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'Edit Grace Hopper' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('creates a contact (POST) and shows validation errors (422)', async () => {
    installServer()
    const user = userEvent.setup()
    render(<ContactsManager />)
    await logIn(user)
    await screen.findByRole('button', { name: 'Edit Alan Turing' })

    await user.type(screen.getByLabelText('Name'), 'Linus')
    await user.type(screen.getByLabelText('Email'), 'not-an-email')
    await user.click(screen.getByRole('button', { name: 'Add contact' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('email: Must be a valid email')
    expect(screen.getByLabelText('Name')).toHaveValue('Linus') // input kept

    await user.clear(screen.getByLabelText('Email'))
    await user.type(screen.getByLabelText('Email'), 'linus@example.com')
    await user.click(screen.getByRole('button', { name: 'Add contact' }))
    expect(await screen.findByRole('button', { name: 'Delete Linus' })).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toHaveValue('')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('favorites (PATCH), edits (PUT) and deletes (DELETE)', async () => {
    const { fetchMock } = installServer()
    const user = userEvent.setup()
    render(<ContactsManager />)
    await logIn(user)

    await user.click(await screen.findByRole('button', { name: 'Favorite Alan Turing' }))
    expect(
      await screen.findByRole('button', { name: 'Unfavorite Alan Turing' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Edit Alan Turing' }))
    await user.clear(screen.getByLabelText('Edit name'))
    await user.type(screen.getByLabelText('Edit name'), 'Alan M. Turing')
    await user.click(screen.getByRole('button', { name: 'Save' }))
    const row = (await screen.findByRole('button', { name: 'Delete Alan M. Turing' })).closest(
      'li',
    )!
    expect(within(row).getByText(/★/)).toBeInTheDocument() // PUT kept favorite: true

    await user.click(screen.getByRole('button', { name: 'Delete Alan M. Turing' }))
    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(2))
    expect(screen.queryByText(/Alan M. Turing/)).not.toBeInTheDocument()

    const methods = fetchMock.mock.calls.map(([, init]) => init?.method ?? 'GET')
    expect(methods).toEqual(expect.arrayContaining(['PATCH', 'PUT', 'DELETE']))
  })

  it('searches via the query string', async () => {
    const { fetchMock } = installServer()
    const user = userEvent.setup()
    render(<ContactsManager />)
    await logIn(user)
    await screen.findByRole('button', { name: 'Edit Alan Turing' })

    await user.type(screen.getByLabelText('Search contacts'), 'marg')
    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(1))
    expect(screen.getByRole('listitem')).toHaveTextContent('Margaret Hamilton')
    expect(fetchMock.mock.calls.some(([url]) => String(url).endsWith('?search=marg'))).toBe(true)
  })

  it('sends the user back to login when the token expires (401)', async () => {
    const { server } = installServer()
    const user = userEvent.setup()
    render(<ContactsManager />)
    await logIn(user)
    const fav = await screen.findByRole('button', { name: 'Favorite Alan Turing' })

    server.expireAllTokens()
    await user.click(fav)
    expect(await screen.findByRole('button', { name: 'Log in' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Your session has expired')
  })

  it('logs out', async () => {
    installServer()
    const user = userEvent.setup()
    render(<ContactsManager />)
    await logIn(user)
    await user.click(await screen.findByRole('button', { name: 'Log out' }))
    expect(await screen.findByRole('button', { name: 'Log in' })).toBeInTheDocument()
  })
})
