import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import TodoApp, { TodoForm } from './Exercise'

describe('06 – TodoForm', () => {
  it('calls onAdd with trimmed text and clears; ignores empty input', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<TodoForm onAdd={onAdd} />)
    const input = screen.getByLabelText('New todo')

    await user.type(input, '   {Enter}')
    expect(onAdd).not.toHaveBeenCalled()

    await user.type(input, '  Buy milk  {Enter}')
    expect(onAdd).toHaveBeenCalledWith('Buy milk')
    expect(input).toHaveValue('')
  })
})

describe('06 – TodoApp', () => {
  it('adds a todo and updates the counter', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)
    expect(screen.getByText('1 item left')).toBeInTheDocument()
    await user.type(screen.getByLabelText('New todo'), 'Write tests')
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByRole('checkbox', { name: 'Write tests' })).not.toBeChecked()
    expect(screen.getByText('2 items left')).toBeInTheDocument()
  })

  it('toggles and deletes todos', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)
    await user.click(screen.getByRole('checkbox', { name: 'Learn state' }))
    expect(screen.getByRole('checkbox', { name: 'Learn state' })).toBeChecked()
    expect(screen.getByText('0 items left')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Delete Learn JSX' }))
    expect(screen.queryByText('Learn JSX')).not.toBeInTheDocument()
  })

  it('filters active/completed', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)
    await user.click(screen.getByRole('button', { name: 'Active' }))
    expect(screen.getByRole('button', { name: 'Active' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getAllByRole('checkbox')).toHaveLength(1)
    expect(screen.getByRole('checkbox', { name: 'Learn state' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Completed' }))
    expect(screen.getByRole('checkbox', { name: 'Learn JSX' })).toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: 'Learn state' })).not.toBeInTheDocument()
  })
})
