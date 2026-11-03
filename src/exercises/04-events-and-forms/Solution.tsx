// Solution 04 – Events & controlled inputs
import { useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react'

const MAX = 140

export default function TweetBox() {
  const [text, setText] = useState('')
  const [signature, setSignature] = useState(false)
  const [posts, setPosts] = useState<string[]>([])

  // Derived values: computed during render, no extra state needed.
  const tooLong = text.length > MAX
  const canPost = text.trim().length > 0 && !tooLong

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Escape') setText('')
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canPost) return
    const final = signature ? `${text} — Ada` : text
    setPosts((prev) => [...prev, final])
    setText('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="tweet">What's happening?</label>
      <br />
      <textarea
        id="tweet"
        rows={3}
        cols={50}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <p style={{ color: tooLong ? 'var(--danger)' : undefined }}>
        {text.length} / {MAX}
        {tooLong && ' Too long!'}
      </p>

      <label>
        <input
          type="checkbox"
          checked={signature}
          onChange={(e) => setSignature(e.target.checked)}
        />{' '}
        Add signature
      </label>
      <br />

      <button type="submit" disabled={!canPost}>
        Post
      </button>

      <ul>
        {posts.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </form>
  )
}
