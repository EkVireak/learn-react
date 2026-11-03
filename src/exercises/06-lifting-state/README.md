# 06 – Lifting state up & one-way data flow

## Why this matters

As soon as two components need the same data, you must decide **where the state lives**.
"Data down, events up" is the core architecture of every React app — and the classic
Todo app is still the most common take-home exercise in junior interviews.

## Key concepts

- **One-way data flow**: parents pass data to children via props; children ask parents to change
  it by calling **callback props** (`onAdd`, `onToggle`, `onDelete`).
- **Lift state up** to the closest common parent of the components that need it.
- **Single source of truth**: keep one copy of the data. Everything else is **derived**:
  ```ts
  const remaining = todos.filter((t) => !t.done).length // ✅ derived
  const [remaining, setRemaining] = useState(0) // ❌ duplicated, will get out of sync
  ```
- **Presentational vs container** components: `TodoItem` only renders props and calls callbacks;
  `TodoApp` owns state and logic. Small, dumb components are easier to test and reuse.
- Immutable array updates you'll use daily:
  ```ts
  add: setTodos((prev) => [...prev, newTodo])
  update: setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  remove: setTodos((prev) => prev.filter((t) => t.id !== id))
  ```

## Your task (`Exercise.tsx`)

The components are split for you. Wire them together:

1. `TodoForm` — controlled input labelled **"New todo"** + **Add** button. On submit call
   `onAdd(title)` with the trimmed text, ignore empty input, then clear the field.
2. `TodoItem` — a checkbox whose accessible name is the todo title (wrap in `<label>`),
   checked when `done`, calling `onToggle(id)`; a **Delete** button (`aria-label="Delete <title>"`)
   calling `onDelete(id)`.
3. `FilterBar` — three buttons **All / Active / Completed**; the current one has `aria-pressed="true"`.
4. `TodoApp` — owns `todos` and `filter` state, implements add/toggle/delete immutably,
   derives the visible list and shows `"N items left"` (`"1 item left"` for one).

Run `npm test -- 06`.

## Stretch goals

- "Clear completed" button.
- Double-click a title to edit it inline.
- Persist todos to `localStorage` (you'll build a hook for this in 08).

## Read more

- https://react.dev/learn/sharing-state-between-components
- https://react.dev/learn/thinking-in-react ← read this one twice
- https://react.dev/learn/updating-arrays-in-state
