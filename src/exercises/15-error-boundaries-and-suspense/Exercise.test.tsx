import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Dashboard, { ErrorBoundary } from './Exercise'

function Boom(): never {
  throw new Error('kaboom')
}

describe('15 – ErrorBoundary', () => {
  it('renders the fallback with the error and logs it', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary fallback={(e) => <p>Caught: {e.message}</p>}>
        <Boom />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Caught: kaboom')).toBeInTheDocument()
    expect(consoleError).toHaveBeenCalled()
  })

  it('catches the BuggyCounter crash and recovers with Try again', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const user = userEvent.setup()
    render(<Dashboard />)
    const counter = () => screen.getByRole('button', { name: /Clicked/ })
    await user.click(counter())
    await user.click(counter())
    await user.click(counter())

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Something went wrong: Counter exploded at 3',
    )
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(screen.getByRole('button', { name: 'Clicked 0 times' })).toBeInTheDocument()
  })
})

describe('15 – lazy + Suspense', () => {
  it('loads the chart on demand behind a Suspense fallback', async () => {
    const user = userEvent.setup()
    render(<Dashboard />)
    expect(screen.queryByRole('img', { name: /weekly sales/i })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show chart' }))
    expect(await screen.findByRole('img', { name: /weekly sales/i })).toBeInTheDocument()
  })
})
