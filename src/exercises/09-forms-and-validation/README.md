# 09 – Forms & validation (React 19 actions + Zod)

## Why this matters

Sign-up, checkout, settings, admin panels… forms are where users hit bugs. Teams expect you to
validate input, show helpful errors next to the right field, prevent double-submits and keep
forms accessible. Schema validation with **Zod** gives you validation _and_ TypeScript types from
one source.

## Key concepts

- **Controlled** forms (exercise 04) vs **uncontrolled** forms that read values on submit with
  `FormData`. Both are valid; uncontrolled is simpler for big forms.
- **React 19 form actions**: `<form action={fn}>` calls `fn(formData)` on submit, no
  `preventDefault` needed. With `useActionState` you get state returned from the action and a
  pending flag:
  ```ts
  const [state, formAction, isPending] = useActionState(signUp, initialState)
  // signUp(prevState, formData) => newState   (can be async)
  ```
- **Zod**:
  ```ts
  const Schema = z.object({ email: z.email('Enter a valid email') })
  type Values = z.infer<typeof Schema> // TS type for free
  const result = Schema.safeParse(data) // { success, data } | { success: false, error }
  z.flattenError(result.error).fieldErrors // { email?: string[] }
  ```
  Cross-field rules use `.refine(fn, { message, path: ['confirm'] })`.
- Accessible errors: `aria-invalid="true"` on the input and `aria-describedby` pointing at the
  error message's `id`.
- Popular libraries: **React Hook Form** + Zod resolver is very common in jobs — once you understand
  this exercise, its docs will make sense quickly.

## Your task (`Exercise.tsx`)

Build a sign-up form with fields labelled **Name**, **Email**, **Password**, **Confirm password**
and a checkbox **"I accept the terms"**:

1. Complete `SignUpSchema`:
   - name: trimmed, at least 2 chars → `"Name must be at least 2 characters"`
   - email: valid → `"Enter a valid email"`
   - password: at least 8 chars → `"Password must be at least 8 characters"`
   - confirm must equal password → `"Passwords do not match"` (on the `confirm` field)
   - terms must be checked (`'on'`) → `"You must accept the terms"`
2. Finish the `signUp` action: validate `Object.fromEntries(formData)`; on failure return the
   field errors **and the submitted values** (so the inputs keep what the user typed — use
   `defaultValue`); on success wait 300 ms (fake API) and return `{ status: 'success', name }`.
3. Show each error under its input with `aria-invalid` + `aria-describedby`.
4. While pending, disable the button and change its text to **"Signing up…"**.
5. On success replace the form with `Welcome, <name>!`.

Run `npm test -- 09`.

## Stretch goals

- Validate a field on blur (`onBlur`) in addition to on submit.
- Rebuild the same form with React Hook Form + `@hookform/resolvers/zod` and compare.

## Read more

- https://react.dev/reference/react/useActionState
- https://react.dev/reference/react-dom/components/form
- https://zod.dev/basics
