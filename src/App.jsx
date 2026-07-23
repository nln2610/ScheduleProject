import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import Toolbar from './components/Toolbar'
import EventForm from './components/EventForm'
import EventList from './components/EventList'
import StatsBar from './components/StatsBar'
import NextEventHero from './components/NextEventHero'
import { translations } from './i18n'
import { usePersistentState } from './hooks/useLocalStorage'
import { useNow } from './hooks/useNow'
import {
  loadEvents,
  saveEvents,
  loadSettings,
  saveSettings,
} from './utils/storage'
import { formatCountdown } from './utils/datetime'

export default function App() {
  const [events, setEvents] = usePersistentState(loadEvents, saveEvents)
  const [settings, setSettings] = usePersistentState(loadSettings, saveSettings)
  const { lang, theme } = settings
  const t = translations[lang]

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [prefill, setPrefill] = useState(null)

  const now = useNow(1000)

  // Áp theme lên thẻ <html> để CSS biến đổi.
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  // ---- CRUD ----
  function handleSave(data) {
    if (editing) {
      setEvents((prev) =>
        prev.map((e) => (e.id === editing.id ? { ...e, ...data } : e)),
      )
    } else {
      setEvents((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          ...data,
        },
      ])
    }
    closeForm()
  }

  function handleDelete(event) {
    if (window.confirm(t.confirmDelete)) {
      setEvents((prev) => prev.filter((e) => e.id !== event.id))
    }
  }

  function openAdd() {
    setEditing(null)
    setPrefill(null)
    setFormOpen(true)
  }

  // Thêm nhanh vào một ngày sẵn có: giữ nguyên ngày, giờ mặc định 09:00.
  function openAddOnDay(iso) {
    const d = new Date(iso)
    d.setHours(9, 0, 0, 0)
    setEditing(null)
    setPrefill({ datetime: d.toISOString() })
    setFormOpen(true)
  }

  function openEdit(event) {
    setEditing(event)
    setPrefill(null)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditing(null)
    setPrefill(null)
  }

  // ---- Lọc + tìm kiếm ----
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return events.filter((e) => {
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false
      if (!q) return true
      return (
        e.title.toLowerCase().includes(q) ||
        (e.note || '').toLowerCase().includes(q)
      )
    })
  }, [events, search, categoryFilter])

  // ---- Nhắc nhở trình duyệt ----
  const notifiedRef = useRef(new Set())
  const [notifPerm, setNotifPerm] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied',
  )

  useEffect(() => {
    if (typeof Notification === 'undefined') return
    const timer = setInterval(() => {
      const nowMs = Date.now()
      events.forEach((e) => {
        if (!e.remindBefore) return
        const target = new Date(e.datetime).getTime()
        const remindAt = target - e.remindBefore * 60000
        // Trong cửa sổ [remindAt, target): tới lúc nhắc và chưa qua sự kiện
        if (nowMs >= remindAt && nowMs < target && !notifiedRef.current.has(e.id)) {
          notifiedRef.current.add(e.id)
          const when = formatCountdown(e.datetime, nowMs, t)
          if (Notification.permission === 'granted') {
            new Notification(t.reminderTitle, {
              body: t.reminderBody(e.title, when),
            })
          }
        }
      })
    }, 20000)
    return () => clearInterval(timer)
  }, [events, t])

  async function enableNotifications() {
    if (typeof Notification === 'undefined') return
    const perm = await Notification.requestPermission()
    setNotifPerm(perm)
  }

  const hasReminders = events.some((e) => e.remindBefore > 0)

  // ---- Thống kê + sự kiện sắp tới gần nhất ----
  const { upcomingCount, pastCount, nextEvent } = useMemo(() => {
    let up = 0
    let past = 0
    let next = null
    events.forEach((e) => {
      if (new Date(e.datetime).getTime() >= now) {
        up += 1
        if (!next || new Date(e.datetime) < new Date(next.datetime)) next = e
      } else {
        past += 1
      }
    })
    return { upcomingCount: up, pastCount: past, nextEvent: next }
  }, [events, now])

  return (
    <div className="app">
      <div className="container">
        <Header
          t={t}
          lang={lang}
          onToggleLang={() =>
            setSettings((s) => ({ ...s, lang: s.lang === 'vi' ? 'en' : 'vi' }))
          }
          theme={theme}
          onToggleTheme={() =>
            setSettings((s) => ({
              ...s,
              theme: s.theme === 'light' ? 'dark' : 'light',
            }))
          }
        />

        {hasReminders && notifPerm === 'default' && (
          <button className="notif-banner" onClick={enableNotifications}>
            🔔 {t.enableNotif}
          </button>
        )}
        {hasReminders && notifPerm === 'denied' && (
          <div className="notif-banner notif-banner-muted">{t.notifBlocked}</div>
        )}

        {events.length > 0 && (
          <StatsBar
            t={t}
            total={events.length}
            upcoming={upcomingCount}
            past={pastCount}
          />
        )}

        {nextEvent && (
          <NextEventHero t={t} lang={lang} event={nextEvent} now={now} />
        )}

        <Toolbar
          t={t}
          search={search}
          onSearchChange={setSearch}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          onAdd={openAdd}
        />

        {events.length === 0 ? (
          <div className="empty-state">{t.noEvents}</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">{t.noResults}</div>
        ) : (
          <EventList
            t={t}
            lang={lang}
            events={filtered}
            now={now}
            onEdit={openEdit}
            onDelete={handleDelete}
            onAddOnDay={openAddOnDay}
          />
        )}
      </div>

      <AnimatePresence>
        {formOpen && (
          <EventForm
            t={t}
            initial={editing}
            prefill={prefill}
            onSave={handleSave}
            onClose={closeForm}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
