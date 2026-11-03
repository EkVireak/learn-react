import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import UserPosts from './Exercise'

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })

const postsFor = (userId: number) => [
  { id: userId * 10 + 1, userId, title: `Post A by ${userId}`, body: '' },
  { id: userId * 10 + 2, userId, title: `Post B by ${userId}`, body: '' },
]

function mockFetch() {
  const fetchMock = vi.fn(async (url: string | URL | Request, _init?: RequestInit) => {
    const userId = Number(new URL(String(url)).searchParams.get('userId'))
    return json(postsFor(userId))
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('07 – UserPosts', () => {
  it('shows loading, then the posts of user 1', async () => {
    const fetchMock = mockFetch()
    render(<UserPosts />)
    expect(screen.getByText('Loading…')).toBeInTheDocument()
    expect(await screen.findByText('Post A by 1')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/posts?userId=1'),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
  })

  it('refetches when the user changes and aborts the previous request', async () => {
    const fetchMock = mockFetch()
    const user = userEvent.setup()
    render(<UserPosts />)
    await screen.findByText('Post A by 1')

    await user.selectOptions(screen.getByLabelText('User'), '3')
    expect(await screen.findByText('Post A by 3')).toBeInTheDocument()
    expect(screen.queryByText('Post A by 1')).not.toBeInTheDocument()

    const firstSignal = fetchMock.mock.calls[0][1]?.signal as AbortSignal
    expect(firstSignal.aborted).toBe(true)
    expect(document.title).toBe('Posts of user 3')
  })

  it('shows an error for non-2xx responses and can retry', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(json({}, 500))
      .mockResolvedValue(json(postsFor(1)))
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    render(<UserPosts />)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Failed to load posts')

    await user.click(screen.getByRole('button', { name: 'Retry' }))
    expect(await screen.findByText('Post A by 1')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
