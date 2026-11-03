export type Fruit = {
  id: number
  name: string
  category: 'berry' | 'citrus' | 'tropical'
  inStock: boolean
}

export const fruits: Fruit[] = [
  { id: 1, name: 'Strawberry', category: 'berry', inStock: true },
  { id: 2, name: 'Lemon', category: 'citrus', inStock: true },
  { id: 3, name: 'Mango', category: 'tropical', inStock: false },
  { id: 4, name: 'Blueberry', category: 'berry', inStock: false },
  { id: 5, name: 'Orange', category: 'citrus', inStock: true },
  { id: 6, name: 'Pineapple', category: 'tropical', inStock: true },
  { id: 7, name: 'Raspberry', category: 'berry', inStock: true },
  { id: 8, name: 'Lime', category: 'citrus', inStock: false },
]
