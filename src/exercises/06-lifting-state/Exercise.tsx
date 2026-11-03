// Exercise 06 – Lifting state up & one-way data flow
import { useState } from 'react'

export type Todo = { id: string; title: string; done: boolean }
export type Filter = 'all' | 'active' | 'completed'

const initialTodos: Todo[] = [
  { id: '1', title: 'Learn JSX', done: true },
  { id: '2', title: 'Learn state', done: false },
]

export function TodoForm({ onAdd }: { onAdd: (title: string) => void }) {
  // TODO: controlled input labelled "New todo"; on submit -> preventDefault, onAdd(trimmed), clear
  void onAdd
  return (
    <form>
      <input aria-label="New todo" />
      <button type="submit">Add</button>
    </form>
  )
}

type TodoItemProps = {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo }: TodoItemProps) {
  // TODO: <label><input type="checkbox" checked=... onChange=.../> {title}</label>
  // TODO: <button aria-label={`Delete ${todo.title}`}>Delete</button>
  return <li>{todo.title}</li>
}

type FilterBarProps = { filter: Filter; onChange: (filter: Filter) => void }

export function FilterBar({ filter }: FilterBarProps) {
  // TODO: three buttons All / Active / Completed with aria-pressed={filter === ...}
  return <div>Filter: {filter}</div>
}

export default function TodoApp() {
  const [todos] = useState<Todo[]>(initialTodos)
  const [filter] = useState<Filter>('all')

  // TODO: addTodo(title), toggleTodo(id), deleteTodo(id) — all immutable updates
  //       (use crypto.randomUUID() for new ids)
  // TODO: derive `visible` from todos + filter, and `remaining` count

  return (
    <div>
      <h3>Todos</h3>
      <TodoForm onAdd={() => {}} />
      <ul>
        {todos.map((t) => (
          <TodoItem key={t.id} todo={t} onToggle={() => {}} onDelete={() => {}} />
        ))}
      </ul>
      <FilterBar filter={filter} onChange={() => {}} />
      {/* TODO: "N items left" */}
    </div>
  )
}
