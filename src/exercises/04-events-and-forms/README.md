# 04 – Events & controlled inputs

## Why this matters

Almost every feature you'll get as a junior involves an input: search boxes, filters, settings.
React's **controlled input** pattern (state is the single source of truth for the field) is how
nearly every codebase handles it.

## Key concepts

- Event handlers are props: `onClick`, `onChange`, `onSubmit`, `onKeyDown`…
  Pass a **function**, don't call it: `onClick={handleClick}` ✅ vs `onClick={handleClick()}` ❌.
- Typed events in TS:
  ```ts
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value)
  }
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
  }
  ```
  Tip: hover over `onChange` in your editor to see the exact type, or write the handler inline
  and TS infers it.
- **Controlled input**: `<input value={name} onChange={e => setName(e.target.value)} />`.
  React state → input value → user types → onChange → set state → re-render.
- `e.preventDefault()` stops a form submit from reloading the page.
- Checkboxes use `checked` + `e.target.checked`, not `value`.
- Always connect labels: `<label htmlFor="bio">` + `id="bio"` (or wrap the input in the label).

## Common mistakes

- `value` without `onChange` → read-only field + console warning.
- Initial state `undefined` then a string → "uncontrolled to controlled" warning. Start with `''`.
- Forgetting `preventDefault()` on submit.

## Your task (`Exercise.tsx`) — a "Post a tweet" box

1. A `<textarea>` labelled **"What's happening?"**, controlled by state.
2. Below it show `N / 140` characters. When over 140, add the text `"Too long!"`.
3. A checkbox labelled **"Add signature"**; when checked, the preview appends `" — Ada"`.
4. A **Post** button — disabled when the text is empty (after trimming) or too long.
5. On submit (`onSubmit` on the `<form>`), call `preventDefault`, add the final text
   (with signature if checked) to a list of posted items rendered as `<li>`s, and clear the textarea.
6. Pressing **Escape** inside the textarea clears it (`onKeyDown`, check `e.key`).

Run `npm test -- 04`.

## Stretch goals

- Show a live preview of the post under the textarea.
- Make the counter turn red when > 120 chars.

## Read more

- https://react.dev/learn/responding-to-events
- https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable
