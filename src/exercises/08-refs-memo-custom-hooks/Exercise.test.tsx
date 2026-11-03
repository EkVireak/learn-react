import { act, render, renderHook, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import NotesSearch from './Exercise'
import { useDebounce, useLocalStorage } from './hooks'

describe('08 – useDebounce', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('only updates after the delay', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 300), {
      initialProps: { v: 'a' },
    })
    rerender({ v: 'ab' })
    expect(result.current).toBe('a')
    act(() => vi.advanceTimersByTime(299))
    expect(result.current).toBe('a')
    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe('ab')
  })
})

describe('08 – useLocalStorage', () => {
  it('reads the stored value and persists updates', () => {
    localStorage.setItem('k', JSON.stringify(5))
    const { result } = renderHook(() => useLocalStorage('k', 0))
    expect(result.current[0]).toBe(5)
    act(() => result.current[1](6))
    expect(result.current[0]).toBe(6)
    expect(localStorage.getItem('k')).toBe('6')
  })

  it('falls back to the initial value on invalid JSON', () => {
    localStorage.setItem('bad', '{oops')
    const { result } = renderHook(() => useLocalStorage('bad', 'init'))
    expect(result.current[0]).toBe('init')
  })
})

describe('08 – NotesSearch', () => {
  it('focuses search on mount and via the button', async () => {
    const user = userEvent.setup()
    render(<NotesSearch />)
    expect(screen.getByLabelText('Search')).toHaveFocus()
    await user.click(screen.getByLabelText('New note'))
    await user.click(screen.getByRole('button', { name: 'Focus search' }))
    expect(screen.getByLabelText('Search')).toHaveFocus()
  })

  it('adds notes (persisted) and filters with debounce', async () => {
    const user = userEvent.setup()
    render(<NotesSearch />)
    await user.type(screen.getByLabelText('New note'), 'Walk the dog{Enter}')
    expect(screen.getByText('Walk the dog')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('notes') ?? '[]')).toContain('Walk the dog')

    await user.type(screen.getByLabelText('Search'), 'react')
    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(1))
    expect(screen.getByRole('listitem')).toHaveTextContent('Read React docs')
  })
})
