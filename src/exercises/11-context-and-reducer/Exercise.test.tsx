import { render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { cartReducer, cartTotals, initialCart } from './cart'
import Shop, { useTheme } from './Exercise'
import { PRODUCTS } from './types'

const [coffee, bagel] = PRODUCTS

describe('11 – cartReducer (pure function)', () => {
  it('adds new lines and increments existing ones', () => {
    let s = cartReducer(initialCart, { type: 'add', product: coffee })
    s = cartReducer(s, { type: 'add', product: coffee })
    s = cartReducer(s, { type: 'add', product: bagel })
    expect(s.lines).toEqual([
      { product: coffee, qty: 2 },
      { product: bagel, qty: 1 },
    ])
  })

  it('does not mutate the previous state', () => {
    const before = cartReducer(initialCart, { type: 'add', product: coffee })
    const snapshot = structuredClone(before)
    const after = cartReducer(before, { type: 'add', product: coffee })
    expect(before).toEqual(snapshot)
    expect(after).not.toBe(before) // a NEW object…
    expect(after.lines[0].qty).toBe(2) // …with the change
  })

  it('removes, sets qty (<= 0 removes) and clears', () => {
    let s = cartReducer(initialCart, { type: 'add', product: coffee })
    s = cartReducer(s, { type: 'add', product: bagel })
    s = cartReducer(s, { type: 'setQty', id: coffee.id, qty: 5 })
    expect(cartTotals(s)).toEqual({ count: 6, total: 5 * 3.5 + 2.25 })
    s = cartReducer(s, { type: 'setQty', id: coffee.id, qty: 0 })
    expect(s.lines).toHaveLength(1)
    s = cartReducer(s, { type: 'remove', id: bagel.id })
    expect(s.lines).toHaveLength(0)
    s = cartReducer(cartReducer(s, { type: 'add', product: coffee }), { type: 'clear' })
    expect(s.lines).toEqual([])
  })
})

describe('11 – context', () => {
  it('useTheme throws outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useTheme())).toThrow(/ThemeProvider/)
  })

  it('toggles the theme', async () => {
    const user = userEvent.setup()
    const { container } = render(<Shop />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument()
  })

  it('shares cart state between ProductGrid and CartSummary', async () => {
    const user = userEvent.setup()
    render(<Shop />)
    await user.click(screen.getByRole('button', { name: 'Add Coffee' }))
    await user.click(screen.getByRole('button', { name: 'Add Coffee' }))
    await user.click(screen.getByRole('button', { name: 'Add Bagel' }))
    expect(screen.getByText('Items: 3')).toBeInTheDocument()
    expect(screen.getByText('Total: $9.25')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Remove Coffee' }))
    expect(screen.getByText('Items: 1')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear cart' }))
    expect(screen.getByText('Items: 0')).toBeInTheDocument()
  })
})
