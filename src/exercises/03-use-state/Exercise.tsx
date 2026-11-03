// Exercise 03 – State with useState
import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  // TODO: implement increment, decrement (never below 0), addThree (use the updater form!) and reset
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count)}>+1</button>
      <button>−1</button>
      <button>+3</button>
      <button>Reset</button>
    </div>
  )
}

export function Toggle() {
  // TODO: add a boolean `open` state
  // TODO: button label "Show details" / "Hide details"; render <p>Secret details</p> when open
  return <button>Show details</button>
}

type Like = { liked: boolean; count: number }

export function LikeButton() {
  const [like] = useState<Like>({ liked: false, count: 41 })

  // TODO: on click, toggle `liked` and adjust `count` — create a NEW object, don't mutate `like`
  return <button>♡ {like.count}</button>
}

export default function Demo() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <Counter />
      <Toggle />
      <LikeButton />
    </div>
  )
}
