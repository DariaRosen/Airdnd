import { storageService } from "./async-storage.service.js"
import { utilService } from "./util.service.js"
import bookingsData from "../data/bookings.json"

export const bookingService = {
  query,
  getById,
  save,
  remove,
  getEmptyBooking,
  getUserBookings,
  getHostBookings,
}

const STORAGE_KEY = "bookingCollection"
_createBookings()

window.bookingService = bookingService

async function query() {
  return await storageService.query(STORAGE_KEY)
}

function getById(bookingId) {
  return storageService.get(STORAGE_KEY, bookingId)
}

async function remove(bookingId) {
  return await storageService.remove(STORAGE_KEY, bookingId)
}

async function save(booking, checkIn, checkOut) {
  let savedBooking

  const newBooking = {
    _id: utilService.makeId(),
    homeId: booking._id,
    checkIn,
    checkOut,
    createdAt: Date.now()
  }
  savedBooking = await storageService.post(STORAGE_KEY, newBooking)
  return savedBooking
}

function getEmptyBooking() {
  return {
    homeId: "",
    hostId: "",
    guestId: "",
    checkIn: "",
    checkOut: "",
    pricePerNight: 0,
    nights: 0,
    discount: 0,
    totalPrice: 0,
    tax: 0,
    createdAt: Date.now(),
  }
}

async function getUserBookings(userId) {
  const bookings = await query()
  return bookings.filter(b => b.guestId === userId)
}

async function getHostBookings(hostId) {
  const bookings = await query()
  console.log("bookings", bookings);
  console.log("hostId", hostId);
  bookings.forEach(b => {
    console.log("host_id:", b.host_id);
  });


  const a = bookings.filter(b => b.host_id === hostId)
  console.log("filtered bookings", a);
  return a
}

// Helpers
function _createBookings() {
  let bookings = utilService.loadFromStorage(STORAGE_KEY)
  if (!bookings || !bookings.length) {
    bookings = bookingsData
    utilService.saveToStorage(STORAGE_KEY, bookings)
  }
}

function _getDatesInRange(start, end) {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const dates = []

  for (
    let d = new Date(startDate);
    d < endDate;
    d.setDate(d.getDate() + 1)
  ) {
    const day = d.getDate().toString().padStart(2, "0")
    const month = (d.getMonth() + 1).toString().padStart(2, "0")
    const year = d.getFullYear().toString().slice(2)
    dates.push(`${day}${month}${year}`) // e.g., "040925"
  }

  return dates
}

