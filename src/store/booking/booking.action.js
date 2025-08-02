import { bookingService } from "../../services/booking.service.js"
import { store } from "../store"

export const SET_BOOKINGS = "SET_BOOKINGS"
export const ADD_BOOKING = "ADD_BOOKING"
export const REMOVE_BOOKING = "REMOVE_BOOKING"
export const UPDATE_BOOKING = "UPDATE_BOOKING"
export const SET_IS_LOADING = "SET_IS_LOADING"

export async function loadBookings() {
  try {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    const bookings = await bookingService.query()
    store.dispatch({ type: SET_BOOKINGS, bookings })
  } catch (err) {
    console.error("booking.actions: cannot load bookings", err)
  } finally {
    store.dispatch({ type: SET_IS_LOADING, isLoading: false })
  }
}

export async function addBooking(booking) {
  try {
    const savedBooking = await bookingService.save(booking)
    store.dispatch({ type: ADD_BOOKING, booking: savedBooking })
    return savedBooking
  } catch (err) {
    console.error("booking.actions: cannot add booking", err)
    throw err
  }
}

export async function removeBooking(bookingId) {
  try {
    await bookingService.remove(bookingId)
    store.dispatch({ type: REMOVE_BOOKING, bookingId })
  } catch (err) {
    console.error("booking.actions: cannot remove booking", err)
    throw err
  }
}

export async function updateBooking(booking) {
  try {
    const updatedBooking = await bookingService.save(booking)
    store.dispatch({ type: UPDATE_BOOKING, booking: updatedBooking })
    return updatedBooking
  } catch (err) {
    console.error("booking.actions: cannot update booking", err)
    throw err
  }
}

export async function loadUserBookings(userId) {
  try {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    const bookings = await bookingService.getUserBookings(userId)
    store.dispatch({ type: SET_BOOKINGS, bookings })
  } catch (err) {
    console.error("booking.actions: cannot load user bookings", err)
  } finally {
    store.dispatch({ type: SET_IS_LOADING, isLoading: false })
  }
}

export async function loadHostBookings(hostId) {
  try {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    const bookings = await bookingService.getHostBookings(hostId)
    store.dispatch({ type: SET_BOOKINGS, bookings })
  } catch (err) {
    console.error("booking.actions: cannot load host bookings", err)
  } finally {
    store.dispatch({ type: SET_IS_LOADING, isLoading: false })
  }
}
