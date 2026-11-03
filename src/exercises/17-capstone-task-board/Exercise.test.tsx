import { QueryClient } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Task } from './api'
import TaskBoardApp from './Exercise'

const seed: Task[] = [
  {
    id: '1',
    title: 'Set up',
    description: 'Init repo',
    status: 'done',
    priority: 'high',
    createdAt: '2026-11-01T09:00:00.000Z',
  },
  {
    id: '2',
    title: 'Build board',
    description: '',
    status: 'doing',
    priority: 'medium',
    createdAt: '2026-11-02T09:00:00.000Z',
  },
  {
    id: '3',
    title: 'Write tests',
    description: 'All of them',
    status: 'todo',
    priority: 'high',
    createdAt: '2026-11-02T10:00:00.000Z',
  },
  {
    id: '4',
    title: 'Polish',
    description: '',
    status: 'todo',
    priority: 'low',
    createdAt: '2026-11-03T08:00:00.000Z',
  },
]

/** A tiny in-memory json-server so tests don't need the real API. */
function fakeApi({ fail = false } = {}) {
  let tasks = structuredClone(seed)
  let nextId = 100
  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })

  const fetchMock = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
    if (fail) return json({}, 500)
    const { pathname } = new URL(String(input))
    const method = init?.method ?? 'GET'
    const id = pathname.match(/^\/tasks\/(.+)$/)?.[1]
    const body = init?.body ? JSON.parse(String(init.body)) : undefined

    if (pathname === '/tasks' && method === 'GET') return json(tasks)
    if (pathname === '/tasks' && method === 'POST') {
      const task = { ...body, id: String(nextId++) }
      tasks = [...tasks, task]
      return json(task, 201)
    }
    const existing = tasks.find((t) => t.id === id)
    if (!existing) return json({}, 404)
    if (method === 'GET') return json(existing)
    if (method === 'PATCH') {
      const updated = { ...existing, ...body }
      tasks = tasks.map((t) => (t.id === id ? updated : t))
      return json(updated)
    }
    if (method === 'DELETE') {
      tasks = tasks.filter((t) => t.id !== id)
      return json(existing)
    }
    return json({}, 405)
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function renderApp(path = '/') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const user = userEvent.setup()
  render(<TaskBoardApp initialEntries={[path]} queryClient={queryClient} />)
  return { user }
}

const column = (name: string) => screen.getByRole('region', { name: new RegExp(`^${name}`) })

describe('17 – Capstone: board', () => {
  it('1. shows tasks in three labelled columns', async () => {
    fakeApi()
    renderApp()
    expect(screen.getByRole('heading', { name: 'Task Board' })).toBeInTheDocument()
    expect(screen.getByText('Loading tasks…')).toBeInTheDocument()

    expect(
      await within(await findColumn('To do')).findByRole('link', { name: 'Write tests' }),
    ).toBeInTheDocument()
    expect(within(column('To do')).getByRole('link', { name: 'Polish' })).toBeInTheDocument()
    expect(
      within(column('In progress')).getByRole('link', { name: 'Build board' }),
    ).toBeInTheDocument()
    expect(within(column('Done')).getByRole('link', { name: 'Set up' })).toBeInTheDocument()
  })

  it('1. shows an error when the API fails', async () => {
    fakeApi({ fail: true })
    renderApp()
    expect(await screen.findByRole('alert')).toHaveTextContent('Could not load tasks')
  })

  it('2. validates and creates a task', async () => {
    const fetchMock = fakeApi()
    const { user } = renderApp()
    await findColumn('To do')

    await user.type(screen.getByLabelText('Title'), 'ab')
    await user.click(screen.getByRole('button', { name: 'Add task' }))
    expect(screen.getByText('Title must be at least 3 characters')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ method: 'POST' }),
    )

    await user.clear(screen.getByLabelText('Title'))
    await user.type(screen.getByLabelText('Title'), 'Ship it')
    await user.selectOptions(screen.getByLabelText('Priority'), 'high')
    await user.click(screen.getByRole('button', { name: 'Add task' }))

    expect(
      await within(column('To do')).findByRole('link', { name: 'Ship it' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Title')).toHaveValue('')
    expect(screen.getByRole('status')).toHaveTextContent('Task created')
    const post = fetchMock.mock.calls.find(([, init]) => init?.method === 'POST')
    expect(JSON.parse(String(post?.[1]?.body))).toMatchObject({
      title: 'Ship it',
      priority: 'high',
      status: 'todo',
    })
  })

  it('3. moves tasks between columns', async () => {
    fakeApi()
    const { user } = renderApp()
    await findColumn('To do')

    await user.click(screen.getByRole('button', { name: 'Start Write tests' }))
    expect(
      await within(column('In progress')).findByRole('link', { name: 'Write tests' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Complete Write tests' }))
    expect(
      await within(column('Done')).findByRole('link', { name: 'Write tests' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reopen Write tests' }))
    expect(
      await within(column('To do')).findByRole('link', { name: 'Write tests' }),
    ).toBeInTheDocument()
  })

  it('4. filters by priority', async () => {
    fakeApi()
    const { user } = renderApp('/?priority=high')
    await findColumn('To do')
    expect(screen.getByLabelText('Priority filter')).toHaveValue('high')
    expect(screen.queryByRole('link', { name: 'Polish' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Write tests' })).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Priority filter'), 'all')
    expect(screen.getByRole('link', { name: 'Polish' })).toBeInTheDocument()
  })
})

describe('17 – Capstone: details', () => {
  it('5. opens details from the board and deletes the task', async () => {
    fakeApi()
    const { user } = renderApp()
    await user.click(await screen.findByRole('link', { name: 'Write tests' }))

    expect(
      await screen.findByRole('heading', { level: 2, name: 'Write tests' }),
    ).toBeInTheDocument()
    expect(screen.getByText('All of them')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Delete task' }))
    expect(await screen.findByRole('heading', { name: 'Task Board' })).toBeInTheDocument()
    expect(await screen.findByText('Task deleted')).toBeInTheDocument()
    await findColumn('To do')
    expect(screen.queryByRole('link', { name: 'Write tests' })).not.toBeInTheDocument()
  })

  it('5. shows "Task not found" for unknown ids', async () => {
    fakeApi()
    renderApp('/tasks/999')
    expect(await screen.findByText('Task not found')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to board' })).toBeInTheDocument()
  })
})

async function findColumn(name: string) {
  return screen.findByRole('region', { name: new RegExp(`^${name}`) })
}
