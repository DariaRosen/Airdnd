import { useState, useEffect, useRef } from "react"
import { DatePicker } from "@mantine/dates"

export function DateSearch({ dateRange, setDateRange }) {
  const [isDateOpen, setIsDateOpen] = useState(false)
  const dateRef = useRef()

  useEffect(() => {
    const onDocClick = e => {
      if (dateRef.current && !dateRef.current.contains(e.target)) setIsDateOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  // ממיר כל דבר ל-Date תקין או null
  const toDate = v => {
    if (!v) return null
    if (v instanceof Date) return isNaN(v.getTime()) ? null : v
    if (typeof v?.toDate === "function") {
      const d = v.toDate()
      return isNaN(d?.getTime?.()) ? null : d
    }
    const d = new Date(v)
    return isNaN(d.getTime()) ? null : d
  }

  const fmt = v => {
    const d = toDate(v)
    return d ? d.toLocaleDateString() : "Add dates"
  }

  const current = dateRange?.[0] || { startDate: null, endDate: null, key: "selection" }
  const mantineValue = [toDate(current.startDate), toDate(current.endDate)]

  const handleMantineChange = next => {
    const [start, end] = next || []
    setDateRange([{ startDate: toDate(start), endDate: toDate(end), key: "selection" }])
  }

  const toKey = d => d ? `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` : null
  const isSameDay = (a, b) => {
    const da = toDate(a)
    const db = toDate(b)
    return !!da && !!db && toKey(da) === toKey(db)
  }
  const isInRange = (d, start, end) => {
    const td = toDate(d)
    const s = toDate(start)
    const e = toDate(end)
    if (!td || !s || !e) return false
    const t = new Date(td); t.setHours(0, 0, 0, 0)
    const ss = new Date(s); ss.setHours(0, 0, 0, 0)
    const ee = new Date(e); ee.setHours(0, 0, 0, 0)
    return t >= ss && t <= ee
  }

  const start = mantineValue[0]
  const end = mantineValue[1]

  const renderDay = date => {
    const d = toDate(date) // ← המרה קשיחה ל-Date

    const startFlag = isSameDay(d, start)
    const endFlag = isSameDay(d, end)
    const inRangeFlag = isInRange(d, start, end)

    const cls = [
      "day-cell",
      inRangeFlag ? "in-range" : "",
      startFlag ? "range-start" : "",
      endFlag ? "range-end" : ""
    ].join(" ").trim()

    return (
      <div className={cls}>
        <span className="day-number">{d ? d.getDate() : ""}</span>
      </div>
    )
  }

  return (
    <div className="search-group date-container" ref={dateRef}>
      <div className="search-item" onClick={() => setIsDateOpen(!isDateOpen)}>
        <div className="search-title">Check in</div>
        <div className="search-value">{fmt(current.startDate)}</div>
      </div>

      <div className="separator inner">|</div>

      <div className="search-item" onClick={() => setIsDateOpen(!isDateOpen)}>
        <div className="search-title">Check out</div>
        <div className="search-value">{fmt(current.endDate)}</div>
      </div>

      {isDateOpen && (
        <div className="date-dropdown">
          <DatePicker
            type="range"
            value={mantineValue}
            onChange={handleMantineChange}
            minDate={new Date()}
            numberOfColumns={2}
            allowSingleDateInRange
            renderDay={renderDay}
            size="lg"
            firstDayOfWeek={0}
            classNames={{ day: 'no-square-day', calendarHeader: 'dp-header', calendarHeaderLevel: 'dp-title', calendarHeaderControl: 'dp-nav' }}
          />
        </div>
      )}
    </div>
  )
}
