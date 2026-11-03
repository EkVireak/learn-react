# 08 – useRef, useMemo, useCallback & custom hooks

## Why this matters

Custom hooks are how teams share logic (`useAuth`, `useDebounce`, `useMediaQuery`…). You'll read
them on day one and write them within your first weeks. You'll also be asked in interviews
"when would you use `useMemo`/`useCallback`?" — the honest answer is "less often than people think".

## Key concepts

- **`useRef`** gives you a mutable box `{ current }` that survives re-renders **without causing**
  them. Two uses:
  1. DOM access: `const inputRef = useRef<HTMLInputElement>(null)` → `<input ref={inputRef} />` →
     `inputRef.current?.focus()`.
  2. Remember a value between renders that isn't shown on screen (timer ids, previous value).
- **`useMemo(() => compute(a, b), [a, b])`** caches an expensive _calculation_ between renders.
- **`useCallback(fn, deps)`** caches a _function_ identity — useful only when passing it to a
  `memo()`-ised child or using it as an effect dependency.
- Don't memoize by default: it adds complexity, and the **React Compiler** can do it automatically.
  Measure first (React DevTools Profiler).
- **Custom hooks** = functions starting with `use` that call other hooks. They share _logic_,
  not _state_ — every component calling `useCounter()` gets its own state.
- Generics make hooks reusable: `function useLocalStorage<T>(key: string, initial: T)`.

## Your task

1. In `hooks.ts`, implement:
   - `useDebounce<T>(value: T, delay: number): T` — returns `value` only after it hasn't changed for
     `delay` ms (use `setTimeout` in an effect, clear it in cleanup).
   - `useLocalStorage<T>(key, initial)` — works like `useState` but reads the initial value from
     `localStorage` (JSON) and writes on every change. Wrap storage access in `try/catch`.
2. In `Exercise.tsx` (`NotesSearch`):
   - Notes are stored with `useLocalStorage<string[]>('notes', [...])`.
   - Input labelled **"New note"** + **Add** button.
   - Input labelled **"Search"** — focus it automatically on mount with a ref.
   - The filtered list uses the **debounced** query (300 ms) and `useMemo`.
   - A **"Focus search"** button focuses the search input via the ref.

Run `npm test -- 08`.

> `hooks.ts` is shared by Exercise and Solution in this folder; the reference implementation is
> in `hooks.solution.ts`.

## Stretch goals

- `usePrevious(value)` hook with a ref.
- Add a render counter with `useRef` and watch it in the UI — note it doesn't trigger re-renders.

## Read more

- https://react.dev/learn/referencing-values-with-refs
- https://react.dev/learn/manipulating-the-dom-with-refs
- https://react.dev/learn/reusing-logic-with-custom-hooks
- https://react.dev/reference/react/useMemo#should-you-add-usememo-everywhere
