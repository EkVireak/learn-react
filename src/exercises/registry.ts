import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

/**
 * Auto-discovers every exercise folder (e.g. `01-jsx-and-components/`).
 * Each folder must contain README.md, Exercise.tsx and Solution.tsx,
 * and both .tsx files must `export default` a component with no props.
 *
 * `import.meta.glob` is a Vite feature: it turns a file pattern into a map of
 * `path -> () => import(path)`, so each exercise is code-split and loaded lazily.
 */
type Loader = () => Promise<{ default: ComponentType }>

const exerciseLoaders = import.meta.glob<{ default: ComponentType }>('./*/Exercise.tsx')
const solutionLoaders = import.meta.glob<{ default: ComponentType }>('./*/Solution.tsx')
const readmes = import.meta.glob<string>('./*/README.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export type ReadmeParts = { before: string; task: string; after: string }

export type ExerciseEntry = {
  slug: string
  number: string
  title: string
  readme: string
  /** The README split around its "## Your task" (or "## The ticket") section. */
  parts: ReadmeParts
  Exercise: LazyExoticComponent<ComponentType>
  Solution: LazyExoticComponent<ComponentType>
}

const folderOf = (file: string) => file.split('/')[1]

const TASK_HEADING = /^## (Your task|The ticket)\b.*$/m

/** Splits a README into the text before the task section, the task section, and the rest. */
export function splitReadme(readme: string): ReadmeParts {
  const match = TASK_HEADING.exec(readme)
  if (!match) return { before: readme, task: '', after: '' }
  const start = match.index
  // The task section ends at the next level-2 heading (`## ...`), not at `### ...` sub-headings.
  const next = readme.slice(start + match[0].length).search(/^## /m)
  const end = next === -1 ? readme.length : start + match[0].length + next
  return {
    before: readme.slice(0, start).trimEnd(),
    task: readme.slice(start, end).trim(),
    after: readme.slice(end).trimStart(),
  }
}

export const exercises: ExerciseEntry[] = Object.keys(exerciseLoaders)
  .map((file) => {
    const slug = folderOf(file)
    const readme = readmes[`./${slug}/README.md`] ?? ''
    const heading = readme.match(/^#\s+(.+)$/m)?.[1] ?? slug
    return {
      slug,
      number: slug.slice(0, 2),
      title: heading.replace(/^\d+\s*[-–.]\s*/, ''),
      readme,
      parts: splitReadme(readme),
      Exercise: lazy(exerciseLoaders[file] as Loader),
      Solution: lazy(solutionLoaders[`./${slug}/Solution.tsx`] as Loader),
    }
  })
  .sort((a, b) => a.slug.localeCompare(b.slug))
