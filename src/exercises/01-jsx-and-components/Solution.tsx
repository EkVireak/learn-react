// Solution 01 – JSX & Components

export const user = {
  name: 'Ada Lovelace',
  avatarUrl: 'https://i.pravatar.cc/96?img=47',
  bio: 'Wrote the first computer program.',
  joinedYear: 2021,
}

// Read the clock once, outside render: components should be pure (same input → same output).
export const CURRENT_YEAR = new Date().getFullYear()

export function Avatar() {
  return <img src={user.avatarUrl} alt={user.name} width={96} height={96} />
}

export function Name() {
  return <h2>{user.name}</h2>
}

export function Bio() {
  // A Fragment groups siblings without adding a DOM node.
  return (
    <>
      <p>{user.bio}</p>
      <p>Joined in {user.joinedYear}</p>
    </>
  )
}

export default function ProfileCard() {
  // Plain JS above the return is fine — compute what you need, then describe the UI.
  const years = CURRENT_YEAR - user.joinedYear

  return (
    <article style={{ border: '1px solid var(--border)', padding: 16, borderRadius: 8 }}>
      <Avatar />
      <Name />
      <Bio />
      <p>Member for {years} years</p>
    </article>
  )
}
