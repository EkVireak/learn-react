import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { error: Error | null }

/**
 * Keeps one broken exercise from crashing the whole app.
 * Give it a `key` to reset it (React remounts it when the key changes).
 * (Error boundaries must still be class components — see exercise 14.)
 */
export class ShellErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Exercise crashed:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div role="alert" className="shell-error">
          <strong>This component threw an error:</strong>
          <pre>{this.state.error.message}</pre>
          <button onClick={() => this.setState({ error: null })}>Try again</button>
        </div>
      )
    }
    return this.props.children
  }
}
