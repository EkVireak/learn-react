// Exercise 17 – Capstone: Task Board. Read README.md — it's your ticket.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router'

const defaultClient = new QueryClient()

type Props = { initialEntries?: string[]; queryClient?: QueryClient }

export default function TaskBoardApp({
  initialEntries = ['/'],
  queryClient = defaultClient,
}: Props) {
  // TODO: add your ToastProvider around the routes
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/" element={<StartHere />} />
          {/* TODO: /tasks/:id and a 404 route */}
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

function StartHere() {
  return (
    <div>
      <h1>Task Board</h1>
      <p>
        Start the API with <code>npm run api</code>, read the README, and build it step by step:
      </p>
      <ol>
        <li>List tasks in three columns (useQuery + getTasks)</li>
        <li>Create tasks (form + Zod + useMutation)</li>
        <li>Move tasks between columns (PATCH)</li>
        <li>Priority filter in the URL</li>
        <li>Detail page + delete</li>
        <li>Toasts with context + useReducer</li>
      </ol>
    </div>
  )
}
