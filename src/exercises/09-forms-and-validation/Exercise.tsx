// Exercise 09 – Forms & validation
import { useActionState } from 'react'
import { z } from 'zod'

export const SignUpSchema = z.object({
  name: z.string(), // TODO: .trim().min(2, '...')
  email: z.string(), // TODO: use z.email('...')
  password: z.string(), // TODO: min 8
  confirm: z.string(),
  // TODO: terms: z.literal('on', { error: 'You must accept the terms' })
})
// TODO: add .refine((d) => d.password === d.confirm, { message: '...', path: ['confirm'] })

type Field = 'name' | 'email' | 'password' | 'confirm' | 'terms'

export type FormState =
  | { status: 'idle' }
  | { status: 'error'; errors: Partial<Record<Field, string[]>>; values: Record<string, string> }
  | { status: 'success'; name: string }

export async function signUp(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = Object.fromEntries(formData) as Record<string, string>
  // TODO: const result = SignUpSchema.safeParse(values)
  // TODO: if !result.success -> return { status: 'error', errors: z.flattenError(result.error).fieldErrors, values }
  // TODO: await new Promise((r) => setTimeout(r, 300)) to simulate the API
  return { status: 'success', name: values.name }
}

export default function SignUpForm() {
  const [state, formAction] = useActionState(signUp, { status: 'idle' })
  // TODO: also take `isPending` from useActionState

  if (state.status === 'success') return <p>Welcome, {state.name}!</p>

  return (
    <form action={formAction} style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
      <label htmlFor="name">Name</label>
      <input id="name" name="name" />
      {/* TODO: defaultValue from state.values, aria-invalid, aria-describedby, error <p id="name-error"> */}

      {/* TODO: Email, Password (type="password"), Confirm password fields — same pattern */}

      {/* TODO: <label><input type="checkbox" name="terms" /> I accept the terms</label> + error */}

      <button type="submit">Sign up</button>
    </form>
  )
}
