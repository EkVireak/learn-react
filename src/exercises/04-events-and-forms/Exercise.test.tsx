import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import TweetBox from './Exercise'

const setup = () => {
  const user = userEvent.setup()
  render(<TweetBox />)
  return {
    user,
    textarea: screen.getByLabelText("What's happening?"),
    post: screen.getByRole('button', { name: 'Post' }),
  }
}

describe('04 – TweetBox', () => {
  it('is a controlled textarea with a live counter', async () => {
    const { user, textarea } = setup()
    await user.type(textarea, 'Hello')
    expect(textarea).toHaveValue('Hello')
    expect(screen.getByText(/5 \/ 140/)).toBeInTheDocument()
  })

  it('disables Post when empty or too long', async () => {
    const { user, textarea, post } = setup()
    expect(post).toBeDisabled()
    await user.type(textarea, '   ')
    expect(post).toBeDisabled()
    await user.clear(textarea)
    await user.click(textarea)
    await user.paste('x'.repeat(141))
    expect(screen.getByText(/Too long!/)).toBeInTheDocument()
    expect(post).toBeDisabled()
  })

  it('posts, appends signature and clears', async () => {
    const { user, textarea, post } = setup()
    await user.type(textarea, 'First')
    await user.click(post)
    expect(screen.getByRole('listitem')).toHaveTextContent('First')
    expect(textarea).toHaveValue('')

    await user.click(screen.getByLabelText('Add signature'))
    await user.type(textarea, 'Second')
    await user.click(post)
    expect(screen.getAllByRole('listitem')[1]).toHaveTextContent('Second — Ada')
  })

  it('clears the textarea on Escape', async () => {
    const { user, textarea } = setup()
    await user.type(textarea, 'Oops')
    await user.keyboard('{Escape}')
    expect(textarea).toHaveValue('')
  })
})
