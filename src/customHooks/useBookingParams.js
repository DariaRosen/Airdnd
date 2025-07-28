import { useSearchParams } from "react-router-dom"
import { useState, useEffect } from "react"

export function useBookingParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || "")
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || "")
  const [guests, setGuests] = useState(+searchParams.get("guests") || 2)

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams)

    checkIn ? newParams.set("checkIn", checkIn) : newParams.delete("checkIn")
    checkOut
      ? newParams.set("checkOut", checkOut)
      : newParams.delete("checkOut")
    newParams.set("guests", guests)

    setSearchParams(newParams)
  }, [checkIn, checkOut, guests])
  useEffect(() => {
    const inParam = searchParams.get("checkIn")
    const outParam = searchParams.get("checkOut")
    const guestsParam = searchParams.get("guests")

    if (inParam !== checkIn) setCheckIn(inParam || "")
    if (outParam !== checkOut) setCheckOut(outParam || "")
    if (+guestsParam !== guests) setGuests(+guestsParam || 2)
  }, [searchParams])

  return {
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    guests,
    setGuests,
  }
}
