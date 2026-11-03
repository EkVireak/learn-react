export type { Contact } from './mock-server'

export type ContactInput = { name: string; email: string; phone: string; favorite: boolean }
export type User = { id: string; name: string; email: string }
export type LoginResponse = { token: string; user: User }

/** Where the API lives and the public API key — read from `.env` (copy `.env.example`), with demo fallbacks. */
export const API_URL: string = import.meta.env.VITE_CONTACTS_API_URL ?? 'http://localhost:3002'
export const API_KEY: string = import.meta.env.VITE_CONTACTS_API_KEY ?? 'demo-key-123'

/** Holds the auth token outside React state: the API client reads it on every request. */
export function createTokenStore() {
  let token: string | null = null
  return {
    get: () => token,
    set: (value: string | null) => {
      token = value
    },
  }
}
