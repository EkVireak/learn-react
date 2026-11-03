import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import FruitList from './Exercise'

const names = () => screen.getAllByRole('listitem').map((li) => li.textContent)

describe('05 – FruitList', () => {
  it('renders every fruit with out-of-stock suffix', () => {
    render(<FruitList />)
    expect(screen.getAllByRole('listitem')).toHaveLength(8)
    expect(screen.getByText('Showing 8 of 8')).toBeInTheDocument()
    expect(within(screen.getByRole('list')).getByText(/Mango \(out of stock\)/)).toBeInTheDocument()
  })

  it('filters by search (case-insensitive)', async () => {
    const user = userEvent.setup()
    render(<FruitList />)
    await user.type(screen.getByLabelText('Search'), 'BERRY')
    expect(names()).toHaveLength(3)
    expect(screen.getByText('Showing 3 of 8')).toBeInTheDocument()
  })

  it('filters by category and stock', async () => {
    const user = userEvent.setup()
    render(<FruitList />)
    await user.selectOptions(screen.getByLabelText('Category'), 'citrus')
    expect(names()).toHaveLength(3)
    await user.click(screen.getByLabelText('In stock only'))
    expect(names()).toEqual(['Lemon', 'Orange'])
  })

  it('sorts without mutating', async () => {
    const user = userEvent.setup()
    render(<FruitList />)
    expect(names()[0]).toMatch(/^Blueberry/)
    await user.click(screen.getByRole('button', { name: /Sort Z→A/ }))
    expect(names()[0]).toMatch(/^Strawberry/)
    await user.click(screen.getByRole('button', { name: /Sort A→Z/ }))
    expect(names()[0]).toMatch(/^Blueberry/)
  })

  it('shows an empty state instead of the list', async () => {
    const user = userEvent.setup()
    render(<FruitList />)
    await user.type(screen.getByLabelText('Search'), 'zzz')
    expect(screen.getByText('No fruits match')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})
