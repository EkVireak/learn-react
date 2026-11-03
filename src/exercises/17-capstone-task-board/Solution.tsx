// Solution 17 – Capstone: Task Board (see ./solution for the pieces)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Link, MemoryRouter, Route, Routes } from 'react-router'
import './solution/board.css'
import { BoardPage } from './solution/BoardPage'
import { TaskDetailPage } from './solution/TaskDetailPage'
import { ToastProvider } from './solution/toast'

const defaultClient = new QueryClient()

type Props = { initialEntries?: string[]; queryClient?: QueryClient }

export default function TaskBoardApp({
  initialEntries = ['/'],
  queryClient = defaultClient,
}: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <div className="task-board">
          <ToastProvider>
            <Routes>
              <Route path="/" element={<BoardPage />} />
              <Route path="/tasks/:id" element={<TaskDetailPage />} />
              <Route
                path="*"
                element={
                  <p>
                    Page not found. <Link to="/">Back to board</Link>
                  </p>
                }
              />
            </Routes>
          </ToastProvider>
        </div>
      </MemoryRouter>
    </QueryClientProvider>
  )
}
