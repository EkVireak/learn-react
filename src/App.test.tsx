// Smoke test for the course viewer itself (not an exercise).
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'
import { exercises, splitReadme } from './exercises/registry'

afterEach(() => {
  window.location.hash = ''
})

describe('App shell', () => {
  it('lists all 17 exercises and shows the first README', () => {
    render(<App />)
    const nav = screen.getByRole('navigation', { name: 'Exercises' })
    expect(within(nav).getAllByRole('link')).toHaveLength(17)
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

  it('highlights the task in the README and above the code', async () => {
    const user = userEvent.setup()
    render(<App />)
    const task = screen.getByRole('region', { name: 'Your task' })
    expect(task).toHaveClass('task')
    expect(task).toHaveTextContent(/Open `Exercise.tsx` and build a profile card/)
    expect(screen.getByRole('link', { name: /Jump to your task/ })).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'My code' }))
    expect(screen.getByText(/Your task \(full explanation/).closest('details')).toHaveTextContent(
      /build a profile card/,
    )
  })
})

describe('splitReadme', () => {
  it('finds a task section in every exercise', () => {
    for (const e of exercises) {
      expect(e.parts.task, e.slug).toMatch(/^## (Your task|The ticket)/)
    }
  })

  it('keeps ### sub-headings inside the task and stops at the next ##', () => {
    const md = '# T\n\n## Intro\nhi\n\n## Your task\n1. do\n### Sub\nmore\n\n## Read more\nlinks'
    const parts = splitReadme(md)
    expect(parts.before).toBe('# T\n\n## Intro\nhi')
    expect(parts.task).toBe('## Your task\n1. do\n### Sub\nmore')
    expect(parts.after).toBe('## Read more\nlinks')
  })
})
