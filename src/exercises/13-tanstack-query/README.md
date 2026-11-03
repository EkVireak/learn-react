# 13 – Server state with TanStack Query

## Why this matters

In exercise 07 you hand-wrote loading/error state, abort logic and retry. Real apps also need
caching, de-duplication, background refetching, pagination and cache updates after a mutation.
**TanStack Query** (formerly React Query) does all of that and is one of the most used libraries
in React job listings.

## Key concepts

- **Server state ≠ client state.** Data from the API is a _cache_ of something the server owns.
  Don't copy it into `useState`; let a query library manage it.
- Setup once: `const queryClient = new QueryClient()` + `<QueryClientProvider client={queryClient}>`.
- **Queries** read data:
  ```ts
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ['posts', userId], // cache key — include every variable the fetch uses
    queryFn: () => fetchPosts(userId), // must throw on error
  })
  ```
  Same key anywhere in the app → same cached data, one request.
- **Mutations** change data:
  ```ts
  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }), // refetch
  })
  mutation.mutate(newPost)
  mutation.isPending
  mutation.isError
  ```
  Instead of invalidating you can update the cache directly with `queryClient.setQueryData`
  (we do that here because the fake API doesn't actually save anything).
- Install **React Query Devtools** in real projects to inspect the cache.

## Your task (`Exercise.tsx`)

`api.ts` already has `fetchPosts(userId)` and `createPost(input)`. Build `PostsPanel`:

1. `<select>` labelled **"User"** (1–3). `useQuery` with key `['posts', userId]`.
2. Pending → `Loading…`; error → `role="alert"` with `Failed to load posts` and a **Retry** button
   (`refetch`); success → `<ul>` of titles.
3. A form with an input labelled **"Title"** and a **"Create post"** button using `useMutation`:
   - while pending the button is disabled and reads **"Creating…"**
   - on success, prepend the new post to the cached list for that user using
     `queryClient.setQueryData<Post[]>(['posts', userId], old => ...)` and clear the input.
   - on error show `Could not create post`.
4. Compare your code size with exercise 07!

Run `npm test -- 13`.

## Stretch goals

- `staleTime: 30_000` — switch users back and forth and watch the Network tab (no refetch).
- Optimistic update with `onMutate` + rollback in `onError`.

## Read more

- https://tanstack.com/query/latest/docs/framework/react/overview
- https://tkdodo.eu/blog/practical-react-query (the maintainer's blog — gold)
