import { useEffect, useState } from 'react'

type GitHubUser = { login: string; name: string | null; avatar_url: string; followers: number }

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; user: GitHubUser }

/** Render with `key={username}` if the username can change, so state resets to loading. */
export function UserCard({ username }: { username: string }) {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (res.status === 404) throw new Error('User not found')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        setState({ status: 'success', user: await res.json() })
      })
      .catch((err: Error) => {
        if (err.name !== 'AbortError') setState({ status: 'error', message: err.message })
      })
    return () => controller.abort()
  }, [username])

  if (state.status === 'loading') return <p>Loading user…</p>
  if (state.status === 'error') return <p role="alert">{state.message}</p>

  const { user } = state
  return (
    <article aria-label="GitHub user">
      <img src={user.avatar_url} alt={`${user.login}'s avatar`} width={64} height={64} />
      <h3>{user.name ?? user.login}</h3>
      <p>{user.followers} followers</p>
    </article>
  )
}
