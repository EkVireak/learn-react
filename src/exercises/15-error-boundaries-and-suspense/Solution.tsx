// Solution 15 – Error boundaries, Suspense & lazy loading
import { Component, lazy, Suspense, useState, type ErrorInfo, type ReactNode } from 'react'
import { BuggyCounter } from './Buggy'

type Props = {
  children: ReactNode
  fallback: (error: Error, reset: () => void) => ReactNode
}
type State = { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production you'd send this to Sentry / Datadog / etc.
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  reset = () => this.setState({ error: null })

  render() {
    if (this.state.error) return this.props.fallback(this.state.error, this.reset)
    return this.props.children
  }
}

// Separate chunk, downloaded on first render.
const HeavyChart = lazy(() => import('./HeavyChart'))

export default function Dashboard() {
  const [showChart, setShowChart] = useState(false)

  return (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <ErrorBoundary
        fallback={(error, reset) => (
          <div role="alert">
            <p>Something went wrong: {error.message}</p>
            <button onClick={reset}>Try again</button>
          </div>
        )}
      >
        <BuggyCounter />
      </ErrorBoundary>

      {showChart ? (
        <Suspense fallback={<p>Loading chart…</p>}>
          <HeavyChart />
        </Suspense>
      ) : (
        <button onClick={() => setShowChart(true)}>Show chart</button>
      )}
    </div>
  )
}
