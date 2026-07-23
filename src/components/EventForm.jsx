import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CATEGORIES, REMIND_OPTIONS } from '../i18n'
import { toDatetimeLocalValue } from '../utils/datetime'

// Modal thêm/sửa sự kiện. `initial` = sự kiện đang sửa (null nếu thêm mới).
export default function EventForm({ t, initial, prefill, onSave, onClose }) {
  const [title, setTitle] = useState('')
  const [datetime, setDatetime] = useState('')
  const [category, setCategory] = useState('exam')
  const [note, setNote] = useState('')
  const [remindBefore, setRemindBefore] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initial) {
      setTitle(initial.title)
      setDatetime(toDatetimeLocalValue(initial.datetime))
      setCategory(initial.category)
      setNote(initial.note || '')
      setRemindBefore(initial.remindBefore || 0)
    } else {
      // Thêm nhanh cùng ngày: dùng ngày sẵn có; nếu không thì lấy hiện tại.
      setDatetime(toDatetimeLocalValue(prefill?.datetime || Date.now()))
    }
  }, [initial, prefill])

  // Đóng bằng phím Esc
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) {
      setError(t.errTitle)
      return
    }
    if (!datetime) {
      setError(t.errDate)
      return
    }
    onSave({
      title: title.trim(),
      datetime: new Date(datetime).toISOString(),
      category,
      note: note.trim(),
      remindBefore: Number(remindBefore),
    })
  }

  return (
    <motion.div
      className="modal-overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 8 }}
        transition={{ duration: 0.25, ease: [0.2, 0.9, 0.3, 1.1] }}
      >
        <h2>{initial ? t.editEvent : t.addEvent}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            {t.title}
            <input
              type="text"
              value={title}
              placeholder={t.titlePlaceholder}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </label>

          <label>
            {t.datetime}
            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
            />
          </label>

          <label>
            {t.category}
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {t[c.labelKey]}
                </option>
              ))}
            </select>
          </label>

          <label>
            {t.remind}
            <select
              value={remindBefore}
              onChange={(e) => setRemindBefore(e.target.value)}
            >
              {REMIND_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {t[r.labelKey]}
                </option>
              ))}
            </select>
          </label>

          <label>
            {t.note}
            <textarea
              value={note}
              placeholder={t.notePlaceholder}
              rows={3}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>
              {t.cancel}
            </button>
            <button type="submit" className="btn btn-primary">
              {t.save}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
