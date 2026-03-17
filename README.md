# useState vs use — demo

A side-by-side comparison of two approaches to data fetching in React.

## What it shows

| | `useState` + `useEffect` | `use` + `Suspense` + `ErrorBoundary` |
|---|---|---|
| React version | ≤ 18 | 19 |
| Loading state | manual `useState` | `<Suspense fallback={...}>` |
| Error state | manual `useState` | `<ErrorBoundary>` |
| Component size | ~27 lines | 3 lines |
| Component contains | loading + error + happy path | happy path only |

Data source: [JSONPlaceholder](https://jsonplaceholder.typicode.com/users)

## Stack

- React 19
- TypeScript
- Vite

## Run

```bash
yarn dev
```
