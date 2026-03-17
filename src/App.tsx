import { Suspense, useState } from 'react'
import { WithUseState } from './components/WithUseState'
import { WithUse } from './components/WithUse'
import { ErrorBoundary } from './components/ErrorBoundary'
import type { User } from './types/user'
import './App.css'

const GOOD_URL = 'https://jsonplaceholder.typicode.com/users'
const BAD_URL = 'https://jsonplaceholder.typicode.com/does-not-exist'

function fetchUsers(url: string): Promise<User[]> {
  return fetch(url).then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  })
}

// ─── snippets shown in the UI ──────────────────────────────────────────────

const classicSnippet = `function UserListClassic({ url }) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error(\`HTTP \${res.status}\`)
        }
        return res.json()
      })
      .then(json => {
        setData(json)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [url])

  if (loading) return <Spinner />
  if (error)   return <ErrorMsg error={error} />
  return <UserList data={data} />
}`

const modernComponent = `// Component — happy path only
function UserListModern({ promise }) {
  const data = use(promise)
  return <UserList data={data} />
}`

const modernWrapper = `// Container — declarative state handling
<ErrorBoundary>             {/* ← handles error */}
  <Suspense fallback={...}> {/* ← handles loading */}
    <UserListModern promise={promise} />
  </Suspense>
</ErrorBoundary>`

// ───────────────────────────────────────────────────────────────────────────

function App() {
  const [fetchKey, setFetchKey] = useState(0)
  const [url, setUrl] = useState(GOOD_URL)
  const [promise, setPromise] = useState<Promise<User[]>>(() =>
    fetchUsers(GOOD_URL)
  )

  function reload() {
    setUrl(GOOD_URL)
    setFetchKey(k => k + 1)
    setPromise(fetchUsers(GOOD_URL))
  }

  function simulateError() {
    setUrl(BAD_URL)
    setFetchKey(k => k + 1)
    setPromise(fetchUsers(BAD_URL))
  }

  return (
    <div className="app">
      <div className="app-header">
        <h1>
          useState <span className="vs">vs</span> use
        </h1>
        <p className="subtitle">
          Both fetch the same data — the difference is who manages the states
        </p>
        <div className="controls">
          <button className="btn btn--reload" onClick={reload}>
            ↺ Reload
          </button>
          <button className="btn btn--error" onClick={simulateError}>
            💥 Simulate error
          </button>
        </div>
      </div>

      <div className="comparison">
        {/* ── LEFT: useState ── */}
        <div className="panel panel--classic">
          <div className="panel-header">
            <div>
              <span className="badge badge--classic">React ≤ 18</span>
              <h2>useState + useEffect</h2>
            </div>
            <span className="lines-count">~27 lines</span>
          </div>

          <div className="code-section">
            <p className="code-label">Component manages everything itself:</p>
            <pre className="code-block">
              <code>{classicSnippet}</code>
            </pre>
          </div>

          <div className="panel-output">
            <WithUseState key={fetchKey} url={url} />
          </div>
        </div>

        {/* ── RIGHT: use() ── */}
        <div className="panel panel--modern">
          <div className="panel-header">
            <div>
              <span className="badge badge--modern">React 19</span>
              <h2>use + Suspense + ErrorBoundary</h2>
            </div>
            <span className="lines-count">3 lines</span>
          </div>

          <div className="code-section">
            <p className="code-label">Component — happy path only:</p>
            <pre className="code-block">
              <code>{modernComponent}</code>
            </pre>
            <p className="code-label" style={{ marginTop: '12px' }}>
              Loading and error handled by React:
            </p>
            <pre className="code-block">
              <code>{modernWrapper}</code>
            </pre>
          </div>

          <div className="panel-output">
            <ErrorBoundary key={fetchKey}>
              <Suspense
                fallback={
                  <div className="state state--loading">⏳ Loading...</div>
                }
              >
                <WithUse promise={promise} />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
