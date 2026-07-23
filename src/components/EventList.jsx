import { AnimatePresence, motion } from 'framer-motion'
import EventCard from './EventCard'

// Danh sách sự kiện chia 2 nhóm: Sắp tới (tăng dần) và Đã qua (mới nhất trước).
export default function EventList({ t, lang, events, now, onEdit, onDelete }) {
  const upcoming = events
    .filter((e) => new Date(e.datetime).getTime() >= now)
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))

  const past = events
    .filter((e) => new Date(e.datetime).getTime() < now)
    .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))

  const renderGroup = (label, list) =>
    list.length > 0 && (
      <section className="event-group">
        <h2 className="group-title">
          {label} <span className="group-count">{list.length}</span>
        </h2>
        <motion.div className="event-cards" layout>
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((e) => (
              <EventCard
                key={e.id}
                t={t}
                lang={lang}
                event={e}
                now={now}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    )

  return (
    <div className="event-list">
      {renderGroup(t.upcoming, upcoming)}
      {renderGroup(t.past, past)}
    </div>
  )
}
