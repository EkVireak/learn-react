import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ActionDispatch,
  type ReactNode,
} from 'react'

type Toast = { id: number; message: string }
type Action = { type: 'push'; toast: Toast } | { type: 'dismiss'; id: number }

function toastReducer(state: Toast[], action: Action): Toast[] {
  switch (action.type) {
    case 'push':
      return [...state, action.toast]
    case 'dismiss':
      return state.filter((t) => t.id !== action.id)
  }
}

const ToastContext = createContext<((message: string) => void) | null>(null)

let nextId = 1

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, dispatch] = useReducer(toastReducer, [])
  const notify = (message: string) => dispatch({ type: 'push', toast: { id: nextId++, message } })

  return (
    <ToastContext value={notify}>
      {children}
      <div role="status" aria-live="polite" className="toasts">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} dispatch={dispatch} />
        ))}
      </div>
    </ToastContext>
  )
}

function ToastItem({ toast, dispatch }: { toast: Toast; dispatch: ActionDispatch<[Action]> }) {
  // `dispatch` from useReducer is stable, so this timer starts once per toast.
  useEffect(() => {
    const timer = setTimeout(() => dispatch({ type: 'dismiss', id: toast.id }), 3000)
    return () => clearTimeout(timer)
  }, [toast.id, dispatch])
  return <p className="toast">{toast.message}</p>
}

export function useToast() {
  const notify = useContext(ToastContext)
  if (!notify) throw new Error('useToast must be used inside <ToastProvider>')
  return notify
}
