// Solution 11 – cart reducer
import type { CartAction, CartState } from './types'

export const initialCart: CartState = { lines: [] }

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const exists = state.lines.some((l) => l.product.id === action.product.id)
      return {
        lines: exists
          ? state.lines.map((l) =>
              l.product.id === action.product.id ? { ...l, qty: l.qty + 1 } : l,
            )
          : [...state.lines, { product: action.product, qty: 1 }],
      }
    }
    case 'remove':
      return { lines: state.lines.filter((l) => l.product.id !== action.id) }
    case 'setQty':
      return {
        lines: state.lines
          .map((l) => (l.product.id === action.id ? { ...l, qty: action.qty } : l))
          .filter((l) => l.qty > 0),
      }
    case 'clear':
      return initialCart
  }
}

export function cartTotals(state: CartState) {
  return state.lines.reduce(
    (acc, l) => ({ count: acc.count + l.qty, total: acc.total + l.qty * l.product.price }),
    { count: 0, total: 0 },
  )
}
