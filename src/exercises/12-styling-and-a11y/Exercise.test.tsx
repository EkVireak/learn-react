import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import SettingsPage from './Exercise'

describe('12 – accessible Modal', () => {
  it('is closed initially', () => {
    render(<SettingsPage />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens a labelled modal dialog rendered in a portal and focuses Close', async () => {
    const user = userEvent.setup()
    const { container } = render(<SettingsPage />)
    await user.click(screen.getByRole('button', { name: 'Open settings' }))

    const dialog = screen.getByRole('dialog', { name: 'Settings' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(container).not.toContainElement(dialog) // portal → outside the component's container
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
  })

  it('closes with Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup()
    render(<SettingsPage />)
    const trigger = screen.getByRole('button', { name: 'Open settings' })
    await user.click(trigger)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('closes on backdrop click, but not when clicking inside the dialog', async () => {
    const user = userEvent.setup()
    render(<SettingsPage />)
    await user.click(screen.getByRole('button', { name: 'Open settings' }))

    await user.click(screen.getByRole('heading', { name: 'Settings' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    const backdrop = screen.getByRole('dialog').parentElement!
    await user.click(backdrop)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes with the Close button', async () => {
    const user = userEvent.setup()
    render(<SettingsPage />)
    await user.click(screen.getByRole('button', { name: 'Open settings' }))
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
