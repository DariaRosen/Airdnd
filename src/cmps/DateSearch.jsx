import { DateRange } from "react-date-range"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import { useState, useEffect, useRef } from "react"
import { setFilterBy } from "../store/homes/homes.action.js"
import { DatePicker } from '@mantine/dates'

export function DateSearch({ dateRange, setDateRange }) {
  const [isDateOpen, setIsDateOpen] = useState(false)
  const dateRef = useRef()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dateRef.current && !dateRef.current.contains(e.target)) {
        setIsDateOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleDateChange = (ranges) => {
    setDateRange([ranges.selection])
  }
  const customDayRenderer = (date) => {
    return <div className="custom-day">{date.getDate()}</div>
  }

  const mantineValue = [dateRange[0].startDate, dateRange[0].endDate]
  const handleMantineChange = next => {
    const [start, end] = next || []
    setDateRange([{ startDate: start, endDate: end, key: 'selection' }])
  }

  return (
    <div className="search-group date-container" ref={dateRef}>
      <div className="search-item" onClick={() => setIsDateOpen(!isDateOpen)}>
        <div className="search-title">Check in</div>
        <div className="search-value">
          {dateRange[0].startDate
            ? dateRange[0].startDate.toLocaleDateString()
            : "Add dates"}
        </div>
      </div>

      <div className="separator inner">|</div>

      <div className="search-item" onClick={() => setIsDateOpen(!isDateOpen)}>
        <div className="search-title">Check out</div>
        <div className="search-value">
          {dateRange[0].endDate
            ? dateRange[0].endDate.toLocaleDateString()
            : "Add dates"}
        </div>
      </div>

      {isDateOpen && (
        <div className="date-dropdown">
          {/* <DateRange
            onChange={handleDateChange}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            showDateDisplay={false}
            showMonthAndYearPickers={false}
            editableDateInputs={true}
            months={2}
            direction="horizontal"
            minDate={new Date()}
            // rangeColors={["#ff385c"]}
            dayContentRenderer={customDayRenderer}
          /> */}


          <DatePicker
            type="range"
            value={mantineValue}
            onChange={handleMantineChange}
            minDate={new Date()}
            numberOfColumns={2}
          />
        </div>
      )}
    </div>
  )
}
