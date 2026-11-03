// Solution 05 – Lists, keys & conditional rendering
import { useState } from 'react'
import { fruits, type Fruit } from './data'

type Category = 'all' | Fruit['category']
const CATEGORIES: Category[] = ['all', 'berry', 'citrus', 'tropical']

export default function FruitList() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category>('all')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [ascending, setAscending] = useState(true)

  // Derived data: recomputed every render. Cheap for small lists — no need for state or memo.
  const q = query.trim().toLowerCase()
  const visible = fruits
    .filter((f) => f.name.toLowerCase().includes(q))
    .filter((f) => category === 'all' || f.category === category)
    .filter((f) => !inStockOnly || f.inStock)
    .toSorted((a, b) => (ascending ? 1 : -1) * a.name.localeCompare(b.name))

  return (
    <div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
      <label>
        Search <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <label>
        Category{' '}
        <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
        />{' '}
        In stock only
      </label>
      <button onClick={() => setAscending((a) => !a)}>{ascending ? 'Sort Z→A' : 'Sort A→Z'}</button>

      <p>
        Showing {visible.length} of {fruits.length}
      </p>

      {visible.length === 0 ? (
        <p>No fruits match</p>
      ) : (
        <ul>
          {visible.map((fruit) => (
            <li key={fruit.id}>
              {fruit.name}
              {!fruit.inStock && ' (out of stock)'}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
