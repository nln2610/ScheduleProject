import { motion } from 'framer-motion'
import { getCategory } from '../i18n'
import { formatCountdown, formatDateTime, getCountdown } from '../utils/datetime'

// Sự kiện sắp tới gần nhất, làm nổi bật với vòng SVG đếm ngược.
// Vòng đầy dần khi sự kiện tới gần (tính trong cửa sổ 30 ngày).
const WINDOW_MS = 30 * 86400000
const R = 52
const CIRC = 2 * Math.PI * R

export default function NextEventHero({ t, lang, event, now }) {
  const cat = getCategory(event.category)
  const c = getCountdown(event.datetime, now)
  const countdownText = formatCountdown(event.datetime, now, t)

  // Tỉ lệ tiến trình: càng gần càng đầy (0 → 1).
  const progress = Math.max(0, Math.min(1, 1 - c.diff / WINDOW_MS))
  const dashOffset = CIRC * (1 - progress)

  return (
    <motion.section
      className="hero"
      style={{ '--cat-color': cat.color }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="hero-info">
        <span className="hero-label">{t.heroLabel}</span>
        <div className="hero-head">
          <span className="cat-badge" style={{ backgroundColor: cat.color }}>
            {t[cat.labelKey]}
          </span>
        </div>
        <h2 className="hero-title">{event.title}</h2>
        <div className="hero-datetime">{formatDateTime(event.datetime, lang)}</div>
        <div className="hero-countdown">{countdownText}</div>
      </div>

      <div className="hero-ring">
        <svg viewBox="0 0 120 120" width="128" height="128">
          <circle className="ring-track" cx="60" cy="60" r={R} />
          <motion.circle
            className="ring-progress"
            cx="60"
            cy="60"
            r={R}
            strokeDasharray={CIRC}
            initial={{ strokeDashoffset: CIRC }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
          />
        </svg>
        <div className="ring-center">
          <span className="ring-days">{Math.max(0, c.days)}</span>
          <span className="ring-unit">{t.heroDaysLeft}</span>
        </div>
      </div>
    </motion.section>
  )
}
