// Solution 11 – Context & useReducer
import {
  createContext,
  useContext,
  useReducer,
  useState,
  type ActionDispatch,
  type ReactNode,
} from 'react'
import { cartReducer, cartTotals, initialCart } from './cart.solution'
import { PRODUCTS, type CartAction, type CartState } from './types'

/* ---------------- Theme ---------------- */
type Theme = 'light' | 'dark'
type ThemeValue = { theme: Theme; toggle: () => void }

const ThemeContext = createContext<ThemeValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  const styles =
    theme === 'dark'
      ? { background: '#1e1e24', color: '#f1f1f1', padding: 16, borderRadius: 8 }
      : { background: '#fafafa', color: '#1e1e24', padding: 16, borderRadius: 8 }

  return (
    <ThemeContext value={{ theme, toggle }}>
      <div data-theme={theme} style={styles}>
        {children}
      </div>
    </ThemeContext>
  )
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return <button onClick={toggle}>Switch to {theme === 'light' ? 'dark' : 'light'} theme</button>
}

/* ---------------- Cart ---------------- */
type CartValue = { state: CartState; dispatch: ActionDispatch<[CartAction]> }

const CartContext = createContext<CartValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCart)
  return <CartContext value={{ state, dispatch }}>{children}</CartContext>
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}

export function ProductGrid() {
  const { dispatch } = useCart()
  return (
    <ul>
      {PRODUCTS.map((p) => (
        <li key={p.id}>
          {p.name} (${p.price.toFixed(2)}){' '}
          <button onClick={() => dispatch({ type: 'add', product: p })}>Add {p.name}</button>
        </li>
      ))}
    </ul>
  )
}

export function CartSummary() {
  const { state, dispatch } = useCart()
  const { count, total } = cartTotals(state)

  return (
    <section aria-label="Cart">
      <p>Items: {count}</p>
      <ul>
        {state.lines.map(({ product, qty }) => (
          <li key={product.id}>
            {product.name} × {qty}{' '}
            <button onClick={() => dispatch({ type: 'remove', id: product.id })}>
              Remove {product.name}
            </button>
          </li>
        ))}
      </ul>
      <p>Total: ${total.toFixed(2)}</p>
      <button onClick={() => dispatch({ type: 'clear' })} disabled={count === 0}>
        Clear cart
      </button>
    </section>
  )
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
