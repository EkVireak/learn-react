// Solution 09 – Forms & validation
import { useActionState, type ComponentProps } from 'react'
import { z } from 'zod'

export const SignUpSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    email: z.email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm: z.string(),
    terms: z.literal('on', { error: 'You must accept the terms' }),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  })

export type SignUpValues = z.infer<typeof SignUpSchema> // types derived from the schema

type Field = 'name' | 'email' | 'password' | 'confirm' | 'terms'

export type FormState =
  | { status: 'idle' }
  | { status: 'error'; errors: Partial<Record<Field, string[]>>; values: Record<string, string> }
  | { status: 'success'; name: string }

export async function signUp(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = Object.fromEntries(formData) as Record<string, string>
  const result = SignUpSchema.safeParse(values)
  if (!result.success) {
    return { status: 'error', errors: z.flattenError(result.error).fieldErrors, values }
  }
  await new Promise((r) => setTimeout(r, 300)) // pretend to call an API
  return { status: 'success', name: result.data.name }
}

type FieldProps = ComponentProps<'input'> & {
  name: Field
  label: string
  error?: string
}

/** One labelled input + its error message, wired up for screen readers. */
function TextField({ name, label, error, ...rest }: FieldProps) {
  const errorId = `${name}-error`
  return (
    <div style={{ display: 'grid' }}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error && (
        <small id={errorId} style={{ color: 'var(--danger)' }}>
          {error}
        </small>
      )}
    </div>
  )
}

export default function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signUp, { status: 'idle' })

  if (state.status === 'success') return <p>Welcome, {state.name}!</p>

  const errors = state.status === 'error' ? state.errors : {}
  const values = state.status === 'error' ? state.values : {}

  return (
    <form action={formAction} noValidate style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
      <TextField name="name" label="Name" defaultValue={values.name} error={errors.name?.[0]} />
      <TextField
        name="email"
        label="Email"
        type="email"
        defaultValue={values.email}
        error={errors.email?.[0]}
      />
      <TextField name="password" label="Password" type="password" error={errors.password?.[0]} />
      <TextField
        name="confirm"
        label="Confirm password"
        type="password"
        error={errors.confirm?.[0]}
      />

      <label>
        <input
          type="checkbox"
          name="terms"
          aria-invalid={errors.terms ? true : undefined}
          aria-describedby={errors.terms ? 'terms-error' : undefined}
        />{' '}
        I accept the terms
      </label>
      {errors.terms && (
        <small id="terms-error" style={{ color: 'var(--danger)' }}>
          {errors.terms[0]}
        </small>
      )}

      <button type="submit" disabled={isPending}>
        {isPending ? 'Signing up…' : 'Sign up'}
      </button>
    </form>
  )
}
