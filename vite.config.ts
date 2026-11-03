import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

/**
 * `npm run test:solutions` runs Vitest with `--mode solution`.
 * In that mode, imports inside *test files* are redirected to the reference solutions:
 *   './Exercise'  -> './Solution.tsx'
 *   './hooks'     -> './hooks.solution.ts'   (any './x' that has a sibling 'x.solution.ts(x)')
 * so we can prove the solutions pass the same tests the learner is working against.
 */
function useSolutions(enabled: boolean): Plugin {
  return {
    name: 'use-solutions',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!enabled || !importer || !/\.test\.tsx?$/.test(importer)) return null
      if (!source.startsWith('./')) return null
      const dir = path.dirname(importer)
      const base = source.replace(/\.tsx?$/, '')
      const candidates =
        base === './Exercise'
          ? ['Solution.tsx']
          : [`${base.slice(2)}.solution.ts`, `${base.slice(2)}.solution.tsx`]
      const found = candidates.map((c) => path.join(dir, c)).find((p) => fs.existsSync(p))
      return found ? this.resolve(found, importer) : null
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), useSolutions(mode === 'solution')],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
}))
