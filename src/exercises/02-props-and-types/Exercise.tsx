// Exercise 02 – Props & TypeScript types
import type { ComponentProps, ReactNode } from 'react'

// TODO: add `variant` and `size` (both optional unions) to this type.
// `ComponentProps<'button'>` already includes children, onClick, disabled, type, ...
export type ButtonProps = ComponentProps<'button'>

export function Button({ children, ...rest }: ButtonProps) {
  // TODO: destructure `variant` (default 'primary') and `size` (default 'md')
  // TODO: put them on the element as data-variant / data-size
  return <button {...rest}>{children}</button>
}

export type CardProps = {
  title: string
  children: ReactNode
  // TODO: add an optional `footer` prop
}

export function Card({ title, children }: CardProps) {
  // TODO: render a <section> with an <h3>{title}</h3>, the children,
  //       and a <footer> ONLY when `footer` is provided
  return (
    <div>
      {title}
      {children}
    </div>
  )
}

export default function Demo() {
  return (
    <Card title="Delete account?">
      <p>This cannot be undone.</p>
      {/* TODO: pass footer={...} with a secondary "Cancel" and a danger "Delete" button */}
      <Button>Click me</Button>
    </Card>
  )
}
