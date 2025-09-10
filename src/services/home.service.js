import { storageService } from "./async-storage.service"
import { utilService } from "./util.service"
import homesData from "../data/homes.json"
import reviews from "../data/reviews.json"

export const homeService = {
  query,
  getById,
  save,
  remove,
  getEmptyHome,
  getFormattedDateRange,
  getFilterFromSearchParams,
  getHomesByHost,
  getHomeRating,
}
window.hs = homeService

const STORAGE_KEY = "homesCollection"
_createHomes()

async function query(filterBy = { txt: "", maxPrice: 0 }) {
  var homes = await storageService.query(STORAGE_KEY)
  const { txt, maxPrice, capacity, sortField, sortDir } = filterBy

  if (txt) {
    const regex = new RegExp(txt, "i")
    homes = homes.filter(
      (home) => regex.test(home.title) || regex.test(home.description)
    )
  }
  if (maxPrice) {
    homes = homes.filter((home) => home.price <= maxPrice)
  }
  if (capacity) {
    homes = homes.filter((home) => home.capacity >= capacity)
  }

  if (sortField) {
    homes.sort((a, b) => {
      const valA = a[sortField]
      const valB = b[sortField]
      return (
        (typeof valA === "string" ? valA.localeCompare(valB) : valA - valB) *
        +sortDir
      )
    })
  }

  return homes

  // return homes.map(({ _id, title, price, capacity, location }) => ({
  //   _id,
  //   title,
  //   price,
  //   capacity,
  //   location,
  // }))
}

function getById(homeId) {
  return storageService.get(STORAGE_KEY, homeId)
}

async function remove(homeId) {
  await storageService.remove(STORAGE_KEY, homeId)
}

async function save(home) {
  var savedHome
  if (home._id) {
    savedHome = await storageService.put(STORAGE_KEY, home)
  } else {
    const homeToSave = {
      ...home,
      _id: utilService.makeId(),
      //host: userService.getLoggedinUser(),
      unavailableDates: [],
    }
    savedHome = await storageService.post(STORAGE_KEY, homeToSave)
  }
  return savedHome
}
function getDefaultFilter() {
  return {
    location: {
      country: "",
      city: "",
      address: "",
      lat: 0,
      lng: 0,
    },
    checkIn: "",
    checkOut: "",
    capacity: 0,
  }
}
function getFilterFromSearchParams(searchParams) {
  const defaultFilter = getDefaultFilter()
  const filterBy = {}
  for (const field in defaultFilter) {
    filterBy[field] = searchParams.get(field) || ""
  }
  return filterBy
}

function getEmptyHome() {
  return {
    title: "",
    description: "",
    price: utilService.getRandomIntInclusive(100, 1000),
    capacity: utilService.getRandomIntInclusive(1, 10),
    rooms: utilService.getRandomIntInclusive(1, 5),
    beds: utilService.getRandomIntInclusive(1, 5),
    bathrooms: utilService.getRandomIntInclusive(1, 5),
    type: "apartment",
    imgUrls: [],
    rating: 0,
    numberOfRaters: 0,
    guestFavorite: false,
    location: {
      country: "",
      city: "",
      address: "",
      lat: 0,
      lng: 0,
    },
    amenities: [],
    //host: userService.getLoggedinUser(),
    //msgs: [], maybe if we want will add this with reviews
    unavailableDates: [],
    createdAt: Date.now(),
  }
}

export function getFormattedDateRange(offsetDays = 2) {
  const today = new Date()
  const futureDate = new Date()
  futureDate.setDate(today.getDate() + offsetDays)

  const optionsMonth = { month: "short" }
  const optionsDay = { day: "numeric" }

  const month = today.toLocaleDateString("en-US", optionsMonth)
  const startDay = today.toLocaleDateString("en-US", optionsDay)
  const endDay = futureDate.toLocaleDateString("en-US", optionsDay)

  return `${month} ${startDay}–${endDay}`
}

async function _createHomes() {
  let homes = utilService.loadFromStorage(STORAGE_KEY)

  if (!homes || !homes.length) {
    homes = homesData
    // homes = await utilService.updateHomeImageUrlsFromCloudinary(homes);
    utilService.saveToStorage(STORAGE_KEY, homes)
  }
}

async function getHomesByHost(hostId) {
  const homes = await query()
  return homes.filter(home => home.host_id === hostId)
}

async function getHomeRating(homeId) {
  const home = await getById(homeId) // or from homes array
  if (!home) return 0
  return home.rating || 0
}
