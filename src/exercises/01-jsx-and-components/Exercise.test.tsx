import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ProfileCard, { CURRENT_YEAR, user } from './Exercise'

describe('01 – ProfileCard', () => {
  it('renders the avatar with alt text', () => {
    render(<ProfileCard />)
    const img = screen.getByRole('img', { name: user.name })
    expect(img).toHaveAttribute('src', user.avatarUrl)
  })

  it('renders the name as a heading', () => {
    render(<ProfileCard />)
    expect(screen.getByRole('heading', { level: 2, name: user.name })).toBeInTheDocument()
  })

  it('renders the bio and join year', () => {
    render(<ProfileCard />)
    expect(screen.getByText(user.bio)).toBeInTheDocument()
    expect(screen.getByText(`Joined in ${user.joinedYear}`)).toBeInTheDocument()
  })

  it('computes membership years', () => {
    render(<ProfileCard />)
    const years = CURRENT_YEAR - user.joinedYear
    expect(screen.getByText(`Member for ${years} years`)).toBeInTheDocument()
  })

  it('wraps everything in an <article>', () => {
    const { container } = render(<ProfileCard />)
    const article = container.querySelector('article')
    expect(article).toContainElement(screen.getByRole('heading'))
  })
})
