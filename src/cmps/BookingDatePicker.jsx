import { useState, useEffect, useRef } from 'react'
import { DatePicker } from '@mantine/dates'

export function BookingDatePicker({
  checkIn,
  checkOut,
  setCheckIn,
  setCheckOut,
  disabledDates,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dateRef = useRef()

  useEffect(() => {
    const handleClickOutside = e => {
      if (dateRef.current && !dateRef.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const value = [
    checkIn ? new Date(checkIn) : null,
    checkOut ? new Date(checkOut) : null,
  ]

  const toISO = d => d ? new Date(d).toISOString().slice(0, 10) : ''

  const toDate = x => {
    if (x instanceof Date) return x
    if (typeof x === 'number' || typeof x === 'string') {
      const d = new Date(x)
      return isNaN(d.getTime()) ? null : d
    }
    return null
  }

  const sameDay = (a, b) => {
    const da = toDate(a)
    const db = toDate(b)
    if (!da || !db) return false
    return da.getFullYear() === db.getFullYear() &&
      da.getMonth() === db.getMonth() &&
      da.getDate() === db.getDate()
  }

  const excludeDate = date => {
    if (!disabledDates?.length) return false
    return disabledDates.some(d => sameDay(date, d))
  }

  const onChange = next => {
    const [start, end] = next || []
    setCheckIn(toISO(start))
    setCheckOut(toISO(end))
    if (start && end) setIsOpen(false)
  }

  return (
    <div className="search-group date-container" ref={dateRef}>
      <div className="search-item" onClick={() => setIsOpen(!isOpen)}>
        <div className="search-title">Check in</div>
        <div className="search-value">
          {checkIn ? new Date(checkIn).toLocaleDateString() : 'Add date'}
        </div>
      </div>

      <div className="separator inner">|</div>

      <div className="search-item" onClick={() => setIsOpen(!isOpen)}>
        <div className="search-title">Check out</div>
        <div className="search-value">
          {checkOut ? new Date(checkOut).toLocaleDateString() : 'Add date'}
        </div>
      </div>

      {isOpen && (
        <div className="date-dropdown-booking">
          <DatePicker
            type="range"
            value={value}
            onChange={onChange}
            numberOfColumns={2}
            minDate={new Date()}
            excludeDate={excludeDate}
            classNames={{
              day: 'dp-day',
              calendarHeader: 'dp-header',
              calendarHeaderLevel: 'dp-title',
              calendarHeaderControl: 'dp-nav',
            }}
          />

        </div>
      )}
    </div>
  )
}
