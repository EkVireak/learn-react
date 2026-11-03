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

export type ExerciseEntry = {
  slug: string
  number: string
  title: string
  readme: string
  Exercise: LazyExoticComponent<ComponentType>
  Solution: LazyExoticComponent<ComponentType>
}

const folderOf = (file: string) => file.split('/')[1]

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
      Exercise: lazy(exerciseLoaders[file] as Loader),
      Solution: lazy(solutionLoaders[`./${slug}/Solution.tsx`] as Loader),
    }
  })
  .sort((a, b) => a.slug.localeCompare(b.slug))
