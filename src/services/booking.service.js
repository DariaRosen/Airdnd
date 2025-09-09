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
  updateBookingStatus,
  groupByMonth,
  calculateMonthlyStats,
  calculateTrends
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
  bookings.forEach(b => {
  });


  const a = bookings.filter(b => b.host_id === hostId)
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

async function updateBookingStatus(bookingId, newStatus) {
  try {
    const bookings = await query()
    const idx = bookings.findIndex(b => b._id === bookingId)
    if (idx === -1) throw new Error("Booking not found")

    bookings[idx].status = newStatus
    utilService.saveToStorage(STORAGE_KEY, bookings)
    return bookings[idx] // return the updated booking
  } catch (err) {
    console.error("bookingService.updateBookingStatus error:", err)
    throw err
  }
}

function groupByMonth(bookings) {
  return bookings.reduce((acc, b) => {
    const d = new Date(b.checkIn)
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`
    if (!acc[key]) acc[key] = []
    acc[key].push(b)
    return acc
  }, {})
}

function calculateMonthlyStats(bookings) {
  const months = groupByMonth(bookings)

  const statsByMonth = {}
  for (const [month, monthBookings] of Object.entries(months)) {
    const income = monthBookings
      .filter(b => b.status.toLowerCase() === "paid")
      .reduce((sum, b) => sum + b.totalPrice, 0)

    const totalBookings = monthBookings.length
    const canceled = monthBookings.filter(
      b => b.status.toLowerCase().includes("canceled")
    ).length

    statsByMonth[month] = { income, totalBookings, canceled }
  }
  return statsByMonth
}

function calculateTrends(bookings) {
  const statsByMonth = calculateMonthlyStats(bookings)
  const months = Object.keys(statsByMonth).sort()

  if (months.length === 0) return { income: 0, totalBookings: 0, cancellationRate: 0, incomeChange: 0, totalBookingsChange: 0, cancellationChange: 0 }

  const currentMonth = months[months.length - 1]
  const pastMonths = months.slice(0, -1)

  const current = statsByMonth[currentMonth]
  const pastAverages = pastMonths.length
    ? {
      income: pastMonths.reduce((sum, m) => sum + statsByMonth[m].income, 0) / pastMonths.length,
      totalBookings: pastMonths.reduce((sum, m) => sum + statsByMonth[m].totalBookings, 0) / pastMonths.length,
      canceled: pastMonths.reduce((sum, m) => sum + statsByMonth[m].canceled, 0) / pastMonths.length,
    }
    : { income: 0, totalBookings: 0, canceled: 0 }

  const cancellationRate = current.totalBookings
    ? (current.canceled / current.totalBookings) * 100
    : 0

  const avgCancellationRate = pastAverages.totalBookings
    ? (pastAverages.canceled / pastAverages.totalBookings) * 100
    : 0

  return {
    income: current.income,
    totalBookings: current.totalBookings,
    cancellationRate,  // number
    incomeChange: pastAverages.income
      ? ((current.income - pastAverages.income) / pastAverages.income) * 100
      : 0,
    totalBookingsChange: pastAverages.totalBookings
      ? ((current.totalBookings - pastAverages.totalBookings) / pastAverages.totalBookings) * 100
      : 0,
    cancellationChange: avgCancellationRate
      ? ((cancellationRate - avgCancellationRate) / avgCancellationRate) * 100
      : 0,
  }
}