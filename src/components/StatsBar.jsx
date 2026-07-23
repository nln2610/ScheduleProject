import { motion } from 'framer-motion'

// Thanh thống kê nhanh: tổng / sắp tới / đã qua.
export default function StatsBar({ t, total, upcoming, past }) {
  const items = [
    { label: t.statTotal, value: total },
    { label: t.statUpcoming, value: upcoming },
    { label: t.statPast, value: past },
  ]

  return (
    <div className="stats-bar">
      {items.map((it, i) => (
        <motion.div
          key={it.label}
          className="stat-card"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <span className="stat-value">{it.value}</span>
          <span className="stat-label">{it.label}</span>
        </motion.div>
      ))}
    </div>
  )
}
