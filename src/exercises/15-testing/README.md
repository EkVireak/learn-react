# 15 – Testing React components

## Why this matters

Most teams require tests in every PR. As a junior you'll often be asked to "add tests for this" —
and writing tests is also the fastest way to understand unfamiliar code. You've been _running_
tests since exercise 01; now you write them.

## Key concepts

- **Tools**: Vitest (test runner, Jest-compatible API) + React Testing Library (RTL) + user-event +
  jest-dom matchers. Setup lives in `vite.config.ts` and `src/test/setup.ts`.
- **RTL philosophy**: _"The more your tests resemble the way your software is used, the more
  confidence they can give you."_ Test **behavior** (what the user sees and does), not
  implementation details (state variables, component internals).
- **Query priority** — pick the first that works:
  1. `getByRole('button', { name: 'Save' })` ← default choice, also checks accessibility
  2. `getByLabelText('Email')` (form fields)
  3. `getByText('Welcome')`
  4. `getByTestId(...)` — last resort
- `getBy…` throws if missing · `queryBy…` returns `null` (use for "is NOT there") ·
  `findBy…` returns a promise and waits (use for async UI).
- **Interact** with `const user = userEvent.setup()` then `await user.click(...)`,
  `await user.type(...)`. Always `await`.
- **Mocking**: `vi.fn()` for callback props, `vi.stubGlobal('fetch', vi.fn(...))` for the network,
  `vi.useFakeTimers()` for timeouts. Popular in real projects: **MSW** (Mock Service Worker) to mock
  at the network level.
- **Hooks**: `renderHook(() => useCounter())` + `act(() => result.current.increment())`.
- Structure: **Arrange → Act → Assert**. One behavior per test, descriptive names.

## Your task

Fill in every `it.todo` in `Exercise.test.tsx` (turn them into real `it(...)` tests):

1. **TodoApp** (the solution from exercise 06): add, toggle, delete, filter, "N items left",
   and that an empty title is ignored.
2. **useCounter** (`useCounter.ts`): initial value, increment/decrement, respects `min`/`max`, reset.
3. **UserCard** (`UserCard.tsx`): mock `fetch` to test loading state, success (name, avatar alt,
   followers) and the 404 → `"User not found"` path. Assert the URL that was requested.

Run `npm test -- 15`. Try breaking the component on purpose — does a test fail? If not, the test
isn't testing much. Then compare with `Solution.test.tsx`.

## Stretch goals

- Run `npx vitest run --coverage` (install `@vitest/coverage-v8`) and look at what's untested.
- Rewrite the UserCard tests with MSW.

## Read more

- https://testing-library.com/docs/queries/about#priority
- https://kentcdodds.com/blog/common-mistakes-with-react-testing-library
- https://vitest.dev/guide/mocking
