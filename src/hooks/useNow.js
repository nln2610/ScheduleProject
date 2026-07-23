import { useEffect, useState } from 'react'

// Trả về timestamp hiện tại, cập nhật mỗi `interval` ms (mặc định 1s).
// Dùng cho đếm ngược trực tiếp.
export function useNow(interval = 1000) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), interval)
    return () => clearInterval(id)
  }, [interval])

  return now
}
