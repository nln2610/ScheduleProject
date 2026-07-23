import { useEffect, useRef, useState } from 'react'

// State đồng bộ với localStorage qua cặp hàm load/save truyền vào.
// load(): giá trị khởi tạo; save(value): ghi xuống storage.
export function usePersistentState(load, save) {
  const [state, setState] = useState(load)
  const saveRef = useRef(save)
  saveRef.current = save

  useEffect(() => {
    saveRef.current(state)
  }, [state])

  return [state, setState]
}
