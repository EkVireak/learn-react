// Solution 14 – Server state with TanStack Query
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { createPost, fetchPosts, type Post } from './api'

export function PostsPanel() {
  const [userId, setUserId] = useState(1)
  const [title, setTitle] = useState('')
  const queryClient = useQueryClient()

  const postsQuery = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchPosts(userId),
  })

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: (post) => {
      // The fake API doesn't persist, so update the cache ourselves instead of invalidating.
      queryClient.setQueryData<Post[]>(['posts', post.userId], (old = []) => [post, ...old])
      setTitle('')
    },
  })

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!title.trim()) return
    mutation.mutate({ userId, title: title.trim(), body: '' })
  }

  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
      <label>
        User{' '}
        <select value={userId} onChange={(e) => setUserId(Number(e.target.value))}>
          {[1, 2, 3].map((id) => (
            <option key={id}>{id}</option>
          ))}
        </select>
      </label>

      <form onSubmit={handleSubmit}>
        <label>
          Title <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>{' '}
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Creating…' : 'Create post'}
        </button>
        {mutation.isError && <p role="status">Could not create post</p>}
      </form>

      {postsQuery.isPending ? (
        <p>Loading…</p>
      ) : postsQuery.isError ? (
        <div role="alert">
          <p>Failed to load posts</p>
          <button onClick={() => postsQuery.refetch()}>Retry</button>
        </div>
      ) : (
        <ul>
          {postsQuery.data.map((p) => (
            <li key={p.id}>{p.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

const queryClient = new QueryClient()

export default function () {
  return (
    <QueryClientProvider client={queryClient}>
      <PostsPanel />
    </QueryClientProvider>
  )
}
