import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button, Card } from './Exercise'

describe('02 – Button', () => {
  it('defaults to primary / md', () => {
    render(<Button>Save</Button>)
    const btn = screen.getByRole('button', { name: 'Save' })
    expect(btn).toHaveAttribute('data-variant', 'primary')
    expect(btn).toHaveAttribute('data-size', 'md')
  })

  it('accepts variant and size', () => {
    // `as object` lets this file compile before you've added the props to ButtonProps.
    const props = { variant: 'danger', size: 'sm' } as object
    render(<Button {...props}>Delete</Button>)
    const btn = screen.getByRole('button', { name: 'Delete' })
    expect(btn).toHaveAttribute('data-variant', 'danger')
    expect(btn).toHaveAttribute('data-size', 'sm')
  })

  it('forwards native props like onClick and disabled', async () => {
    const onClick = vi.fn()
    const { rerender } = render(<Button onClick={onClick}>Go</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)

    rerender(
      <Button onClick={onClick} disabled>
        Go
      </Button>,
    )
    expect(screen.getByRole('button')).toBeDisabled()
  })
})

describe('02 – Card', () => {
  it('renders title as a heading inside a section, plus children', () => {
    render(
      <Card title="Hello">
        <p>Body text</p>
      </Card>,
    )
    const heading = screen.getByRole('heading', { level: 3, name: 'Hello' })
    expect(heading.closest('section')).not.toBeNull()
    expect(screen.getByText('Body text')).toBeInTheDocument()
  })

  it('renders a footer only when provided', () => {
    const { container, rerender } = render(<Card title="A">x</Card>)
    expect(container.querySelector('footer')).toBeNull()

    const footerProp = { footer: <span>Footer!</span> } as object // compiles before you add `footer`
    rerender(
      <Card title="A" {...footerProp}>
        x
      </Card>,
    )
    expect(container.querySelector('footer')).toHaveTextContent('Footer!')
  })
})
