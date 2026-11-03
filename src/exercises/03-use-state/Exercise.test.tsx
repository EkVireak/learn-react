import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Counter, LikeButton, Toggle } from './Exercise'

describe('03 – Counter', () => {
  it('increments, decrements, adds three and resets', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    const btn = (name: string) => screen.getByRole('button', { name })

    await user.click(btn('+1'))
    await user.click(btn('+1'))
    expect(screen.getByText('Count: 2')).toBeInTheDocument()

    await user.click(btn('−1'))
    expect(screen.getByText('Count: 1')).toBeInTheDocument()

    await user.click(btn('+3'))
    expect(screen.getByText('Count: 4')).toBeInTheDocument()

    await user.click(btn('Reset'))
    expect(screen.getByText('Count: 0')).toBeInTheDocument()
  })

  it('never goes below zero', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    await user.click(screen.getByRole('button', { name: '+1' }))
    expect(screen.getByText('Count: 1')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '−1' }))
    await user.click(screen.getByRole('button', { name: '−1' }))
    expect(screen.getByText('Count: 0')).toBeInTheDocument()
  })
})

describe('03 – Toggle', () => {
  it('shows and hides the details', async () => {
    const user = userEvent.setup()
    render(<Toggle />)
    expect(screen.queryByText('Secret details')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Show details' }))
    expect(screen.getByText('Secret details')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Hide details' }))
    expect(screen.queryByText('Secret details')).not.toBeInTheDocument()
  })
})

describe('03 – LikeButton', () => {
  it('toggles like and count', async () => {
    const user = userEvent.setup()
    render(<LikeButton />)
    await user.click(screen.getByRole('button', { name: '♡ 41' }))
    expect(screen.getByRole('button', { name: '♥ 42' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '♥ 42' }))
    expect(screen.getByRole('button', { name: '♡ 41' })).toBeInTheDocument()
  })
})
