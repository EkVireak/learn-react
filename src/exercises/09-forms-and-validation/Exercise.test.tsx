import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import SignUpForm, { SignUpSchema } from './Exercise'

const valid = {
  name: 'Ada',
  email: 'ada@example.com',
  password: 'supersecret',
  confirm: 'supersecret',
  terms: 'on',
}

describe('09 – SignUpSchema', () => {
  it('accepts valid data', () => {
    expect(SignUpSchema.safeParse(valid).success).toBe(true)
  })

  it.each([
    [{ name: 'A' }, 'Name must be at least 2 characters'],
    [{ email: 'nope' }, 'Enter a valid email'],
    [{ password: 'short', confirm: 'short' }, 'Password must be at least 8 characters'],
    [{ confirm: 'different!' }, 'Passwords do not match'],
    [{ terms: undefined }, 'You must accept the terms'],
  ])('rejects %o', (patch, message) => {
    const result = SignUpSchema.safeParse({ ...valid, ...patch })
    expect(result.success).toBe(false)
    expect(JSON.stringify(result.error?.issues)).toContain(message)
  })
})

describe('09 – SignUpForm', () => {
  it('shows accessible errors and keeps typed values', async () => {
    const user = userEvent.setup()
    render(<SignUpForm />)
    await user.type(screen.getByLabelText('Name'), 'Ada')
    await user.type(screen.getByLabelText('Email'), 'not-an-email')
    await user.click(screen.getByRole('button', { name: 'Sign up' }))

    const email = await screen.findByLabelText('Email')
    expect(await screen.findByText('Enter a valid email')).toBeInTheDocument()
    expect(email).toHaveAttribute('aria-invalid', 'true')
    expect(email).toHaveAccessibleDescription('Enter a valid email')
    expect(screen.getByText('You must accept the terms')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toHaveValue('Ada')
  })

  it('shows pending state then the welcome message', async () => {
    const user = userEvent.setup()
    render(<SignUpForm />)
    await user.type(screen.getByLabelText('Name'), 'Ada')
    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Password'), 'supersecret')
    await user.type(screen.getByLabelText('Confirm password'), 'supersecret')
    await user.click(screen.getByLabelText('I accept the terms'))
    await user.click(screen.getByRole('button', { name: 'Sign up' }))

    expect(await screen.findByRole('button', { name: 'Signing up…' })).toBeDisabled()
    expect(await screen.findByText('Welcome, Ada!')).toBeInTheDocument()
  })
})
