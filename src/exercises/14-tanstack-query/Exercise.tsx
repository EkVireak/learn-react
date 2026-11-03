// Exercise 14 – Server state with TanStack Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function PostsPanel() {
  const [userId, setUserId] = useState(1)
  // TODO: const { data, isPending, isError, refetch } = useQuery({ queryKey: [...], queryFn: ... })
  // TODO: const queryClient = useQueryClient()
  // TODO: const [title, setTitle] = useState('')
  // TODO: const mutation = useMutation({ mutationFn: createPost, onSuccess: (post) => setQueryData(...) })

  return (
    <div>
      <label>
        User{' '}
        <select value={userId} onChange={(e) => setUserId(Number(e.target.value))}>
          {[1, 2, 3].map((id) => (
            <option key={id}>{id}</option>
          ))}
        </select>
      </label>

      {/* TODO: form: input labelled "Title" + "Create post" / "Creating…" button + error */}
      {/* TODO: Loading… / alert + Retry / list of titles */}
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
