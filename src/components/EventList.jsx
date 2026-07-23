import { AnimatePresence, motion } from 'framer-motion'
import EventCard from './EventCard'
import { dayKey, formatDayHeading } from '../utils/datetime'

// Gom danh sách (đã sắp xếp) thành các nhóm theo ngày, giữ nguyên thứ tự.
function groupByDay(list) {
  const groups = []
  const index = new Map()
  for (const e of list) {
    const key = dayKey(e.datetime)
    let g = index.get(key)
    if (!g) {
      g = { key, iso: e.datetime, events: [] }
      index.set(key, g)
      groups.push(g)
    }
    g.events.push(e)
  }
  return groups
}

// Danh sách sự kiện chia 2 nhóm: Sắp tới (tăng dần) và Đã qua (mới nhất trước),
// mỗi nhóm gom tiếp theo từng ngày.
export default function EventList({ t, lang, events, now, onEdit, onDelete, onAddOnDay }) {
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
        {groupByDay(list).map((day) => (
          <div className="day-group" key={day.key}>
            <h3 className="day-heading">
              {formatDayHeading(day.iso, lang)}
              <span className="day-count">{day.events.length}</span>
              <button
                type="button"
                className="day-add-btn"
                title={t.addOnDay}
                aria-label={t.addOnDay}
                onClick={() => onAddOnDay(day.iso)}
              >
                +
              </button>
            </h3>
            <motion.div className="event-cards" layout>
              <AnimatePresence mode="popLayout" initial={false}>
                {day.events.map((e) => (
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
          </div>
        ))}
      </section>
    )

  return (
    <div className="event-list">
      {renderGroup(t.upcoming, upcoming)}
      {renderGroup(t.past, past)}
    </div>
  )
}
