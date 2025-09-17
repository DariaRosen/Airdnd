import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookingParams } from '../customHooks/useBookingParams'
import { BookingDatePicker } from './BookingDatePicker'
import { GuestSearch } from './GuestSearch'   // ✅ reuse component
import { bookingService } from '../services/booking.service'
import { homeService } from '../services/home.service'
import { utilService } from '../services/util.service'

export function BookingSearch({ home }) {
  const { checkIn, setCheckIn, checkOut, setCheckOut, guests, setGuests } =
    useBookingParams()
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const calendarRef = useRef()
  const navigate = useNavigate()

  const isDatesSelected = checkIn && checkOut

  // home.unavailableDates הוא מערך 'ddmmyy'
  const disabledDates = (home.unavailableDates || []).map((str) => {
    const day = str.slice(0, 2)
    const month = str.slice(2, 4)
    const year = '20' + str.slice(4, 6)
    return new Date(`${year}-${month}-${day}`)
  })

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setIsDatePickerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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
    console.log('Checking availability...', { checkIn, checkOut, guests })
  }

  async function onReserve() {
    const newDates = utilService.getDateRange(checkIn, checkOut)

    const booking = await bookingService.create({
      homeId: home._id,
      hostId: home.host_id || home.hostId || 'host-anon',
      guestId: 'guest-' + utilService.makeId(),
      checkIn,
      checkOut,
      pricePerNight: home.price,
      discount: 0,
      tax: 0,
      status: 'Pending',
    })

    const uniqueDates = [
      ...new Set([...(home.unavailableDates || []), ...newDates]),
    ]
    const updatedHome = { ...home, unavailableDates: uniqueDates }
    await homeService.save(updatedHome)

    return booking
  }

  async function handleReserve() {
    try {
      const booking = await onReserve()
      console.log('Booking created', booking?._id)
      navigate('/confirmation')
    } catch (err) {
      console.error('Booking failed', err)
      alert('Booking failed')
    }
  }

  return isDatesSelected ? (
    <section className="booking-form with-dates">
      <h3>
        {home.price}₪ <span style={{ fontSize: '16px' }}>night</span>
      </h3>

      <div className="booking-grid">
        {/* Dates */}
        <div className="dates-box" ref={calendarRef}>
          <BookingDatePicker
            checkIn={checkIn}
            checkOut={checkOut}
            setCheckIn={setCheckIn}
            setCheckOut={setCheckOut}
            disabledDates={disabledDates}
            isOpen={isDatePickerOpen}
            setIsOpen={setIsDatePickerOpen}
          />
        </div>

        {/* Guests */}
        <div className="guests-box">
          <label>GUESTS</label>
          <GuestSearch guests={guests} setGuests={setGuests} />
        </div>
      </div>

      <button onClick={handleReserve}>Reserve</button>
    </section>
  ) : (
    <section className="booking-form no-dates">
      <h3>Add dates for prices</h3>

      <div className="booking-grid">
        {/* Dates */}
        <div className="dates-box" ref={calendarRef}>
          <BookingDatePicker
            checkIn={checkIn}
            checkOut={checkOut}
            setCheckIn={setCheckIn}
            setCheckOut={setCheckOut}
            disabledDates={disabledDates}
            isOpen={isDatePickerOpen}
            setIsOpen={setIsDatePickerOpen}
          />
        </div>

        {/* Guests */}
        <div className="guests-box">
          <GuestSearch guests={guests} setGuests={setGuests} isDetails={true} />
        </div>
      </div>

      <button onClick={onCheckAvailability}>Check availability</button>
    </section>
  )
}
