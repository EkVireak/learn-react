# 12 – Styling & accessibility (CSS Modules + an accessible modal)

## Why this matters

You'll style components every day, and accessibility (a11y) is increasingly a legal requirement
and a code-review checklist item. A modal dialog is the classic test: it touches focus
management, keyboard support, ARIA, portals and styling all at once.

## Key concepts

### Styling options you'll meet at work

- **CSS Modules** (`Button.module.css`): plain CSS, class names scoped per file.
  `import styles from './Modal.module.css'` → `className={styles.backdrop}`.
  Combine classes with a template string or a tiny helper like `clsx`.
- **Tailwind CSS**: utility classes in JSX (`className="p-4 rounded-lg"`). Very popular — learn it next.
- CSS-in-JS (styled-components, Emotion) is common in older codebases.
- Inline `style={{}}` is fine for one-off dynamic values, not for whole designs.

### Accessibility essentials

- Use **semantic HTML** first: `<button>` (not a clickable `<div>`), `<nav>`, `<main>`, headings in order,
  `<label>` for every input. You get keyboard support and screen reader semantics for free.
- ARIA only fills gaps: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-label`,
  `aria-expanded`, `aria-live`.
- **Keyboard**: everything clickable must be reachable with Tab and usable with Enter/Space;
  Escape closes overlays. Never remove focus outlines without replacing them (`:focus-visible`).
- **Focus management**: when a dialog opens move focus into it; when it closes, return focus to
  the button that opened it.
- Test with your keyboard only, and with a screen reader (VoiceOver: ⌘ + F5 on macOS).
- **Portals** (`createPortal(jsx, document.body)`) render a component elsewhere in the DOM —
  ideal for overlays so parent `overflow: hidden` / `z-index` can't clip them.

## Your task (`Exercise.tsx`)

The styles are done in `Modal.module.css`. Build `Modal` and use it:

1. `Modal({ open, onClose, title, children })` renders **nothing** when closed. When open it renders,
   via `createPortal` into `document.body`:
   - a backdrop `div` (`styles.backdrop`) — clicking **the backdrop itself** (not the dialog) calls `onClose`
   - a `div` with `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at the `<h2>` title
     (use `useId()` to generate the id), class `styles.dialog`
   - a close button with `aria-label="Close"`
2. On open, focus the close button (ref + effect). **Escape** calls `onClose` (listen on `document`
   in an effect and clean up the listener!).
3. In `SettingsPage`, an **"Open settings"** button opens the modal titled **"Settings"**; when the modal
   closes, focus returns to that button.

Run `npm test -- 12`.

## Stretch goals

- **Focus trap**: Tab from the last focusable element wraps to the first (and Shift+Tab back).
- Prevent background scroll while open (`document.body.style.overflow = 'hidden'` + cleanup).
- Compare with the native `<dialog>` element and `dialog.showModal()`.

## Read more

- https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- https://react.dev/reference/react-dom/createPortal
- https://react.dev/reference/react/useId
- https://vite.dev/guide/features#css-modules
