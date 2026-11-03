// Exercise 08 – useRef, useMemo & custom hooks
import { useState } from 'react'
import { useDebounce, useLocalStorage } from './hooks'

const DEFAULT_NOTES = ['Buy coffee', 'Read React docs', 'Review PR #42']

export default function NotesSearch() {
  const [notes] = useLocalStorage<string[]>('notes', DEFAULT_NOTES)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  // TODO: const searchRef = useRef<HTMLInputElement>(null) and attach it to the Search input
  // TODO: focus the search input on mount (useEffect with [])
  // TODO: state for the "New note" input + add handler (setNotes(prev => [...prev, text]))

  // TODO: wrap this in useMemo with [notes, debouncedQuery] as dependencies
  const visible = notes.filter((n) => n.toLowerCase().includes(debouncedQuery.toLowerCase()))

  return (
    <div style={{ display: 'grid', gap: 8, maxWidth: 400 }}>
      <form>{/* TODO: input labelled "New note" + Add button */}</form>

      <label>
        Search <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      {/* TODO: "Focus search" button */}

      <ul>
        {visible.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </div>
  )
}
