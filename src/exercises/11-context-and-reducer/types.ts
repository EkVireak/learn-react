export type Product = { id: number; name: string; price: number }

export type CartLine = { product: Product; qty: number }
export type CartState = { lines: CartLine[] }

export type CartAction =
  | { type: 'add'; product: Product }
  | { type: 'remove'; id: number }
  | { type: 'setQty'; id: number; qty: number }
  | { type: 'clear' }

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Coffee', price: 3.5 },
  { id: 2, name: 'Bagel', price: 2.25 },
  { id: 3, name: 'Juice', price: 4 },
]
