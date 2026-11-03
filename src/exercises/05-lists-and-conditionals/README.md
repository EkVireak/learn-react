# 05 – Lists, keys & conditional rendering

## Why this matters

Real apps are mostly lists: products, messages, rows in a table — usually filtered and sorted.
Getting `key` wrong causes subtle bugs (inputs keeping the wrong value, animations jumping),
and reviewers _will_ flag `key={index}` on reorderable lists.

## Key concepts

- Render arrays with `.map()` → array of JSX. Each item needs a **stable, unique `key`**
  among its siblings — usually the item's `id` from the data.
- `key` tells React _which_ item is which between renders. Index keys break when items are
  inserted, removed or re-ordered.
- Filter/sort with plain array methods **during render** — `filter`, `toSorted`/`[...arr].sort`.
  `arr.sort()` mutates! Never sort state or props in place.
- Conditional rendering:
  - `cond ? <A /> : <B />` — either/or
  - `cond && <A />` — render or nothing. ⚠️ `{count && <Badge />}` renders a literal **0** when
    count is 0. Use `count > 0 && ...`.
  - Early `return` for whole-component states (loading, empty).
  - Returning `null` renders nothing.

## Your task (`Exercise.tsx`)

Build a filterable fruit list from the `fruits` array:

1. Render a `<ul>` with one `<li key={fruit.id}>` per fruit showing its name. Out-of-stock fruits
   get the suffix `" (out of stock)"`.
2. A text input labelled **"Search"** filters by name, case-insensitively.
3. A `<select>` labelled **"Category"** with options `all`, `berry`, `citrus`, `tropical`.
4. A checkbox labelled **"In stock only"**.
5. The list is sorted A→Z by default. A toggle button labelled with the _other_ direction
   (**"Sort Z→A"** first, then **"Sort A→Z"**) flips it. Don't mutate the source array!
6. Show `"Showing N of M"` above the list.
7. When nothing matches, render `<p>No fruits match</p>` **instead of** the `<ul>`.

Run `npm test -- 05`.

## Stretch goals

- Group the list by category with a heading per group (`Object.groupBy` or `reduce`).
- Highlight the matching part of each name.

## Read more

- https://react.dev/learn/rendering-lists
- https://react.dev/learn/conditional-rendering
- https://react.dev/learn/preserving-and-resetting-state (how keys affect state)
