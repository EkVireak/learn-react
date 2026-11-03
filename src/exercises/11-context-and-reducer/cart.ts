// Exercise 11 – your reducer. Reference: cart.solution.ts
import type { CartAction, CartState } from './types'

export const initialCart: CartState = { lines: [] }

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add':
      // TODO: if the product is already in the cart, increment its qty, else append { product, qty: 1 }
      return state
    case 'remove':
      // TODO: filter out the line
      return state
    case 'setQty':
      // TODO: update qty; remove the line when qty <= 0
      return state
    case 'clear':
      // TODO
      return state
  }
}

export function cartTotals(state: CartState) {
  // TODO: count = sum of qty, total = sum of qty * price
  void state
  return { count: 0, total: 0 }
}
