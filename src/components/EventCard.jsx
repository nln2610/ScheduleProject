import { motion } from 'framer-motion'
import { getCategory } from '../i18n'
import { formatCountdown, formatDateTime, getCountdown } from '../utils/datetime'

// Một thẻ sự kiện: tiêu đề, danh mục, đếm ngược, ngày giờ, ghi chú, nút sửa/xóa.
export default function EventCard({ t, lang, event, now, onEdit, onDelete }) {
  const cat = getCategory(event.category)
  const c = getCountdown(event.datetime, now)
  const countdownText = formatCountdown(event.datetime, now, t)

  // Mức khẩn cấp để tô màu đếm ngược (chỉ với sự kiện sắp tới)
  let urgency = 'normal'
  if (!c.past) {
    if (c.diff < 3600000) urgency = 'soon' // dưới 1 giờ
    else if (c.diff < 86400000) urgency = 'today' // dưới 1 ngày
  }

  return (
    <motion.div
      layout
      className={`event-card ${c.past ? 'is-past' : ''}`}
      style={{ '--cat-color': cat.color }}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: c.past ? 0.52 : 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={{ y: -4 }}
    >
      <div className="event-main">
        <div className="event-head">
          <span className="cat-badge" style={{ backgroundColor: cat.color }}>
            {t[cat.labelKey]}
          </span>
          <h3 className="event-title">{event.title}</h3>
        </div>
        <div className="event-datetime">{formatDateTime(event.datetime, lang)}</div>
        {event.note && <p className="event-note">{event.note}</p>}
      </div>

      <div className="event-side">
        <div className={`countdown countdown-${urgency} ${c.past ? 'countdown-past' : ''}`}>
          {countdownText}
        </div>
        <div className="event-actions">
          <button className="mini-btn" onClick={() => onEdit(event)}>
            {t.edit}
          </button>
          <button className="mini-btn mini-btn-danger" onClick={() => onDelete(event)}>
            {t.delete}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
