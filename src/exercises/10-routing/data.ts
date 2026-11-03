export type Product = { id: number; name: string; price: number }

export const products: Product[] = [
  { id: 1, name: 'Keyboard', price: 49 },
  { id: 2, name: 'Mouse', price: 19.5 },
  { id: 3, name: 'Monitor', price: 189 },
  { id: 4, name: 'Desk lamp', price: 12 },
]

export const formatPrice = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
