import { useId } from 'react'
import { useSearchParams } from 'react-router'
import type { Priority, Status, Task } from '../api'
import { NewTaskForm } from './NewTaskForm'
import { useTasks } from './queries'
import { TaskCard } from './TaskCard'

const COLUMNS: { status: Status; title: string }[] = [
  { status: 'todo', title: 'To do' },
  { status: 'doing', title: 'In progress' },
  { status: 'done', title: 'Done' },
]

type Filter = 'all' | Priority
const FILTERS: Filter[] = ['all', 'low', 'medium', 'high']

export function BoardPage() {
  const tasks = useTasks()
  const [searchParams, setSearchParams] = useSearchParams()
  const priorityParam = searchParams.get('priority')
  const filter: Filter = FILTERS.includes(priorityParam as Filter)
    ? (priorityParam as Filter)
    : 'all'

  function changeFilter(value: Filter) {
    setSearchParams(value === 'all' ? {} : { priority: value })
  }

  return (
    <div className="board-page">
      <h1>Task Board</h1>
      <div className="toolbar">
        <NewTaskForm />
        <label>
          Priority filter{' '}
          <select value={filter} onChange={(e) => changeFilter(e.target.value as Filter)}>
            {FILTERS.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </label>
      </div>

      {tasks.isPending ? (
        <p>Loading tasks…</p>
      ) : tasks.isError ? (
        <div role="alert">
          <p>Could not load tasks</p>
          <p>
            Is the API running? Start it with <code>npm run api</code>.
          </p>
          <button onClick={() => tasks.refetch()}>Retry</button>
        </div>
      ) : (
        <div className="columns">
          {COLUMNS.map((col) => (
            <Column
              key={col.status}
              title={col.title}
              tasks={tasks.data.filter(
                (t) => t.status === col.status && (filter === 'all' || t.priority === filter),
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function Column({ title, tasks }: { title: string; tasks: Task[] }) {
  const headingId = useId()
  return (
    <section aria-labelledby={headingId} className="column">
      <h2 id={headingId}>
        {title} <span className="count">{tasks.length}</span>
      </h2>
      {tasks.length === 0 ? (
        <p className="empty">Nothing here</p>
      ) : (
        <ul>
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </ul>
      )}
    </section>
  )
}
