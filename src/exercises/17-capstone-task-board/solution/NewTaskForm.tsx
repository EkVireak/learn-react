import { useState, type FormEvent } from 'react'
import { z } from 'zod'
import type { Priority } from '../api'
import { useCreateTask } from './queries'
import { useToast } from './toast'

const NewTaskSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  priority: z.enum(['low', 'medium', 'high']),
})

export function NewTaskForm() {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [error, setError] = useState<string | null>(null)
  const create = useCreateTask()
  const notify = useToast()

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const result = NewTaskSchema.safeParse({ title, priority })
    if (!result.success) {
      setError(z.flattenError(result.error).fieldErrors.title?.[0] ?? 'Invalid task')
      return
    }
    setError(null)
    create.mutate(result.data, {
      onSuccess: () => {
        setTitle('')
        setPriority('medium')
        notify('Task created')
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="new-task">
      <label>
        Title{' '}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'title-error' : undefined}
        />
      </label>
      <label>
        Priority{' '}
        <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
      </label>
      <button type="submit" disabled={create.isPending}>
        {create.isPending ? 'Adding…' : 'Add task'}
      </button>
      {error && (
        <small id="title-error" className="error">
          {error}
        </small>
      )}
      {create.isError && <small className="error">Could not create task</small>}
    </form>
  )
}
