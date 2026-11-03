import { Suspense, useEffect, useState } from 'react'
import { exercises } from './exercises/registry'
import { ShellErrorBoundary } from './shell/ShellErrorBoundary'

type View = 'readme' | 'exercise' | 'solution' | 'compare'
const VIEWS: { id: View; label: string }[] = [
  { id: 'readme', label: 'README' },
  { id: 'exercise', label: 'My code' },
  { id: 'solution', label: 'Solution' },
  { id: 'compare', label: 'Side by side' },
]

/** Current exercise lives in the URL hash (#03-use-state) so refresh & back button work. */
function useHashSlug(fallback: string) {
  const read = () => decodeURIComponent(window.location.hash.slice(1)) || fallback
  const [slug, setSlug] = useState(read)
  useEffect(() => {
    const onChange = () => setSlug(read())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  })
  return slug
}

function readStoredView(): View {
  try {
    const v = localStorage.getItem('shell:view')
    if (v && VIEWS.some((x) => x.id === v)) return v as View
  } catch {
    /* storage unavailable – use default */
  }
  return 'readme'
}

export default function App() {
  const slug = useHashSlug(exercises[0]?.slug ?? '')
  const [view, setView] = useState<View>(readStoredView)
  const current = exercises.find((e) => e.slug === slug) ?? exercises[0]

  useEffect(() => {
    try {
      localStorage.setItem('shell:view', view)
    } catch {
      /* ignore */
    }
  }, [view])

  if (!current) return <p>No exercises found in src/exercises.</p>

  const { Exercise, Solution } = current

  return (
    <div className="shell">
      <nav className="shell-nav" aria-label="Exercises">
        <h1>Learn React</h1>
        <ol>
          {exercises.map((e) => (
            <li key={e.slug}>
              <a href={`#${e.slug}`} aria-current={e.slug === current.slug ? 'page' : undefined}>
                <span className="num">{e.number}</span> {e.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <main className="shell-main">
        <header className="shell-header">
          <h2>
            {current.number}. {current.title}
          </h2>
          <div role="tablist" aria-label="View">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                role="tab"
                aria-selected={view === v.id}
                onClick={() => setView(v.id)}
              >
                {v.label}
              </button>
            ))}
          </div>
          <p className="hint">
            Edit <code>src/exercises/{current.slug}/Exercise.tsx</code> · run{' '}
            <code>npm test -- {current.number}</code>
          </p>
        </header>

        {view === 'readme' ? (
          <article className="readme">{current.readme}</article>
        ) : (
          <div className={view === 'compare' ? 'panes two' : 'panes'}>
            {(view === 'exercise' || view === 'compare') && (
              <section className="pane" aria-label="My code">
                {view === 'compare' && <h3>My code</h3>}
                <ShellErrorBoundary key={`${current.slug}-mine`}>
                  <Suspense fallback={<p>Loading…</p>}>
                    <Exercise />
                  </Suspense>
                </ShellErrorBoundary>
              </section>
            )}
            {(view === 'solution' || view === 'compare') && (
              <section className="pane" aria-label="Solution">
                {view === 'compare' && <h3>Solution</h3>}
                <ShellErrorBoundary key={`${current.slug}-solution`}>
                  <Suspense fallback={<p>Loading…</p>}>
                    <Solution />
                  </Suspense>
                </ShellErrorBoundary>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
