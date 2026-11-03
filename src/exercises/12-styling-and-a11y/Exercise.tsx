// Exercise 12 – Styling & accessibility
import { useState, type ReactNode } from 'react'
import styles from './Modal.module.css'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Modal({ open, title, children }: ModalProps) {
  // TODO: const titleId = useId(); const closeRef = useRef<HTMLButtonElement>(null)
  // TODO: effect (when open): focus closeRef; add a 'keydown' listener on document that calls
  //       onClose() on Escape; return a cleanup that removes the listener
  // TODO: return null when !open
  // TODO: return createPortal(<div className={styles.backdrop} onClick=...> ... </div>, document.body)
  //       only close when e.target === e.currentTarget (the backdrop itself)
  if (!open) return null
  return (
    <div className={styles.backdrop}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button className={styles.close}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [open, setOpen] = useState(false)
  // TODO: ref for the "Open settings" button; focus it again when the modal closes

  return (
    <>
      <button onClick={() => setOpen(true)}>Open settings</button>
      <Modal open={open} onClose={() => setOpen(false)} title="Settings">
        <label>
          <input type="checkbox" /> Email notifications
        </label>
      </Modal>
    </>
  )
}
