// Exercise 01 – JSX & Components. Read README.md first!

export const user = {
  name: 'Ada Lovelace',
  avatarUrl: 'https://i.pravatar.cc/96?img=47',
  bio: 'Wrote the first computer program.',
  joinedYear: 2021,
}

// Read the clock once, outside render: components should be pure (same input → same output).
export const CURRENT_YEAR = new Date().getFullYear()

export function Avatar() {
  // TODO: return an <img> with src = user.avatarUrl, alt = user.name, width = 96
  return null
}

export function Name() {
  // TODO: return the user's name inside an <h2>
  return null
}

export function Bio() {
  // TODO: return a Fragment (<>...</>) containing
  //   <p>{bio}</p>
  //   <p>Joined in {joinedYear}</p>
  return null
}

export default function ProfileCard() {
  // TODO: compute how many years the user has been a member (use CURRENT_YEAR)
  // TODO: return an <article> that contains <Avatar />, <Name />, <Bio />
  //       and a <p> saying "Member for N years"
  return <article>TODO: build the profile card</article>
}
