// Exercise 13 – YOUR typed API client. Reference: api.solution.ts (try first!)
import type { Contact, ContactInput, LoginResponse } from './types'

/** Thrown for every non-2xx response, so callers can branch on `status`. Given to you. */
export class ApiError extends Error {
  status: number
  details?: Record<string, string>

  constructor(status: number, message: string, details?: Record<string, string>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
type Query = Record<string, string | number | boolean | undefined>
type Options = { query?: Query; signal?: AbortSignal }

export type ApiConfig = {
  baseUrl: string
  apiKey: string
  /** Called on every request, so the client always uses the latest token. */
  getToken: () => string | null
}

export function createApiClient({ baseUrl, apiKey, getToken }: ApiConfig) {
  async function request<T>(
    method: Method,
    path: string,
    body?: unknown,
    { query, signal }: Options = {},
  ): Promise<T> {
    // TODO 1: build the URL: new URL(baseUrl + path), then add every defined, non-empty
    //         `query` entry with url.searchParams.set(key, String(value))
    // TODO 2: headers:
    //         - 'x-api-key': apiKey                       (always)
    //         - Authorization: `Bearer ${token}`          (only if getToken() returns one)
    //         - 'Content-Type': 'application/json'        (only when sending a body)
    // TODO 3: const res = await fetch(url, { method, headers, body: JSON.stringify(body) or undefined, signal })
    // TODO 4: if res.status === 204 → return undefined as T (no body!)
    //         parse JSON; if !res.ok → throw new ApiError(res.status, data.error, data.details)
    //         otherwise return the data
    void [method, path, body, query, signal, baseUrl, apiKey, getToken]
    throw new Error('TODO: implement request()')
  }

  return {
    get: <T>(path: string, options?: Options) => request<T>('GET', path, undefined, options),
    post: <T>(path: string, body?: unknown, options?: Options) =>
      request<T>('POST', path, body, options),
    // TODO: put, patch and delete — same shape as get/post above
    put: <T>(path: string, body: unknown, options?: Options): Promise<T> => {
      void [path, body, options]
      throw new Error('TODO: put')
    },
    patch: <T>(path: string, body: unknown, options?: Options): Promise<T> => {
      void [path, body, options]
      throw new Error('TODO: patch')
    },
    delete: <T = void>(path: string, options?: Options): Promise<T> => {
      void [path, options]
      throw new Error('TODO: delete')
    },
  }
}

export type ApiClient = ReturnType<typeof createApiClient>

/** One function per endpoint: components never build URLs or headers themselves. */
export function createContactsApi(client: ApiClient) {
  return {
    login: (email: string, password: string) =>
      client.post<LoginResponse>('/auth/login', { email, password }),
    logout: () => client.post<void>('/auth/logout'),
    // TODO: GET /contacts with { search, favorite } as query params
    list: (params: { search?: string; favorite?: boolean } = {}, signal?: AbortSignal) =>
      client.get<Contact[]>('/contacts', { signal, query: { TODO: String(params) } }),
    // TODO: GET /contacts/:id
    get: (id: string) => client.get<Contact>(`/TODO/${id}`),
    // TODO: POST /contacts with the input as body
    create: (input: Omit<ContactInput, 'favorite'> & { favorite?: boolean }) =>
      client.post<Contact>('/TODO', input),
    // TODO: PUT /contacts/:id — the FULL contact (replace)
    replace: (id: string, input: ContactInput) => client.put<Contact>(`/TODO/${id}`, input),
    // TODO: PATCH /contacts/:id — only the changed fields
    update: (id: string, patch: Partial<ContactInput>) =>
      client.patch<Contact>(`/TODO/${id}`, patch),
    // TODO: DELETE /contacts/:id
    remove: (id: string) => client.delete(`/TODO/${id}`),
  }
}

export type ContactsApi = ReturnType<typeof createContactsApi>
