// Solution 06 – Lifting state up & one-way data flow
import { useState, type FormEvent } from 'react'

export type Todo = { id: string; title: string; done: boolean }
export type Filter = 'all' | 'active' | 'completed'

const initialTodos: Todo[] = [
  { id: '1', title: 'Learn JSX', done: true },
  { id: '2', title: 'Learn state', done: false },
]

export function TodoForm({ onAdd }: { onAdd: (title: string) => void }) {
  // Local UI state: only the form cares about the half-typed text.
  const [title, setTitle] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input aria-label="New todo" value={title} onChange={(e) => setTitle(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  )
}

type TodoItemProps = {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li>
      <label style={{ textDecoration: todo.done ? 'line-through' : undefined }}>
        <input type="checkbox" checked={todo.done} onChange={() => onToggle(todo.id)} />{' '}
        {todo.title}
      </label>{' '}
      <button aria-label={`Delete ${todo.title}`} onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </li>
  )
}

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

type FilterBarProps = { filter: Filter; onChange: (filter: Filter) => void }

export function FilterBar({ filter, onChange }: FilterBarProps) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {FILTERS.map((f) => (
        <button key={f.value} aria-pressed={filter === f.value} onClick={() => onChange(f.value)}>
          {f.label}
        </button>
      ))}
    </div>
  )
}

export default function TodoApp() {
  // Shared state lives in the closest common parent.
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [filter, setFilter] = useState<Filter>('all')

  const addTodo = (title: string) =>
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), title, done: false }])

  const toggleTodo = (id: string) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  const deleteTodo = (id: string) => setTodos((prev) => prev.filter((t) => t.id !== id))

  // Derived — never stored in state.
  const visible = todos.filter((t) =>
    filter === 'active' ? !t.done : filter === 'completed' ? t.done : true,
  )
  const remaining = todos.filter((t) => !t.done).length

  return (
    <div>
      <h3>Todos</h3>
      <TodoForm onAdd={addTodo} />
      <ul>
        {visible.map((t) => (
          <TodoItem key={t.id} todo={t} onToggle={toggleTodo} onDelete={deleteTodo} />
        ))}
      </ul>
      <FilterBar filter={filter} onChange={setFilter} />
      <p>
        {remaining} {remaining === 1 ? 'item' : 'items'} left
      </p>
    </div>
  )
}
