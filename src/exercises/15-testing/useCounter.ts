import { useCallback, useState } from 'react'

type Options = { initial?: number; min?: number; max?: number }

export function useCounter({ initial = 0, min = -Infinity, max = Infinity }: Options = {}) {
  const [count, setCount] = useState(initial)
  const clamp = useCallback((n: number) => Math.min(max, Math.max(min, n)), [min, max])

  return {
    count,
    increment: () => setCount((c) => clamp(c + 1)),
    decrement: () => setCount((c) => clamp(c - 1)),
    reset: () => setCount(initial),
  }
}
