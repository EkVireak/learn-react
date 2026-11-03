# 11 – Context & useReducer

## Why this matters

When many components at different depths need the same data (current user, theme, cart, feature
flags), passing props through every level ("prop drilling") gets painful. Context solves that.
`useReducer` keeps complex state transitions in one pure, easily-tested function — the same idea
as Redux, which you'll meet in many existing codebases.

## Key concepts

- **Context** = a value available to a whole subtree without passing props:
  ```tsx
  const ThemeContext = createContext<ThemeValue | null>(null)
  <ThemeContext value={{ theme, toggle }}>{children}</ThemeContext>   // React 19 syntax
  const ctx = use(ThemeContext)  // or useContext(ThemeContext)
  ```
- Wrap it in a **custom hook** that throws if used outside the provider — gives a clear error and
  a non-null type:
  ```ts
  export function useTheme() {
    const ctx = useContext(ThemeContext)
    if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
    return ctx
  }
  ```
- Every consumer re-renders when the context value changes. Keep contexts focused (theme ≠ cart),
  and don't put fast-changing data in one giant context.
- **`useReducer(reducer, initialState)`** → `[state, dispatch]`. The reducer is a **pure** function
  `(state, action) => newState`. Model actions as a **discriminated union**:
  ```ts
  type Action =
    { type: 'add'; product: Product } | { type: 'remove'; id: number } | { type: 'clear' }
  ```
  TypeScript then knows exactly which fields exist inside each `case`.
- Context + reducer is a common "lightweight global store". For larger apps teams reach for
  Zustand, Redux Toolkit, or server-state libraries (exercises 13–14).

## Your task

1. `cart.ts` — implement `cartReducer` for actions `add` (adds or increments qty), `remove`
   (removes the line), `setQty` (qty ≤ 0 removes the line) and `clear`. Also `cartTotals(state)`
   returning `{ count, total }`. Pure functions only — no mutation!
2. `Exercise.tsx`:
   - `ThemeProvider` + `useTheme()` (throws outside provider). `ThemeToggle` button reads
     **"Switch to dark theme"** / **"Switch to light theme"**. The provider's wrapper `div` gets
     `data-theme={theme}`.
   - `CartProvider` + `useCart()` exposing `{ state, dispatch }` via `useReducer(cartReducer, ...)`.
   - `ProductGrid`: an **"Add <name>"** button per product.
   - `CartSummary`: `Items: N` and `Total: $X.XX`, a **"Clear cart"** button, and per line a
     **"Remove <name>"** button.

Run `npm test -- 11`.

## Stretch goals

- Persist the cart with your `useLocalStorage` hook from 08.
- Split the cart context in two (state / dispatch) so buttons that only dispatch don't re-render.

## Read more

- https://react.dev/learn/passing-data-deeply-with-context
- https://react.dev/learn/extracting-state-logic-into-a-reducer
- https://react.dev/learn/scaling-up-with-reducer-and-context
