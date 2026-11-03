// Solution 08 – custom hooks
import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id) // a new keystroke cancels the pending update
  }, [value, delay])

  return debounced
}

export function useLocalStorage<T>(key: string, initial: T) {
  // Lazy initializer: the function only runs on the first render.
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? initial : (JSON.parse(raw) as T)
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage full or unavailable — keep working in memory */
    }
  }, [key, value])

  return [value, setValue] as const
}
