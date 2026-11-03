# 13 – API integration: CRUD with an API key & auth token

## Why this matters

Most frontend tickets end in "…and save it to the API". You'll read API docs (or a Swagger/OpenAPI
page), call endpoints with the right **method**, **headers** and **body**, send credentials, and
handle every status code the server can return. Teams almost always wrap this in a small
**API client** so components never build URLs or headers themselves. That's what you'll build here.

## Setup

```bash
cp .env.example .env   # optional: the code falls back to the same demo values
npm run api:contacts   # real HTTP server on http://localhost:3002 (in-memory, resets on restart)
npm run dev            # in another terminal
```

Login: `ada@example.com` / `password123`. Open DevTools → **Network** while you use the app: click a
request to see its method, headers (`x-api-key`, `Authorization`), payload and response.
The full API contract is documented at the top of `mock-server.ts`.

## Key concepts

### HTTP methods (REST)

| Method   | Meaning                                            | Example                                    | Typical success                 |
| -------- | -------------------------------------------------- | ------------------------------------------ | ------------------------------- |
| `GET`    | Read; never changes data                           | `GET /contacts?search=al`                  | `200` + JSON                    |
| `POST`   | Create (or run an action like login)               | `POST /contacts` + body                    | `201 Created` + new item        |
| `PUT`    | **Replace** the whole resource: send _every_ field | `PUT /contacts/2` + full body              | `200` + item                    |
| `PATCH`  | **Update** some fields: send only what changed     | `PATCH /contacts/2` `{ "favorite": true }` | `200` + item                    |
| `DELETE` | Remove                                             | `DELETE /contacts/2`                       | `204 No Content` (**no body!**) |

"Update" in specs usually means PUT or PATCH. Check which one the API docs ask for. A PUT that
leaves out a field either fails (this API returns `422`) or wipes that field on many real APIs.

### Status codes you must handle

`200` OK · `201` Created · `204` No Content · `400` Bad Request (malformed) ·
`401` Unauthorized (**not logged in / token expired** → send the user to login) ·
`403` Forbidden (logged in but not allowed, or bad API key) · `404` Not Found ·
`409` Conflict · `422` Unprocessable (validation errors, usually with field details) · `5xx` server bug.

`fetch` only **rejects** on network failures (offline, DNS, CORS). A `404` or `500` _resolves_
normally, so you must check `res.ok` / `res.status` yourself.

### Headers: API key vs token

- **API key** (`x-api-key: …`): identifies the **application**. It's the same for every user.
  Some APIs use a query param (`?api_key=`) instead. Read the docs.
- **Bearer token** (`Authorization: Bearer <token>`): identifies the **logged-in user**. You get it
  from a login endpoint (often a **JWT**) and send it with every protected request. When it expires,
  the server answers `401` and you log the user out (or refresh the token).
- `Content-Type: application/json` tells the server how to read your body. Send it only when there is a body.

### Security, which reviewers _will_ ask about

- **Anything in frontend code is public.** `VITE_*` env vars are compiled into the JS bundle. A key
  that must stay secret (Stripe secret key, OpenAI key, DB password) belongs on a **server** (your
  backend or a "BFF"/proxy), never in React. Public keys (maps, analytics) are fine.
- `.env.example` is the committed **template** listing every variable a project needs. Each developer
  copies it to `.env` (git-ignored) and fills in their own values, so real keys never end up in git.
- Where to keep the token:
  - **in memory** (this exercise): safest from XSS, but lost on refresh;
  - **`localStorage`**: survives refresh, but any injected script can read it;
  - **httpOnly cookie** set by the server: JS can't read it at all; the most secure, common in production.
- **CORS**: the browser blocks calls to another origin unless the server allows it. Custom headers
  like `Authorization` trigger a **preflight `OPTIONS`** request first (you'll see it in the Network tab).
  CORS errors are fixed on the **server**, not in React.

## Your task

**Step 1 – `api.ts`: the API client** (`npm test -- 13` → the "API client" tests)

1. `request()` inside `createApiClient`:
   - build the URL from `baseUrl + path` and add `query` params with `URLSearchParams`
     (skip `undefined` and `''`);
   - always send `x-api-key`, send `Authorization: Bearer <token>` when `getToken()` returns one,
     and `Content-Type: application/json` only when there's a body;
   - `JSON.stringify` the body; pass `signal` through;
   - `204` → return `undefined`; non-2xx → `throw new ApiError(status, data.error, data.details)`.
2. Implement `put`, `patch` and `delete` like `get`/`post`.
3. Fix every `/TODO` path in `createContactsApi` (`/contacts`, `/contacts/:id`, query params for `list`).

**Step 2 – `Exercise.tsx`: wire the UI** (the "ContactsManager UI" tests)

4. `login`: store the token with `tokens.set(token)` (the client reads it via `getToken`) and the
   user in state. `logout`: call the API and clear both.
5. **GET**: load contacts in an effect when `search` changes; abort in the cleanup.
6. **POST** "Add contact", **PATCH** favorite toggle, **PUT** "Edit → Save" (send _all_ fields),
   **DELETE**; reload the list after each one.
7. Show API errors in a `role="alert"` (the 422 details too, via `describe(err)`).
   On **any 401**, clear the session and show **"Your session has expired. Please log in again."**

## Stretch goals

- Add a 10-second **timeout** with `AbortSignal.timeout(10_000)` combined with the caller's signal (`AbortSignal.any`).
- Persist the token in `sessionStorage` and restore it on load. What are the trade-offs?
- Make the favorite toggle **optimistic**: update the UI first, roll back if the PATCH fails.
- Rewrite the data loading with TanStack Query (that's the next exercise!).
- Try a real public API that needs a key, such as https://openweathermap.org/api.

## Read more

- https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
- https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
- https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
- https://vite.dev/guide/env-and-mode
