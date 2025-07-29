import { DateRange } from "react-date-range"
import { useState, useEffect, useRef } from "react"

export function BookingDatePicker({ checkIn, checkOut, setCheckIn, setCheckOut, disabledDates }) {
  const [isOpen, setIsOpen] = useState(false)
  const dateRef = useRef()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dateRef.current && !dateRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleChange = (ranges) => {
    const range = ranges.selection
    setCheckIn(range.startDate.toISOString())
    setCheckOut(range.endDate.toISOString())
  }

  return (
    <div className="search-group date-container" ref={dateRef}>
      <div className="search-item" onClick={() => setIsOpen(!isOpen)}>
        <div className="search-title">Check in</div>
        <div className="search-value">
          {checkIn ? new Date(checkIn).toLocaleDateString() : "Add date"}
        </div>
      </div>
      <div className="separator inner">|</div>
      <div className="search-item" onClick={() => setIsOpen(!isOpen)}>
        <div className="search-title">Check out</div>
        <div className="search-value">
          {checkOut ? new Date(checkOut).toLocaleDateString() : "Add date"}
        </div>
      </div>

      {isOpen && (
        <div className="date-dropdown">
          <DateRange
            onChange={handleChange}
            ranges={[{
              startDate: checkIn ? new Date(checkIn) : new Date(),
              endDate: checkOut ? new Date(checkOut) : new Date(),
              key: 'selection'
            }]}
            minDate={new Date()}
            disabledDates={disabledDates}
            moveRangeOnFirstSelection={false}
            months={2}
            direction="horizontal"
          />
        </div>
      )}
    </div>
  )
}
