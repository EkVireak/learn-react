import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PostsPanel } from './Exercise'

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })

function renderWithClient() {
  // A fresh client per test = no shared cache; no retries so errors show immediately.
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <PostsPanel />
    </QueryClientProvider>,
  )
}

function fakeApi({ failGet = false, failPost = false } = {}) {
  const fetchMock = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
    const url = new URL(String(input))
    if (init?.method === 'POST') {
      if (failPost) return json({}, 500)
      await new Promise((r) => setTimeout(r, 20))
      return json({ id: 101, ...JSON.parse(String(init.body)) }, 201)
    }
    if (failGet) return json({}, 500)
    const userId = Number(url.searchParams.get('userId'))
    return json([{ id: userId, userId, title: `Post of user ${userId}`, body: '' }])
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('13 – PostsPanel', () => {
  it('loads posts and refetches by user', async () => {
    fakeApi()
    const user = userEvent.setup()
    renderWithClient()
    expect(screen.getByText('Loading…')).toBeInTheDocument()
    expect(await screen.findByText('Post of user 1')).toBeInTheDocument()
    await user.selectOptions(screen.getByLabelText('User'), '2')
    expect(await screen.findByText('Post of user 2')).toBeInTheDocument()
  })

  it('shows an error with a working Retry', async () => {
    const fetchMock = fakeApi({ failGet: true })
    const user = userEvent.setup()
    renderWithClient()
    expect(await screen.findByRole('alert')).toHaveTextContent('Failed to load posts')
    fetchMock.mockImplementation(async () => json([{ id: 1, userId: 1, title: 'Back!', body: '' }]))
    await user.click(screen.getByRole('button', { name: 'Retry' }))
    expect(await screen.findByText('Back!')).toBeInTheDocument()
  })

  it('creates a post, shows pending state and updates the list', async () => {
    const fetchMock = fakeApi()
    const user = userEvent.setup()
    renderWithClient()
    await screen.findByText('Post of user 1')

    await user.type(screen.getByLabelText('Title'), 'Hello Query')
    await user.click(screen.getByRole('button', { name: 'Create post' }))
    expect(await screen.findByRole('button', { name: 'Creating…' })).toBeDisabled()

    expect(await screen.findByText('Hello Query')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('Hello Query')
    expect(screen.getByLabelText('Title')).toHaveValue('')
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/posts'),
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('shows a mutation error', async () => {
    fakeApi({ failPost: true })
    const user = userEvent.setup()
    renderWithClient()
    await screen.findByText('Post of user 1')
    await user.type(screen.getByLabelText('Title'), 'Nope')
    await user.click(screen.getByRole('button', { name: 'Create post' }))
    expect(await screen.findByText('Could not create post')).toBeInTheDocument()
  })
})
