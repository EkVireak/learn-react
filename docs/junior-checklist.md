# Junior React developer checklist

Use this as a self-assessment. If you can tick most boxes and explain each in your own words,
you're ready for junior interviews and your first weeks on a team.

## 1. JavaScript & TypeScript you must be fluent in

React is "just JavaScript", so gaps here show up everywhere.

- [ ] `const`/`let`, arrow functions, template literals
- [ ] Destructuring objects/arrays, default values, rest/spread (`...`)
- [ ] Array methods: `map`, `filter`, `find`, `some`, `reduce`, `toSorted`. Know which ones **mutate**.
- [ ] Immutable updates of nested objects/arrays
- [ ] Truthy/falsy, `??` vs `||`, optional chaining `?.`
- [ ] Promises, `async`/`await`, `try/catch`, `fetch` and `res.ok`
- [ ] ES modules: named vs default exports
- [ ] Closures (why stale values appear in effects and timers)
- [ ] TS: `type` vs `interface`, unions, literal types, optional `?`, generics (`useState<T>`),
      narrowing (`if ('error' in x)`, discriminated unions), `as const`, utility types
      (`Partial`, `Pick`, `Omit`, `Record`)

## 2. React mental model

- [ ] A component is a function of props + state → UI. Rendering must be **pure**.
- [ ] What triggers a re-render: state change, parent re-render, context change.
- [ ] **State as a snapshot**; updater functions `setX(prev => ...)`.
- [ ] Why `key` matters and why index keys break reorderable lists.
- [ ] Controlled vs uncontrolled inputs.
- [ ] Where state should live (lift up, colocate) and **derived state** (don't duplicate).
- [ ] Effects are for **synchronizing with external systems**. Know when you _don't_ need one.
- [ ] Dependency arrays, cleanup functions, StrictMode double-invoke.
- [ ] `useRef` (DOM + mutable values), `useMemo`/`useCallback` (and when not to bother).
- [ ] Custom hooks share logic, not state.
- [ ] Context: when to use it, and its re-render cost.
- [ ] `useReducer` + discriminated-union actions.
- [ ] Error boundaries, `Suspense`, `lazy`.
- [ ] Server state vs client state (TanStack Query).

## 3. Everyday skills on a team

- [ ] Read an unfamiliar codebase: start from routes/pages, follow the props, and use "Go to definition".
- [ ] Use React DevTools, the Network tab and the console to debug.
- [ ] Read a stack trace and an error message, then search effectively.
- [ ] Write tests with Testing Library (query by role, `userEvent`, mock `fetch`).
- [ ] Accessibility basics: semantic HTML, labels, keyboard support, focus, alt text.
- [ ] Responsive CSS (flexbox, grid, media queries) with one styling approach (CSS Modules or Tailwind).
- [ ] Git: branches, commits, PRs, resolving merge conflicts, reacting to review comments.
- [ ] npm: install packages, read `package.json`, run scripts, understand the lockfile.
- [ ] Ask good questions: what you tried, what you expected, what happened, and a minimal reproduction.

## 4. Common interview questions (answer them out loud)

1. **What is JSX?** Syntax sugar compiled to `React.createElement`/`jsx()` calls that describe UI.
2. **Props vs state?** Props are inputs from the parent (read-only). State is the component's own memory that changes over time.
3. **Why can't I mutate state?** React compares references to detect changes. A mutation keeps the same reference, so no re-render happens and bugs follow.
4. **What are keys for?** They let React match list items between renders to preserve state and DOM correctly.
5. **Explain the `useEffect` dependency array.** It lists the values the effect reads. The effect re-runs when they change. `[]` means mount only. The cleanup runs before the next run and on unmount.
6. **How would you fetch data?** In real apps with TanStack Query or a framework loader. Manually: an effect with loading/error state and an AbortController for cleanup.
7. **Controlled vs uncontrolled inputs?** Controlled: React state drives `value`. Uncontrolled: the DOM holds the value and you read it via ref/FormData.
8. **`useMemo` vs `useCallback`?** One caches a computed value, the other a function identity. Use them for expensive computations or stable references passed to memoized children and effects, not by default.
9. **When use Context?** For data many components at different depths need (theme, auth, locale). Not for fast-changing, high-frequency state.
10. **What's an error boundary?** A class component that catches render errors in its subtree and shows a fallback.
11. **What causes a re-render, and how do you avoid unnecessary ones?** State, parent, and context changes. Fixes: colocate state, split components, `memo`, and measure with the Profiler first.
12. **What's the virtual DOM / reconciliation?** React builds a tree of elements, diffs it against the previous one, and applies the minimal DOM changes.
13. **What does StrictMode do?** It double-invokes renders and effects in development to reveal impurity and missing cleanup.
14. **How do you make a component accessible?** Semantic elements, labels, keyboard support, focus management, ARIA only when needed, and testing with a keyboard and a screen reader.
15. **CSR vs SSR?** Client-side rendering ships JS that renders in the browser. Server-side rendering sends HTML first (better first paint and SEO). Next.js and React Server Components build on this.

Expect a **live-coding task** too: usually a todo list, a search/filter over a fetched list, a form
with validation, or a small component like tabs or an accordion. Exercises 05, 06, 07, 09 and 12
are good practice for these. Redo them from scratch without looking.

## 5. What to learn next

1. **Next.js** (App Router, React Server Components, server actions), or React Router framework mode.
2. **Tailwind CSS**: very common in job listings.
3. **React Hook Form** + Zod for big forms.
4. A client state library: **Zustand** (simple) or **Redux Toolkit** (common in existing codebases).
5. **MSW** for API mocking, and **Playwright** for end-to-end tests.
6. **Storybook** for building components in isolation.
7. Performance: React DevTools Profiler, the React Compiler, Lighthouse, Core Web Vitals.
8. Build and **deploy** 2–3 portfolio projects (Vercel/Netlify) with a clear README, tests, and a live link.
   The capstone (17) is a good start: extend it and put it on GitHub.
