import { useState } from 'react'

/** Throws during render when the count reaches 3 — simulating a bug in a widget. */
export function BuggyCounter() {
  const [count, setCount] = useState(0)
  if (count === 3) throw new Error('Counter exploded at 3')
  return <button onClick={() => setCount((c) => c + 1)}>Clicked {count} times</button>
}
