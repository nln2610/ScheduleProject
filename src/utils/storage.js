// Đọc/ghi localStorage an toàn, có versioning đơn giản.
const EVENTS_KEY = 'schedule_events_v1'
const SETTINGS_KEY = 'schedule_settings_v1'

export function loadEvents() {
  try {
    const raw = localStorage.getItem(EVENTS_KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export function saveEvents(events) {
  try {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
  } catch {
    // Bỏ qua lỗi (VD: hết dung lượng, chế độ riêng tư)
  }
}

const DEFAULT_SETTINGS = { lang: 'vi', theme: 'light' }

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {
    // Bỏ qua
  }
}
