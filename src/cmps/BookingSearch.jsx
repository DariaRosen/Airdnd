import { useSearchParams } from "react-router-dom"
import { useState, useEffect, useMemo } from "react"
import { useBookingParams } from "../customHooks/useBookingParams"

export function BookingSearch() {
  const { checkIn, setCheckIn, checkOut, setCheckOut, guests, setGuests } =
    useBookingParams()
  const isDatesSelected = checkIn && checkOut

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

  return isDatesSelected ? (
    <section className="booking-form"></section>
  ) : (
    <section className="booking-form">
      <h3>Add dates for prices</h3>
      <div className="input-row">
        <div className="input-box">
          <label>CHECK-IN</label>
          <input
            name="check-in"
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
        <div className="input-box">
          <label>CHECKOUT</label>
          <input
            name="check-out"
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
      </div>

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
