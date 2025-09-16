import { useState, useEffect, useRef } from "react"
import { DatePicker } from "@mantine/dates"

export function DateSearch({ type, dateRange, setDateRange }) {
  const [isDateOpen, setIsDateOpen] = useState(false)
  const dateRef = useRef()

  useEffect(() => {
    const onDocClick = e => {
      if (dateRef.current && !dateRef.current.contains(e.target)) {
        setIsDateOpen(false)
      }
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

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
    return d ? d.toLocaleDateString() : "Add date"
  }

  const current = dateRange?.[0] || { startDate: null, endDate: null, key: "selection" }
  const mantineValue = [toDate(current.startDate), toDate(current.endDate)]

  const handleMantineChange = next => {
    const [start, end] = next || []
    setDateRange([{ startDate: toDate(start), endDate: toDate(end), key: "selection" }])
  }

  return (
    <div className={`search-group date-container ${type === "checkIn" ? "check-in" : "check-out"}`} ref={dateRef}>
      <div className="search-item" onClick={() => setIsDateOpen(!isDateOpen)}>
        <div className="search-title">{type === "checkIn" ? "Check in" : "Check out"}</div>
        <div className="search-value">{type === "checkIn" ? fmt(current.startDate) : fmt(current.endDate)}</div>
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
            size="lg"
            firstDayOfWeek={0}
            classNames={{
              day: 'no-square-day',
              calendarHeader: 'dp-header',
              calendarHeaderLevel: 'dp-title',
              calendarHeaderControl: 'dp-nav'
            }}
          />
        </div>
      )}
    </div>
  )
}
