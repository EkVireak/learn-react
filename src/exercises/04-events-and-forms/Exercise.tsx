// Exercise 04 – Events & controlled inputs
import { useState } from 'react'

const MAX = 140

export default function TweetBox() {
  const [text] = useState('') // TODO: you'll need the setter too
  const [posts] = useState<string[]>([])
  // TODO: add state for the "Add signature" checkbox

  // TODO: write handleSubmit(e: React.FormEvent<HTMLFormElement>) that:
  //   - calls e.preventDefault()
  //   - appends the text (+ " — Ada" if signature) to `posts` (immutably!)
  //   - clears the textarea

  // TODO: onKeyDown on the textarea: clear it when e.key === 'Escape'

  return (
    <form>
      <label htmlFor="tweet">What's happening?</label>
      <br />
      {/* TODO: make this controlled: value + onChange */}
      <textarea id="tweet" rows={3} cols={50} />
      <p>
        {text.length} / {MAX}
        {/* TODO: show "Too long!" when over MAX */}
      </p>

      {/* TODO: checkbox labelled "Add signature" */}

      {/* TODO: disable when empty (trimmed) or too long */}
      <button type="submit">Post</button>

      <ul>
        {/* lists are covered in 05 — this map is given to you */}
        {posts.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </form>
  )
}
