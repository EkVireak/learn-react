// Solution 02 – Props & TypeScript types
import type { ComponentProps, ReactNode } from 'react'

export type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const colors = {
  primary: { background: 'var(--accent)', color: '#fff' },
  secondary: {},
  danger: { background: 'var(--danger)', color: '#fff' },
} as const

const padding = { sm: '2px 8px', md: '6px 12px', lg: '10px 18px' } as const

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  style,
  ...rest
}: ButtonProps) {
  return (
    <button
      data-variant={variant}
      data-size={size}
      style={{ ...colors[variant], padding: padding[size], ...style }}
      {...rest}
    >
      {children}
    </button>
  )
}

export type CardProps = {
  title: string
  footer?: ReactNode
  children: ReactNode
}

export function Card({ title, footer, children }: CardProps) {
  return (
    <section style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
      <h3>{title}</h3>
      {children}
      {footer && <footer style={{ display: 'flex', gap: 8 }}>{footer}</footer>}
    </section>
  )
}

export default function Demo() {
  return (
    <Card
      title="Delete account?"
      footer={
        <>
          <Button variant="secondary">Cancel</Button>
          <Button variant="danger" size="lg">
            Delete
          </Button>
        </>
      }
    >
      <p>This cannot be undone.</p>
    </Card>
  )
}
