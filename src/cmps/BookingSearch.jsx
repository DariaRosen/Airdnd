import { useSearchParams, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { useBookingParams } from "../customHooks/useBookingParams"
import { homeService } from "../services/home.service"
import { DateRange } from "react-date-range"
import { BookingDatePicker } from "./BookingDatePicker"
import { bookingService } from "../services/booking.service"
import { utilService } from "../services/util.service"

export function BookingSearch({ home }) {
  const { checkIn, setCheckIn, checkOut, setCheckOut, guests, setGuests } =
    useBookingParams()
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const calendarRef = useRef()
  const navigate = useNavigate()

  const isDatesSelected = checkIn && checkOut
  const disabledDates = home.unavailableDates.map((str) => {
    const day = str.slice(0, 2)
    const month = str.slice(2, 4)
    const year = "20" + str.slice(4, 6)
    return new Date(`${year}-${month}-${day}`)
  })
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsDatePickerOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  function onCheckAvailability() {
    if (!checkIn) {
      document.querySelector('input[name="check-in"]')?.focus()
      return
    }

    if (!checkOut) {
      document.querySelector('input[name="check-out"]')?.focus()
      return
    }

    console.log("Checking availability...", { checkIn, checkOut, guests })
  }


  async function onReserve() {
    const newDates = utilService.getDateRange(checkIn, checkOut)

    home.unavailableDates = [
      ...new Set([...home.unavailableDates, ...newDates]),
    ]
    try {
      await homeService.save(home)
      console.log("Home updated successfully")
    } catch (err) {
      console.error("Failed to update home:", err)
    }
    try {
      await bookingService.save(home, checkIn, checkOut)
      console.log("New home added to booking collection")
    } catch (err) {
      console.error("Failed to add to booking collection home:", err)
    }
  }
  async function handleReserve() {
    try {
      await onReserve()           
      navigate('/confirmation')   
    } catch (err) {
      console.error('Booking failed', err)
    }
  }

  return isDatesSelected ? (
    <section className="booking-form">
      <h3>
        {home.price}₪ <span style={{ fontSize: "16px" }}>night</span>
      </h3>
      <BookingDatePicker
        checkIn={checkIn}
        checkOut={checkOut}
        setCheckIn={setCheckIn}
        setCheckOut={setCheckOut}
        disabledDates={disabledDates}
      />

      <div className="input-box guests">
        <label>GUESTS</label>
        <select value={guests} onChange={(e) => setGuests(+e.target.value)}>
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} guest{i > 0 && "s"}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleReserve}>Reserve</button>
    </section>
  ) : (
    <section className="booking-form">
      <h3>Add dates for prices</h3>

      <BookingDatePicker
        checkIn={checkIn}
        checkOut={checkOut}
        setCheckIn={setCheckIn}
        setCheckOut={setCheckOut}
        disabledDates={disabledDates}
      />

      <div className="input-box guests">
        <label>GUESTS</label>
        <select value={guests} onChange={(e) => setGuests(+e.target.value)}>
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} guest{i > 0 && "s"}
            </option>
          ))}
        </select>
      </div>

      <button onClick={onCheckAvailability}>Check availability</button>
    </section>
  )
}
