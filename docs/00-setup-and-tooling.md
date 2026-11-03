# 00 – Setup & tooling

On the job, you'll spend as much time with tools as with React itself. This page explains every
file in the project root and the workflow around it. Read it once now, then come back as needed.

## How this project was created

```bash
npm create vite@latest learn-react -- --template react-ts
npm install react-router @tanstack/react-query zod
npm install -D vitest jsdom @testing-library/react @testing-library/dom \
  @testing-library/user-event @testing-library/jest-dom prettier json-server
```

**Vite** is the dev server and bundler. It's the standard way to start a client-side React app
today. (Frameworks like **Next.js** or **React Router framework mode** add server rendering and
routing conventions on top. Learn plain React first.)

## Files in the root

| File                | Purpose                                                                                                                                      |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json`      | Dependencies and `scripts`. `dependencies` ship to users; `devDependencies` are build/test tools only.                                       |
| `package-lock.json` | Exact installed versions. **Commit it.** Use `npm ci` on CI for reproducible installs.                                                       |
| `index.html`        | The single HTML page. React mounts into `<div id="root">`.                                                                                   |
| `src/main.tsx`      | Entry point: `createRoot(...).render(<StrictMode><App /></StrictMode>)`.                                                                     |
| `vite.config.ts`    | Vite plugins plus the Vitest config (`test: { environment: 'jsdom', ... }`).                                                                 |
| `tsconfig*.json`    | TypeScript settings: `tsconfig.app.json` for `src/`, `tsconfig.node.json` for config files.                                                  |
| `.oxlintrc.json`    | Lint rules (oxlint is a fast ESLint-compatible linter). Many teams use ESLint with `eslint-plugin-react-hooks`, which covers the same ideas. |
| `.prettierrc.json`  | Code formatting. Formatting is automated, so nobody argues about it in code review.                                                          |
| `src/test/setup.ts` | Runs before every test file: adds jest-dom matchers and cleans up between tests.                                                             |

## TypeScript essentials for React

- `strict` mode is on (the default since TS 6). Don't fight it: `any` is a code smell in review.
- Type props with `type Props = { ... }`, and type state with generics when TS can't infer:
  `useState<User | null>(null)`.
- Let inference work. You rarely need to annotate return types of components.
- `import type { Foo }` for type-only imports (required here by `verbatimModuleSyntax`).
- Run `npm run typecheck` before pushing. CI usually does too.

## Linting & formatting

- `npm run lint`: oxlint flags real bugs like breaking the **Rules of Hooks**, impure renders
  (`new Date()` during render), or setting state synchronously in effects.
  Read the message and fix the code rather than disabling the rule.
- `npm run format`: Prettier. Set your editor to **format on save**.
- Recommended VS Code extensions: _Oxc_ (oxlint), _Prettier_, _Vitest_, _Pretty TypeScript Errors_.

## Testing

- `npm test -- 07` runs one exercise in watch mode. Press `h` in the terminal for options.
- Tests live next to the code (`Exercise.test.tsx`). That's the most common convention.
- `npm run test:solutions` runs the same tests against the reference solutions. A small Vite
  plugin in `vite.config.ts` redirects `./Exercise` imports to `./Solution` in that mode.

## Browser devtools you should use daily

- **React Developer Tools** (Chrome/Firefox extension): inspect the component tree, props, state
  and hooks; the _Profiler_ tab shows why a component re-rendered.
- **Network tab**: see API requests, status codes and payloads. Most "it doesn't work" bugs show
  up here first.
- **Console**: read React warnings. They are almost always right.
- **Elements → Accessibility pane**: check computed roles and names (the same ones Testing Library uses).

## StrictMode

In development, `<StrictMode>` renders components twice and runs effects mount → unmount → mount
to surface impure renders and missing cleanups. It does nothing in production. If something
"runs twice", that's StrictMode doing its job.

## Git workflow (what teams expect)

```bash
git switch -c feat/todo-filter      # one branch per task/ticket
git add -p                           # review what you stage
git commit -m "feat(todos): add active/completed filter"
git push -u origin feat/todo-filter # then open a Pull Request
```

- Small, focused commits with clear messages (many teams use _Conventional Commits_: `feat:`, `fix:`, `chore:`…).
- Open a PR with a description: **what** changed, **why**, **how to test**, and screenshots for UI.
- Code review is a conversation. Answer every comment, push fixes as new commits, and don't take it personally.
- Rebase or merge `main` regularly to avoid big conflicts.

## Environment variables

Vite exposes variables prefixed with `VITE_` via `import.meta.env.VITE_API_URL`. Put local values in
`.env.local` (git-ignored). **Never put secrets in frontend env vars.** Everything ships to the browser.
