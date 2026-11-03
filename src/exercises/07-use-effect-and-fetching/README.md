# 07 – useEffect & data fetching

## Why this matters

Talking to an API is part of nearly every ticket. You need to handle **loading**, **error** and
**success** states, and avoid the classic bugs: infinite loops, stale responses overwriting new
ones (race conditions), and setting state after unmount.

## Key concepts

- `useEffect(fn, deps)` runs **after** React paints, to **synchronize** with something outside
  React (network, timers, `document.title`, subscriptions, browser APIs).
- Dependency array:
  - `[]` → after first mount only.
  - `[userId]` → after mount and whenever `userId` changes.
  - no array → after **every** render (rarely what you want).
  - Include **every** value from the component that the effect uses. The lint rule
    `react-hooks/exhaustive-deps` helps — don't silence it, fix the code.
- **Cleanup**: return a function from the effect. It runs before the effect re-runs and on unmount.
  For fetches, use `AbortController` so an old request can't overwrite newer data.
- In development, `<StrictMode>` mounts → unmounts → mounts again. If your effect breaks when run
  twice, it's missing cleanup. (This is why you may see two requests in the Network tab.)
- **You might not need an effect**: computing values from props/state, or reacting to a click,
  does **not** need `useEffect`. Do it during render or in the event handler.
- In real projects, fetching is usually done by a library (TanStack Query → exercise 14), but
  you must understand what it does for you.

## Common mistakes

- `useEffect(async () => ...)` — the effect can't be async; define an async function inside and call it.
- Missing deps → stale values. Object/array/function deps created during render → infinite loop.
- Forgetting `res.ok` — `fetch` only rejects on network failure, **not** on 404/500.

## Your task (`Exercise.tsx`)

Build `UserPosts`:

1. A `<select>` labelled **"User"** with users 1–5 (default 1).
2. Whenever the user changes, fetch
   `https://jsonplaceholder.typicode.com/posts?userId=<id>` and render the post titles in a `<ul>`.
3. While loading show `Loading…`. On error show a `role="alert"` element containing
   `Failed to load posts` and a **Retry** button that fetches again.
4. Treat a non-2xx response as an error (`if (!res.ok) throw new Error(\`HTTP ${res.status}\`)`).
5. Pass an `AbortController` signal to `fetch` and **abort it in the cleanup**.
   Ignore `AbortError`s (they're expected).
6. Bonus effect: keep `document.title` in sync: `Posts of user <id>`.

Run `npm test -- 07` (the tests mock `fetch`, so no network needed).

## Stretch goals

- Show the number of posts in a heading.
- Extract the logic into a reusable `useFetch<T>(url)` hook.

## Read more

- https://react.dev/learn/synchronizing-with-effects
- https://react.dev/learn/you-might-not-need-an-effect ← very important
- https://react.dev/learn/lifecycle-of-reactive-effects
