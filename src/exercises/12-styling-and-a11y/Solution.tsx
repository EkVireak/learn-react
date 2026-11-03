// Solution 12 – Styling & accessibility
import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.css'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  function onBackdropClick(e: MouseEvent<HTMLDivElement>) {
    // Only when the click started on the backdrop, not on something inside the dialog.
    if (e.target === e.currentTarget) onClose()
  }

  return createPortal(
    <div className={styles.backdrop} onClick={onBackdropClick}>
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} className={styles.dialog}>
        <div className={styles.header}>
          <h2 id={titleId}>{title}</h2>
          <button ref={closeRef} className={styles.close} aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}

export default function SettingsPage() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  function close() {
    setOpen(false)
    triggerRef.current?.focus() // return focus to where the user was
  }

  return (
    <>
      <button ref={triggerRef} onClick={() => setOpen(true)}>
        Open settings
      </button>
      <Modal open={open} onClose={close} title="Settings">
        <label>
          <input type="checkbox" /> Email notifications
        </label>
      </Modal>
    </>
  )
}
