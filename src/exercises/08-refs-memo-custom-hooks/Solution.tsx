// Solution 08 – useRef, useMemo & custom hooks
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useDebounce, useLocalStorage } from './hooks.solution'

const DEFAULT_NOTES = ['Buy coffee', 'Read React docs', 'Review PR #42']

export default function NotesSearch() {
  const [notes, setNotes] = useLocalStorage<string[]>('notes', DEFAULT_NOTES)
  const [draft, setDraft] = useState('')
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    searchRef.current?.focus()
  }, [])

  // Only recomputed when notes or the *debounced* query change, not on every keystroke.
  const visible = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    return notes.filter((n) => n.toLowerCase().includes(q))
  }, [notes, debouncedQuery])

  function addNote(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setNotes((prev) => [...prev, text])
    setDraft('')
  }

  return (
    <div style={{ display: 'grid', gap: 8, maxWidth: 400 }}>
      <form onSubmit={addNote}>
        <label>
          New note <input value={draft} onChange={(e) => setDraft(e.target.value)} />
        </label>{' '}
        <button type="submit">Add</button>
      </form>

      <label>
        Search <input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <button onClick={() => searchRef.current?.focus()}>Focus search</button>

      {query !== debouncedQuery && <small>Searching…</small>}
      <ul>
        {visible.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </div>
  )
}
