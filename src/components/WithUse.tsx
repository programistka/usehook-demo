import { use } from 'react'
import type { User } from '../types/user'
import { UserList } from './UserList'

export function WithUse({ promise }: { promise: Promise<User[]> }) {
  const data = use(promise)
  return <UserList data={data} />
}
