// Solution 07 – useEffect & data fetching
import { useEffect, useState } from 'react'
import type { Post } from './types'

export const API = 'https://jsonplaceholder.typicode.com'

type Status = 'loading' | 'error' | 'success'

export default function UserPosts() {
  const [userId, setUserId] = useState(1)
  const [posts, setPosts] = useState<Post[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [attempt, setAttempt] = useState(0) // bump to re-run the effect (Retry)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setStatus('loading')
      try {
        const res = await fetch(`${API}/posts?userId=${userId}`, { signal: controller.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = (await res.json()) as Post[]
        setPosts(data)
        setStatus('success')
      } catch (err) {
        // Aborting is expected when userId changes or the component unmounts.
        if (err instanceof DOMException && err.name === 'AbortError') return
        setStatus('error')
      }
    }

    load()
    // Cleanup: cancel the in-flight request so a slow old response can't win the race.
    return () => controller.abort()
  }, [userId, attempt])

  useEffect(() => {
    document.title = `Posts of user ${userId}`
  }, [userId])

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

      {status === 'loading' && <p>Loading…</p>}

      {status === 'error' && (
        <div role="alert">
          <p>Failed to load posts</p>
          <button onClick={() => setAttempt((a) => a + 1)}>Retry</button>
        </div>
      )}

      {status === 'success' && (
        <ul>
          {posts.map((p) => (
            <li key={p.id}>{p.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
