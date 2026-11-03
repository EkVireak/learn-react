// Exercise 15 – write these tests! Replace each `it.todo('...')` with `it('...', async () => { ... })`.
// Reference: Solution.test.tsx (try on your own first).
import { describe, it } from 'vitest'
// Useful imports — uncomment as you need them:
// import { act, render, renderHook, screen } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'
// import { expect, vi } from 'vitest'
// import TodoApp from '../06-lifting-state/Solution'
// import { useCounter } from './useCounter'
// import { UserCard } from './UserCard'

describe('15 – TodoApp', () => {
  // Hint: render(<TodoApp />), then use screen.getByLabelText('New todo'),
  //       screen.getByRole('checkbox', { name: 'Learn state' }), etc.
  it.todo('shows the initial todos and "1 item left"')
  it.todo('adds a todo when submitting the form')
  it.todo('ignores an empty / whitespace-only title')
  it.todo('toggles a todo and updates the counter')
  it.todo('deletes a todo')
  it.todo('filters Active / Completed')
})

describe('15 – useCounter', () => {
  // Hint: const { result } = renderHook(() => useCounter({ min: 0, max: 2 }))
  //       act(() => result.current.increment()); expect(result.current.count).toBe(1)
  it.todo('starts at the initial value')
  it.todo('increments and decrements')
  it.todo('never goes outside min / max')
  it.todo('resets to the initial value')
})

describe('15 – UserCard', () => {
  // Hint: vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({...}))))
  //       then render(<UserCard username="ada" />) and `await screen.findBy...`
  it.todo('shows a loading state first')
  it.todo('renders name, avatar and followers on success')
  it.todo('requests the right URL')
  it.todo('shows "User not found" on 404')
})
