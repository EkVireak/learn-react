// Solution 03 – State with useState
import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  // Updater functions receive the latest queued value, so three calls really add 3.
  const addThree = () => {
    setCount((c) => c + 1)
    setCount((c) => c + 1)
    setCount((c) => c + 1)
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
      <button onClick={() => setCount((c) => Math.max(0, c - 1))}>−1</button>
      <button onClick={addThree}>+3</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  )
}

export function Toggle() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {open ? 'Hide details' : 'Show details'}
      </button>
      {open && <p>Secret details</p>}
    </div>
  )
}

type Like = { liked: boolean; count: number }

export function LikeButton() {
  const [like, setLike] = useState<Like>({ liked: false, count: 41 })

  const toggle = () =>
    setLike((prev) => ({
      liked: !prev.liked,
      count: prev.liked ? prev.count - 1 : prev.count + 1,
    }))

  return (
    <button aria-pressed={like.liked} onClick={toggle}>
      {like.liked ? '♥' : '♡'} {like.count}
    </button>
  )
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
