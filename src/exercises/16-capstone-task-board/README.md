# 16 – Capstone: Task Board

## Why this matters

Time to build a small but realistic feature end-to-end, the way you would on the job: you get a
ticket with user stories and acceptance criteria, an API, and you decide the component structure.
It uses everything from 01–15: components, props, state, forms + Zod, routing, context + reducer,
TanStack Query, accessibility and tests.

## Setup

```bash
npm run api     # json-server on http://localhost:3001 (seeded from db.seed.json → ./db.json)
npm run dev     # in another terminal
```

`api.ts` (typed fetch functions) is provided. Delete `db.json` to reset the data.

## The ticket

> **TASK-16: Task board MVP**
> As a team member I want a simple Kanban board so that I can track what everyone is working on.

### User stories & acceptance criteria

The tests (`npm test -- 16`) check exactly these, so use the given labels/text.

1. **See the board** — at `/`
   - Heading **"Task Board"**.
   - Three columns, each a `<section>` labelled by its `<h2>`: **"To do"**, **"In progress"**, **"Done"**
     (`todo`, `doing`, `done`). Each task appears in its column showing its title (a link to its detail
     page) and its priority.
   - While loading: **"Loading tasks…"**. On failure: `role="alert"` with **"Could not load tasks"**.
2. **Create a task**
   - Form with input labelled **"Title"**, select labelled **"Priority"** (`low` / `medium` / `high`,
     default `medium`) and button **"Add task"**.
   - Validate with Zod: title (trimmed) at least 3 chars → **"Title must be at least 3 characters"**.
   - On success the task appears in **To do**, the form clears and a toast says **"Task created"**.
3. **Move a task** — each card has one button depending on its status:
   `todo` → **"Start <title>"**, `doing` → **"Complete <title>"**, `done` → **"Reopen <title>"** (→ `todo`).
   It PATCHes `status` and the card moves column.
4. **Filter** — select labelled **"Priority filter"** (`all`, `low`, `medium`, `high`), stored in the URL
   search params (`/?priority=high`).
5. **Task details** — `/tasks/:id` shows the title as an `<h2>`, the description, and status;
   a **"Back to board"** link and a **"Delete task"** button. Deleting returns to the board with toast
   **"Task deleted"**. Unknown id → **"Task not found"**.
6. **Notifications** — toasts live in a `ToastProvider` (context + `useReducer`), rendered in a
   `role="status"` region, and disappear after 3 seconds.

### Definition of done

- `npm run typecheck`, `npm run lint` and `npm test -- 16` pass.
- Works with keyboard only. No console errors/warnings.
- Components are small and focused (suggested structure below).

### Suggested structure (yours may differ)

```
Exercise.tsx         providers (QueryClient, Router, Toast) + routes
toast.tsx            ToastProvider, useToast()
queries.ts           useTasks, useTask, useCreateTask, useUpdateTask, useDeleteTask
BoardPage.tsx        filter + NewTaskForm + 3 × Column
TaskCard.tsx         title link, priority, move button
NewTaskForm.tsx      Zod-validated form
TaskDetailPage.tsx   details + delete
```

`Exercise.tsx` must `export default` a component accepting optional
`{ initialEntries?: string[]; queryClient?: QueryClient }` (the tests pass their own).

The reference implementation is in `Solution.tsx` + `solution/` — look only after you've tried!

## Stretch goals

- Drag and drop between columns (HTML drag events, or `@dnd-kit/core`).
- Edit title/description on the detail page.
- Optimistic updates when moving cards.
- Deploy it (Vercel / Netlify) with a hosted API.

## Read more

- Re-read the READMEs of exercises 06, 09, 10, 11, 13.
- https://github.com/typicode/json-server
