# 15 – Error boundaries, Suspense & lazy loading

## Why this matters

A single runtime error in one widget shouldn't blank the whole page, and users shouldn't
download code for screens they never open. Error boundaries and code-splitting are standard in
production apps, and `<Suspense>` is the foundation of modern React data loading (Next.js,
React Router, TanStack Query's suspense mode, the `use()` hook).

## Key concepts

- **Error boundary**: a component that catches errors thrown while **rendering** its children and
  shows a fallback. Still has to be a **class component**:
  ```tsx
  class ErrorBoundary extends Component<Props, State> {
    state = { error: null }
    static getDerivedStateFromError(error) {
      return { error }
    } // switch to fallback
    componentDidCatch(error, info) {
      logToService(error, info)
    } // side effects (Sentry…)
    render() {
      return this.state.error ? fallback : this.props.children
    }
  }
  ```
  Many teams use the `react-error-boundary` package instead of writing their own.
- Error boundaries **don't** catch errors in event handlers, timers or async code — use
  `try/catch` there and put the error in state.
- **Code-splitting** with `lazy(() => import('./HeavyChart'))` creates a separate JS chunk that is
  only downloaded the first time it renders.
- **`<Suspense fallback={...}>`** shows the fallback while anything inside is "suspended"
  (lazy code loading, or data with `use(promise)` / suspense-enabled libraries).
- Place boundaries thoughtfully: one around the whole app (last resort) plus smaller ones around
  independent widgets.

## Your task

1. In `Exercise.tsx` implement `ErrorBoundary`:
   - props: `children` and `fallback: (error: Error, reset: () => void) => ReactNode`
   - `getDerivedStateFromError` stores the error; `componentDidCatch` logs it with `console.error`
   - `reset()` clears the error so children render again.
2. Wrap `BuggyCounter` (from `Buggy.tsx` — it throws when it reaches 3) in your boundary. Fallback:
   `role="alert"` containing `Something went wrong: <message>` and a **"Try again"** button.
3. Lazy-load `HeavyChart.tsx` with `lazy()`; a **"Show chart"** button reveals it inside
   `<Suspense fallback={<p>Loading chart…</p>}>`. Check the Network tab in `npm run dev`: the chunk
   loads only when you click.

Run `npm test -- 15`.

## Stretch goals

- Add a `resetKeys` prop: auto-reset when any key changes.
- Try `react-error-boundary` and compare the API.
- Load data with `use(promise)` inside `<Suspense>`.

## Read more

- https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
- https://react.dev/reference/react/lazy
- https://react.dev/reference/react/Suspense
