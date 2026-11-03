import { Link, useNavigate, useParams } from 'react-router'
import { useDeleteTask, useTask } from './queries'
import { useToast } from './toast'

const STATUS_LABEL = { todo: 'To do', doing: 'In progress', done: 'Done' } as const

export function TaskDetailPage() {
  const { id = '' } = useParams()
  const task = useTask(id)
  const remove = useDeleteTask()
  const navigate = useNavigate()
  const notify = useToast()

  if (task.isPending) return <p>Loading task…</p>
  if (task.isError) return <p role="alert">Could not load task</p>
  if (!task.data) {
    return (
      <div>
        <p>Task not found</p>
        <Link to="/">Back to board</Link>
      </div>
    )
  }

  const t = task.data

  function handleDelete() {
    remove.mutate(t.id, {
      onSuccess: () => {
        notify('Task deleted')
        navigate('/')
      },
    })
  }

  return (
    <article className="detail">
      <Link to="/">Back to board</Link>
      <h2>{t.title}</h2>
      <p>{t.description || <em>No description</em>}</p>
      <dl>
        <dt>Status</dt>
        <dd>{STATUS_LABEL[t.status]}</dd>
        <dt>Priority</dt>
        <dd>{t.priority}</dd>
        <dt>Created</dt>
        <dd>{new Date(t.createdAt).toLocaleString()}</dd>
      </dl>
      <button onClick={handleDelete} disabled={remove.isPending} className="danger">
        {remove.isPending ? 'Deleting…' : 'Delete task'}
      </button>
    </article>
  )
}
