import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from './Exercise'

const renderAt = (url: string) =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <AppRoutes />
    </MemoryRouter>,
  )

describe('10 – Routing', () => {
  it('renders the home page inside the layout', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { name: 'Welcome to the shop' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
  })

  it('navigates home → products → detail → back', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await user.click(screen.getByRole('link', { name: 'Products' }))
    expect(screen.getByRole('heading', { name: 'Products' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Mouse' }))
    expect(screen.getByRole('heading', { name: 'Mouse' })).toBeInTheDocument()
    expect(screen.getByText('$19.50')).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Back to products' }))
    expect(screen.getByRole('heading', { name: 'Products' })).toBeInTheDocument()
  })

  it('sorts via search params', async () => {
    const user = userEvent.setup()
    renderAt('/products?sort=price')
    const names = () =>
      within(screen.getByRole('list'))
        .getAllByRole('link')
        .map((a) => a.textContent)
    expect(names()).toEqual(['Desk lamp', 'Mouse', 'Keyboard', 'Monitor'])
    await user.selectOptions(screen.getByLabelText('Sort by'), 'name')
    expect(names()).toEqual(['Desk lamp', 'Keyboard', 'Monitor', 'Mouse'])
  })

  it('handles unknown products and unknown pages', () => {
    renderAt('/products/999')
    expect(screen.getByText('Product not found')).toBeInTheDocument()
  })

  it('shows a 404 page for unknown URLs (still inside the layout)', () => {
    renderAt('/nope')
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
