import type { User } from '../types/user'

export function UserList({ data }: { data: User[] }) {
  return (
    <ul className="user-list">
      {data.map(user => (
        <li key={user.id}>
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </li>
      ))}
    </ul>
  )
}
