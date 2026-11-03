// Capstone API client — given to you so you can focus on React.
// Start the fake REST API with `npm run api` (json-server on http://localhost:3001).

export const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export type Status = 'todo' | 'doing' | 'done'
export type Priority = 'low' | 'medium' | 'high'

export type Task = {
  id: string
  title: string
  description: string
  status: Status
  priority: Priority
  createdAt: string
}

export type NewTask = Pick<Task, 'title' | 'priority'> & { description?: string }

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<T>
}

export const getTasks = () => request<Task[]>('/tasks')

export async function getTask(id: string): Promise<Task | null> {
  try {
    return await request<Task>(`/tasks/${id}`)
  } catch (e) {
    if (e instanceof Error && e.message === 'HTTP 404') return null
    throw e
  }
}

export const createTask = (input: NewTask) =>
  request<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify({
      description: '',
      ...input,
      status: 'todo',
      createdAt: new Date().toISOString(),
    }),
  })

export const updateTask = (id: string, patch: Partial<Omit<Task, 'id'>>) =>
  request<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })

export const deleteTask = (id: string) => request<unknown>(`/tasks/${id}`, { method: 'DELETE' })
