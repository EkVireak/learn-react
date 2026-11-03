# 01 – JSX & Components

## Why this matters

Everything you build in React is a **component**: a plain function that returns **JSX**
(HTML-like syntax that compiles to `React.createElement` calls). On the job you will spend
most of your day reading and splitting components, so get comfortable with this first.

## Key concepts

- A component is a function whose name starts with a **Capital letter** and returns JSX.
- JSX rules:
  - Return **one root element**. Use a Fragment `<>...</>` when you don't want an extra `<div>`.
  - Close every tag: `<img />`, `<br />`.
  - `class` → `className`, `for` → `htmlFor`, inline styles are objects: `style={{ color: 'red' }}`.
  - `{ }` embeds any JavaScript **expression** (variables, function calls, ternaries) — not statements (`if`, `for`).
- **Composition**: big components are made of small components. Keep each one focused.
- Components re-run (re-render) top to bottom every time React renders them — they should be
  pure: same inputs → same JSX, no side effects while rendering.

## Common mistakes

- `function profileCard()` (lowercase) → React treats `<profileCard />` as an unknown HTML tag.
- Returning two siblings without a wrapper → syntax error.
- Writing `{if (x) ...}` inside JSX → use a ternary or move logic above the `return`.

## Your task

Open `Exercise.tsx` and build a profile card for the `user` object:

1. `Avatar` renders an `<img>` with `src={user.avatarUrl}`, `alt={user.name}`, width 96.
2. `Name` renders the name in an `<h2>`.
3. `Bio` renders the bio in a `<p>` and, below it, `"Joined in 2021"` using the `joinedYear` field
   (use an expression inside `{}`).
4. `ProfileCard` composes all three inside an `<article>` and also shows the number of
   years since joining: `"Member for N years"` (compute it from the exported `CURRENT_YEAR`).
   Why not call `new Date()` inside the component? Rendering must be **pure**; reading the
   clock gives a different result on every render. Read it once outside, or in an event/effect.

Check your work: `npm test -- 01` · see it: `npm run dev`.

## Stretch goals

- Add a `className` and a `ProfileCard.module.css` (CSS Modules — you'll see them again in 12).
- Open React DevTools in the browser and find your components in the tree.

## Read more

- https://react.dev/learn/your-first-component
- https://react.dev/learn/writing-markup-with-jsx
- https://react.dev/learn/javascript-in-jsx-with-curly-braces
