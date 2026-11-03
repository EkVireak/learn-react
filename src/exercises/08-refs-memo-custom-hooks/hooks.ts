// Exercise 08 – your custom hooks. Reference implementation: hooks.solution.ts
import { useState } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  // TODO: keep a `debounced` state; in an effect start a setTimeout(delay) that copies `value`
  //       into it, and clear the timer in the cleanup. Deps: [value, delay]
  void delay
  return value
}

export function useLocalStorage<T>(key: string, initial: T) {
  // TODO: lazy initial state: useState(() => read localStorage[key] (JSON.parse) ?? initial)
  // TODO: effect that writes JSON.stringify(value) to localStorage[key] when value/key change
  // Wrap storage access in try/catch (private mode, quota, invalid JSON...)
  void key
  return useState<T>(initial)
}
