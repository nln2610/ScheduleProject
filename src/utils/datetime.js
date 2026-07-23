// Tiện ích thời gian: format và tính đếm ngược.

// Chuyển Date -> chuỗi cho <input type="datetime-local"> (giờ địa phương).
export function toDatetimeLocalValue(date) {
  const d = new Date(date)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`
}

// Hiển thị ngày giờ thân thiện theo ngôn ngữ.
export function formatDateTime(iso, lang) {
  const d = new Date(iso)
  return d.toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Khóa nhóm theo ngày (giờ địa phương): "YYYY-MM-DD".
export function dayKey(iso) {
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// Tiêu đề ngày cho mỗi nhóm: "Thứ Hai, 04/08/2026".
export function formatDayHeading(iso, lang) {
  const d = new Date(iso)
  return d.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// Chỉ giờ trong ngày: "14:30".
export function formatTime(iso, lang) {
  const d = new Date(iso)
  return d.toLocaleTimeString(lang === 'vi' ? 'vi-VN' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Trả về phần chi tiết đếm ngược giữa now và target.
// diff > 0 => còn tới; diff < 0 => đã qua.
export function getCountdown(targetIso, now) {
  const target = new Date(targetIso).getTime()
  const diff = target - now
  const past = diff < 0
  let ms = Math.abs(diff)

  const dayMs = 86400000
  const hourMs = 3600000
  const minMs = 60000

  const days = Math.floor(ms / dayMs)
  ms -= days * dayMs
  const hours = Math.floor(ms / hourMs)
  ms -= hours * hourMs
  const minutes = Math.floor(ms / minMs)
  ms -= minutes * minMs
  const seconds = Math.floor(ms / 1000)

  return { past, diff, days, hours, minutes, seconds }
}

// Chuỗi đếm ngược gọn: "Còn 3 ngày 4 giờ" hoặc "5 phút trước".
export function formatCountdown(targetIso, now, t) {
  const c = getCountdown(targetIso, now)

  // Trong vòng 1 phút quanh mốc => đang diễn ra
  if (Math.abs(c.diff) < 60000) return t.now

  const parts = []
  if (c.days > 0) parts.push(`${c.days} ${t.days}`)
  if (c.hours > 0) parts.push(`${c.hours} ${t.hours}`)
  // Chỉ hiện phút khi dưới 1 ngày để chuỗi ngắn gọn
  if (c.days === 0 && c.minutes > 0) parts.push(`${c.minutes} ${t.minutes}`)
  // Nếu dưới 1 giờ, thêm giây cho cảm giác "sống"
  if (c.days === 0 && c.hours === 0) parts.push(`${c.seconds} ${t.seconds}`)

  const body = parts.join(' ')
  return c.past ? `${body} ${t.agoSuffix}` : `${t.remainingPrefix} ${body}`
}
