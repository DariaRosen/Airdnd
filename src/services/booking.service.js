import { httpService } from './http.service'

export const bookingService = {
  create,
  updateStatus,
  getById,
  query,
  getUserBookings,
  getHostBookings
}

const normalize = b => b && {
  _id: b._id,
  homeId: b.home_id,
  guestId: b.guest_id,
  hostId: b.host_id,
  checkIn: b.checkIn,
  checkOut: b.checkOut,
  pricePerNight: b.pricePerNight,
  discount: b.discount,
  tax: b.tax,
  totalPrice: b.totalPrice,
  status: b.status,
  createdAt: typeof b.createdAt === 'number'
    ? b.createdAt
    : b._id?.getTimestamp?.()?.getTime?.() || Date.now()
}

const denormalize = b => ({
  home_id: b.homeId,
  guest_id: b.guestId,
  host_id: b.hostId,
  checkIn: b.checkIn,
  checkOut: b.checkOut,
  pricePerNight: b.pricePerNight,
  discount: b.discount,
  tax: b.tax,
  totalPrice: b.totalPrice,
  status: b.status
})

async function create(b) {
  console.log(b)
  const created = await httpService.post('booking', denormalize(b))
  return normalize(created)
}

async function updateStatus(bookingId, status) {
  const updated = await httpService.put(`booking/${bookingId}`, { status })
  return normalize(updated)
}

async function getById(id) {
  const data = await httpService.get(`booking/${id}`)
  return normalize(data)
}

async function query(filterBy = {}) {
  const data = await httpService.get('booking', filterBy)
  return {
    ...data,
    items: Array.isArray(data?.items) ? data.items.map(normalize) : []
  }
}
async function getUserBookings(userId) {
  return httpService.get('booking', { guest_id: userId })
}
async function getHostBookings(hostId) {
  return httpService.get('booking', { host_id: hostId })
}