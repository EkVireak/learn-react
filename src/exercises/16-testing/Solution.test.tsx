// Solution 16 – reference tests
import { act, render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import TodoApp from '../06-lifting-state/Solution'
import { useCounter } from './useCounter'
import { UserCard } from './UserCard'

describe('16 (solution) – TodoApp', () => {
  it('shows the initial todos and "1 item left"', () => {
    render(<TodoApp />)
    expect(screen.getByRole('checkbox', { name: 'Learn JSX' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Learn state' })).not.toBeChecked()
    expect(screen.getByText('1 item left')).toBeInTheDocument()
  })

  it('adds a todo when submitting the form', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)
    await user.type(screen.getByLabelText('New todo'), 'Write tests{Enter}')
    expect(screen.getByRole('checkbox', { name: 'Write tests' })).toBeInTheDocument()
    expect(screen.getByLabelText('New todo')).toHaveValue('')
  })

  it('ignores an empty / whitespace-only title', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)
    await user.type(screen.getByLabelText('New todo'), '   {Enter}')
    expect(screen.getAllByRole('checkbox')).toHaveLength(2)
  })

  it('toggles a todo and updates the counter', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)
    await user.click(screen.getByRole('checkbox', { name: 'Learn state' }))
    expect(screen.getByRole('checkbox', { name: 'Learn state' })).toBeChecked()
    expect(screen.getByText('0 items left')).toBeInTheDocument()
  })

  it('deletes a todo', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)
    await user.click(screen.getByRole('button', { name: 'Delete Learn JSX' }))
    expect(screen.queryByRole('checkbox', { name: 'Learn JSX' })).not.toBeInTheDocument()
  })

  it('filters Active / Completed', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)
    await user.click(screen.getByRole('button', { name: 'Active' }))
    expect(
      screen.getAllByRole('checkbox').map((c) => c.closest('label')?.textContent?.trim()),
    ).toEqual(['Learn state'])
    await user.click(screen.getByRole('button', { name: 'Completed' }))
    expect(
      screen.getAllByRole('checkbox').map((c) => c.closest('label')?.textContent?.trim()),
    ).toEqual(['Learn JSX'])
  })
})

describe('16 (solution) – useCounter', () => {
  it('starts at the initial value', () => {
    const { result } = renderHook(() => useCounter({ initial: 5 }))
    expect(result.current.count).toBe(5)
  })

  it('increments and decrements', () => {
    const { result } = renderHook(() => useCounter())
    act(() => result.current.increment())
    act(() => result.current.increment())
    act(() => result.current.decrement())
    expect(result.current.count).toBe(1)
  })

  it('never goes outside min / max', () => {
    const { result } = renderHook(() => useCounter({ min: 0, max: 1 }))
    act(() => result.current.decrement())
    expect(result.current.count).toBe(0)
    act(() => result.current.increment())
    act(() => result.current.increment())
    expect(result.current.count).toBe(1)
  })

  it('resets to the initial value', () => {
    const { result } = renderHook(() => useCounter({ initial: 2 }))
    act(() => result.current.increment())
    act(() => result.current.reset())
    expect(result.current.count).toBe(2)
  })
})

describe('16 (solution) – UserCard', () => {
  const ada = {
    login: 'ada',
    name: 'Ada Lovelace',
    avatar_url: 'https://x/ada.png',
    followers: 1815,
  }
  const respond = (body: unknown, status = 200) =>
    vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }))

  it('shows a loading state first', async () => {
    vi.stubGlobal('fetch', respond(ada))
    render(<UserCard username="ada" />)
    expect(screen.getByText('Loading user…')).toBeInTheDocument()
    await screen.findByRole('heading') // let it settle to avoid act() warnings
  })

  it('renders name, avatar and followers on success', async () => {
    vi.stubGlobal('fetch', respond(ada))
    render(<UserCard username="ada" />)
    expect(await screen.findByRole('heading', { name: 'Ada Lovelace' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: "ada's avatar" })).toHaveAttribute('src', ada.avatar_url)
    expect(screen.getByText('1815 followers')).toBeInTheDocument()
  })

  it('requests the right URL', async () => {
    const fetchMock = respond(ada)
    vi.stubGlobal('fetch', fetchMock)
    render(<UserCard username="ada" />)
    await screen.findByRole('heading')
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.github.com/users/ada',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
  })

  it('shows "User not found" on 404', async () => {
    vi.stubGlobal('fetch', respond({ message: 'Not Found' }, 404))
    render(<UserCard username="nobody" />)
    expect(await screen.findByRole('alert')).toHaveTextContent('User not found')
  })
})
