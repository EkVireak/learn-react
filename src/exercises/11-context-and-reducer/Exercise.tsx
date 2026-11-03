// Exercise 11 – Context & useReducer
import { createContext, type ReactNode } from 'react'
import { PRODUCTS } from './types'

type Theme = 'light' | 'dark'
type ThemeValue = { theme: Theme; toggle: () => void }

const ThemeContext = createContext<ThemeValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  // TODO: theme state + toggle; provide { theme, toggle }; wrap children in <div data-theme={theme}>
  return <ThemeContext value={null}>{children}</ThemeContext>
}

export function useTheme(): ThemeValue {
  // TODO: read the context; throw new Error('useTheme must be used inside <ThemeProvider>') if null
  throw new Error('TODO: implement useTheme')
}

export function ThemeToggle() {
  // TODO: button "Switch to dark theme" / "Switch to light theme"
  return <button>Switch to dark theme</button>
}

// TODO: CartContext + CartProvider (useReducer(cartReducer, initialCart) from './cart') + useCart()

export function CartProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function ProductGrid() {
  // TODO: dispatch({ type: 'add', product }) from each "Add <name>" button
  return (
    <ul>
      {PRODUCTS.map((p) => (
        <li key={p.id}>
          {p.name} <button>Add {p.name}</button>
        </li>
      ))}
    </ul>
  )
}

export function CartSummary() {
  // TODO: Items: N, Total: $X.XX (toFixed(2)), "Remove <name>" per line, "Clear cart"
  return <p>Items: 0</p>
}

export default function Shop() {
  return (
    <ThemeProvider>
      <CartProvider>
        <ThemeToggle />
        <ProductGrid />
        <CartSummary />
      </CartProvider>
    </ThemeProvider>
  )
}
