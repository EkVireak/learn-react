// Exercise 07 – useEffect & data fetching
import { useState } from 'react'
import type { Post } from './types'

export const API = 'https://jsonplaceholder.typicode.com'

export default function UserPosts() {
  const [userId, setUserId] = useState(1)
  const [posts] = useState<Post[]>([])
  // TODO: add `status` state: 'loading' | 'error' | 'success'
  // TODO: add a way to trigger a retry (hint: a counter in state, used as an effect dependency)

  // TODO: useEffect that
  //   - creates an AbortController
  //   - sets status to 'loading'
  //   - fetches `${API}/posts?userId=${userId}` with { signal: controller.signal }
  //   - throws on !res.ok, otherwise stores the posts and sets 'success'
  //   - on error: ignore AbortError, otherwise set 'error'
  //   - returns a cleanup that aborts the controller

  // TODO: another small effect: document.title = `Posts of user ${userId}`

  return (
    <div>
      <label>
        User{' '}
        <select value={userId} onChange={(e) => setUserId(Number(e.target.value))}>
          {[1, 2, 3, 4, 5].map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </label>

      {/* TODO: "Loading…" / error alert with Retry button / list of titles */}
      <ul>
        {posts.map((p) => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
    </div>
  )
}
