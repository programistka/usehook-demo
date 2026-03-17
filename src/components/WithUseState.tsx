import { useState, useEffect } from 'react'
import type { User } from '../types/user'
import { UserList } from './UserList'

export function WithUseState({ url }: { url: string }) {
  const [data, setData] = useState<User[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setData(null)
    setError(null)

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<User[]>
      })
      .then(json => {
        if (!cancelled) {
          setData(json)
          setLoading(false)
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [url])

  if (loading) return <div className="state state--loading">⏳ Loading...</div>
  if (error) return <div className="state state--error">💥 Error: {error}</div>
  return <UserList data={data!} />
}
