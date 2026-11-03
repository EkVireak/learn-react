# Learn React (with TypeScript)

A hands-on course that takes you from your first component to a small production-style app.
It covers the React concepts and everyday tooling you need for a **junior frontend job**.

**Stack:** React 19 · TypeScript · Vite · Vitest + React Testing Library · React Router ·
TanStack Query · Zod · oxlint · Prettier

## Getting started

```bash
npm install
npm run dev        # open the URL it prints (usually http://localhost:5173)
```

The app is a course viewer. Pick an exercise in the sidebar, then switch between
**README**, **My code**, **Solution** and **Side by side**.

## How each exercise works

```
src/exercises/03-use-state/
  README.md          ← 1. read: why it matters, key concepts, common mistakes, your task
  Exercise.tsx       ← 2. edit this file (look for TODOs)
  Exercise.test.tsx  ← 3. make these tests pass:  npm test -- 03
  Solution.tsx       ← 4. compare afterwards (try first!)
```

1. Read the exercise `README.md`, or open the README tab in the app.
2. Edit `Exercise.tsx`. The browser updates as you save.
3. Run `npm test -- 03`. Vitest stays in watch mode and re-runs on every save. Keep going until
   it's green.
4. Compare your code with `Solution.tsx`. There is usually more than one good answer.
5. Try the **stretch goals**, then commit your work (`git commit -am "exercise 03"`).

Tests fail on the untouched starter code. That's expected: making them pass is the exercise.

## Roadmap

| #                            | Topic                               | You'll build                                                |
| ---------------------------- | ----------------------------------- | ----------------------------------------------------------- |
| **Part 1: Fundamentals**     |                                     |                                                             |
| 01                           | JSX & components                    | Profile card                                                |
| 02                           | Props & TypeScript types            | Typed `Button` and `Card`                                   |
| 03                           | State with `useState`               | Counter, toggle, like button                                |
| 04                           | Events & controlled inputs          | Tweet box with a character counter                          |
| 05                           | Lists, keys & conditional rendering | Filterable, sortable fruit list                             |
| 06                           | Lifting state & data flow           | Todo app                                                    |
| **Part 2: Effects & hooks**  |                                     |                                                             |
| 07                           | `useEffect` & data fetching         | Posts loader with abort and retry                           |
| 08                           | `useRef`, `useMemo`, custom hooks   | `useDebounce`, `useLocalStorage`, notes search              |
| 09                           | Forms & validation (actions + Zod)  | Accessible sign-up form                                     |
| **Part 3: App architecture** |                                     |                                                             |
| 10                           | Routing (React Router)              | Shop with nested routes and a 404 page                      |
| 11                           | Context & `useReducer`              | Theme switcher and shopping cart                            |
| 12                           | Styling & accessibility             | Accessible modal (CSS Modules, portal, focus)               |
| 13                           | Server state (TanStack Query)       | Posts with queries and mutations                            |
| 14                           | Error boundaries, Suspense, `lazy`  | Crash-proof dashboard with a lazy chart                     |
| 15                           | Testing React                       | You write the tests                                         |
| **Part 4: Capstone**         |                                     |                                                             |
| 16                           | Task Board                          | A Kanban app built from a "ticket" with acceptance criteria |

Suggested pace: about one exercise per day, with two days each for 06, 13 and 16. That's
roughly 3–4 weeks part-time.

## Scripts

| Command                  | What it does                                                        |
| ------------------------ | ------------------------------------------------------------------- |
| `npm run dev`            | Start the dev server with hot reload                                |
| `npm test -- 05`         | Run the tests for exercise 05 in watch mode                         |
| `npm run test:run`       | Run all tests once                                                  |
| `npm run test:solutions` | Run all tests against the reference solutions (should be all green) |
| `npm run typecheck`      | Type-check the whole project                                        |
| `npm run lint`           | Lint with oxlint (catches hook mistakes, impure renders…)           |
| `npm run format`         | Format everything with Prettier                                     |
| `npm run build`          | Type-check and build for production                                 |
| `npm run api`            | Start the fake REST API for exercise 16 (port 3001)                 |

## Also read

- [`docs/00-setup-and-tooling.md`](docs/00-setup-and-tooling.md): how this project is put
  together (Vite, tsconfig, linting, testing, git workflow, devtools).
- [`docs/junior-checklist.md`](docs/junior-checklist.md): what teams expect from a junior React
  developer, interview questions, and what to learn next.
- The official docs at https://react.dev/learn are excellent. Each exercise links to the relevant pages.
