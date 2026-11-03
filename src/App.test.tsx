// Smoke test for the course viewer itself (not an exercise).
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'

afterEach(() => {
  window.location.hash = ''
})

describe('App shell', () => {
  it('lists all 16 exercises and shows the first README', () => {
    render(<App />)
    const nav = screen.getByRole('navigation', { name: 'Exercises' })
    expect(within(nav).getAllByRole('link')).toHaveLength(16)
    expect(
      screen.getByRole('heading', { level: 2, name: /01\. JSX & Components/ }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Why this matters/)).toBeInTheDocument()
  })

  it('navigates via the hash and renders the solution and side-by-side views', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('link', { name: /03 State with useState/ }))
    expect(
      screen.getByRole('heading', { level: 2, name: /03\. State with useState/ }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Solution' }))
    expect(await screen.findByText('Count: 0')).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Side by side' }))
    expect(await screen.findByRole('region', { name: 'My code' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Solution' })).toBeInTheDocument()
  })
})
