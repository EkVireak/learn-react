# 03 – State with useState

## Why this matters

State is data that changes over time and should update the screen. Understanding _when_ React
re-renders and why you must never mutate state is the #1 thing that separates juniors who
struggle from juniors who ship.

## Key concepts

- `const [count, setCount] = useState(0)` — current value + setter. Calling the setter
  **schedules a re-render**; the component function runs again with the new value.
- **State is a snapshot**: inside one render `count` never changes. `setCount(count + 1)` three times
  in a row still adds only 1. Use the **updater form** when the next value depends on the previous one:
  `setCount(c => c + 1)`.
- **Never mutate** objects/arrays in state. Create new ones:
  `setUser({ ...user, name: 'Bo' })`, `setItems([...items, newItem])`.
  React compares by reference (`Object.is`) — mutation = same reference = no re-render.
- Hooks rules: call hooks **at the top level** of a component, never inside if/loops/callbacks.
- Each component instance has its own state.

## Common mistakes

- `count++` or `state.push(x)` — mutation, UI won't update.
- Expecting `console.log(count)` right after `setCount` to show the new value (it won't — snapshot).
- Storing things in state that can be **calculated** from other state/props (derived data, see 06).

## Your task (`Exercise.tsx`)

1. `Counter`: shows `Count: N`, buttons **+1**, **−1**, **+3** (call the setter three times using the
   updater form — prove to yourself why it's needed), **Reset**. Count may not go below 0.
2. `Toggle`: a button that switches its label between `"Show details"` / `"Hide details"` and shows
   a `<p>Secret details</p>` only when open.
3. `LikeButton`: state is an **object** `{ liked: boolean; count: number }` starting at
   `{ liked: false, count: 41 }`. Clicking toggles `liked` and increments/decrements `count`.
   Label: `"♡ 41"` when not liked, `"♥ 42"` when liked. Update it **immutably**.

Run `npm test -- 03`.

## Stretch goals

- Render two `<Counter />`s side by side — note each keeps its own state.
- Add a `step` input that changes how much +/− moves the counter.

## Read more

- https://react.dev/learn/state-a-components-memory
- https://react.dev/learn/state-as-a-snapshot
- https://react.dev/learn/updating-objects-in-state
