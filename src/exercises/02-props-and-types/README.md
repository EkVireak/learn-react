# 02 – Props & TypeScript types

## Why this matters

Props are how a parent passes data down to a child. In a TypeScript codebase every component
has a typed props contract — reviewers will expect you to type props correctly and keep
components reusable instead of copy-pasting them.

## Key concepts

- Props are **one object**; destructure it in the signature: `function Button({ label }: ButtonProps)`.
- Props are **read-only**. Never mutate them — ask the parent to change them instead (exercise 06).
- Typing props:
  ```ts
  type ButtonProps = {
    variant?: 'primary' | 'secondary' // union of string literals; `?` = optional
    children: React.ReactNode // anything renderable
    onClick?: () => void // callback prop
  }
  ```
- **Default values** via destructuring: `{ variant = 'primary' }`.
- `children` is a special prop: whatever you put between `<Card>` and `</Card>`.
- Extending native elements: `React.ComponentProps<'button'>` gives you every `<button>` attribute;
  combine with `&` and spread the rest (`...rest`) onto the element.
- `type` vs `interface`: both work for props; most teams pick one convention. This repo uses `type`.

## Common mistakes

- Typing props as `any` — you lose autocomplete and safety.
- Forgetting that `children` must be declared in the props type.
- Spreading `...rest` _before_ your own props when you meant to allow overrides (order matters).

## Your task (`Exercise.tsx`)

1. Create a `ButtonProps` type and finish `Button`:
   - `variant?: 'primary' | 'secondary' | 'danger'` (default `'primary'`)
   - `size?: 'sm' | 'md' | 'lg'` (default `'md'`)
   - accept every native button prop (`onClick`, `disabled`, `type`…) by extending `React.ComponentProps<'button'>`.
   - render `<button data-variant={variant} data-size={size} {...rest}>{children}</button>`
2. Finish `Card` (`title: string`, optional `footer?: React.ReactNode`, `children`):
   render a `<section>` with an `<h3>` title, the children, and the footer inside `<footer>` **only if given**.
3. Use both in the default export (`Demo`) — try passing a wrong variant like `"blue"` and read the TS error.

Run `npm test -- 02`.

## Stretch goals

- Make `Button` accept an optional `icon?: React.ReactNode` rendered before the text.
- Try `React.PropsWithChildren<{ title: string }>` as an alternative to declaring `children` yourself.

## Read more

- https://react.dev/learn/passing-props-to-a-component
- https://react.dev/learn/typescript
- https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example
