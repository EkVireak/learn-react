export const API = 'https://jsonplaceholder.typicode.com'

export type Post = { id: number; userId: number; title: string; body: string }
export type NewPost = { userId: number; title: string; body: string }

export async function fetchPosts(userId: number): Promise<Post[]> {
  const res = await fetch(`${API}/posts?userId=${userId}&_limit=5`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

/** JSONPlaceholder fakes the write: it echoes the post back with id 101 but stores nothing. */
export async function createPost(input: NewPost): Promise<Post> {
  const res = await fetch(`${API}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
