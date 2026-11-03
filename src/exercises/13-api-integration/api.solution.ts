// Solution 13 – a typed API client
import type { Contact, ContactInput, LoginResponse } from './types'

/** Thrown for every non-2xx response, so callers can branch on `status`. */
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
    // 1. URL + query string (URLSearchParams handles encoding: spaces, &, é …)
    const url = new URL(baseUrl.replace(/\/$/, '') + path)
    for (const [key, value] of Object.entries(query ?? {})) {
      if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
    }

    // 2. Headers: API key identifies the APP, Bearer token identifies the USER.
    const headers: Record<string, string> = { Accept: 'application/json', 'x-api-key': apiKey }
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
    if (body !== undefined) headers['Content-Type'] = 'application/json'

    // 3. Send. fetch only rejects on network errors (offline, CORS, DNS)…
    const res = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })

    // 4. …so check the status yourself. 204 No Content has no body to parse.
    if (res.status === 204) return undefined as T
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      throw new ApiError(res.status, data?.error ?? `HTTP ${res.status}`, data?.details)
    }
    return data as T
  }

  return {
    get: <T>(path: string, options?: Options) => request<T>('GET', path, undefined, options),
    post: <T>(path: string, body?: unknown, options?: Options) =>
      request<T>('POST', path, body, options),
    put: <T>(path: string, body: unknown, options?: Options) =>
      request<T>('PUT', path, body, options),
    patch: <T>(path: string, body: unknown, options?: Options) =>
      request<T>('PATCH', path, body, options),
    delete: <T = void>(path: string, options?: Options) =>
      request<T>('DELETE', path, undefined, options),
  }
}

export type ApiClient = ReturnType<typeof createApiClient>

/** One function per endpoint: components never build URLs or headers themselves. */
export function createContactsApi(client: ApiClient) {
  return {
    login: (email: string, password: string) =>
      client.post<LoginResponse>('/auth/login', { email, password }),
    logout: () => client.post<void>('/auth/logout'),
    list: (params: { search?: string; favorite?: boolean } = {}, signal?: AbortSignal) =>
      client.get<Contact[]>('/contacts', { query: params, signal }),
    get: (id: string) => client.get<Contact>(`/contacts/${encodeURIComponent(id)}`),
    create: (input: Omit<ContactInput, 'favorite'> & { favorite?: boolean }) =>
      client.post<Contact>('/contacts', input),
    replace: (id: string, input: ContactInput) =>
      client.put<Contact>(`/contacts/${encodeURIComponent(id)}`, input),
    update: (id: string, patch: Partial<ContactInput>) =>
      client.patch<Contact>(`/contacts/${encodeURIComponent(id)}`, patch),
    remove: (id: string) => client.delete(`/contacts/${encodeURIComponent(id)}`),
  }
}

export type ContactsApi = ReturnType<typeof createContactsApi>
