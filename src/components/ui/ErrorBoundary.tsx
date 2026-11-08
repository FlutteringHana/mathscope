import { Component, type ReactNode } from 'react'

export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) return <section role="alert">
      <h1>The experiment could not be displayed</h1>
      <p>{this.state.error.message}</p>
      <p>Reload to restore the default parameters and try again.</p>
      <button onClick={() => window.location.reload()}>Reload experiment</button>
    </section>
    return this.props.children
  }
}
