// Exercise 14 – Error boundaries, Suspense & lazy loading
import { Component, type ReactNode } from 'react'
import { BuggyCounter } from './Buggy'

type Props = {
  children: ReactNode
  fallback: (error: Error, reset: () => void) => ReactNode
}
type State = { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  // TODO: static getDerivedStateFromError(error: Error): State { ... }
  // TODO: componentDidCatch(error: Error, info: ErrorInfo) { console.error(...) }
  // TODO: reset = () => this.setState({ error: null })

  render() {
    // TODO: if there's an error, return this.props.fallback(error, this.reset)
    return this.props.children
  }
}

// TODO: const HeavyChart = lazy(() => import('./HeavyChart'))

export default function Dashboard() {
  // TODO: `showChart` state + "Show chart" button + <Suspense fallback={<p>Loading chart…</p>}>

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {/* TODO: wrap in <ErrorBoundary fallback={(error, reset) => ...}> */}
      <BuggyCounter />
    </div>
  )
}
