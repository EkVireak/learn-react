import { Link } from 'react-router'
import type { Status, Task } from '../api'
import { useUpdateTask } from './queries'

const NEXT: Record<Status, { label: string; to: Status }> = {
  todo: { label: 'Start', to: 'doing' },
  doing: { label: 'Complete', to: 'done' },
  done: { label: 'Reopen', to: 'todo' },
}

export function TaskCard({ task }: { task: Task }) {
  const update = useUpdateTask()
  const next = NEXT[task.status]

  return (
    <li className="card">
      <Link to={`/tasks/${task.id}`}>{task.title}</Link>
      <span className={`badge ${task.priority}`}>{task.priority}</span>
      <button
        aria-label={`${next.label} ${task.title}`}
        disabled={update.isPending}
        onClick={() => update.mutate({ id: task.id, patch: { status: next.to } })}
      >
        {next.label}
      </button>
    </li>
  )
}
