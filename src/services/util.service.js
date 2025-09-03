export const utilService = {
  makeId,
  makeLorem,
  getRandomIntInclusive,
  debounce,
  saveToStorage,
  loadFromStorage,
  getRandomRating,
  getExistingProperties,
  getRandomGuestFavorite,
  getRandomBookedDates,
  updateHomeImageUrlsFromCloudinary,
  getLocationSuggestions,
  updateImageUrlsFromAssets,
  getNextMonthDates,
  doesHomeMatchLocation,
  doesHomeMatchDates,
  getSuggestedDestinations,
  getImageSrcForTitle,
  getDateRange,
}

function makeId(length = 6) {
  var txt = ""
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return txt
}

function makeLorem(size = 100) {
  var words = [
    "The sky",
    "above",
    "the port",
    "was",
    "the color of television",
    "tuned",
    "to",
    "a dead channel",
    ".",
    "All",
    "this happened",
    "more or less",
    ".",
    "I",
    "had",
    "the story",
    "bit by bit",
    "from various people",
    "and",
    "as generally",
    "happens",
    "in such cases",
    "each time",
    "it",
    "was",
    "a different story",
    ".",
    "It",
    "was",
    "a pleasure",
    "to",
    "burn",
  ]
  var txt = ""
  while (size > 0) {
    size--
    txt += words[Math.floor(Math.random() * words.length)] + " "
  }
  return txt
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}

function getRandomGuestFavorite() {
  return Math.random() < 0.4 // 40% chance to return true
}

function getRandomRating() {
  const rand = Math.random()
  if (rand < 0.05) return +(Math.random() * 3.5).toFixed(2) // 0 - 3.5
  if (rand < 0.2) return +(3.5 + Math.random() * 1).toFixed(2) // 3.5 - 4.5
  return +(4.5 + Math.random() * 0.5).toFixed(2) // 4.5 - 5
}

function randomPastTime() {
  const HOUR = 1000 * 60 * 60
  const DAY = 1000 * 60 * 60 * 24
  const WEEK = 1000 * 60 * 60 * 24 * 7

  const pastTime = getRandomIntInclusive(HOUR, WEEK)
  return Date.now() - pastTime
}

export function debounce(func, timeout = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : undefined
}
export function getExistingProperties(obj) {
  const truthyObj = {}
  for (const key in obj) {
    const val = obj[key]
    if (val || typeof val === "boolean") {
      truthyObj[key] = val
    }
  }
  return truthyObj
}

function getRandomBookedDates(count = 10) {
  const dates = new Set()

  while (dates.size < count) {
    const futureDate = new Date()
    // Generate a random day within the next 90 days
    const offset = Math.floor(Math.random() * 90)
    futureDate.setDate(futureDate.getDate() + offset)

    // Format as ddmmyy
    const dd = String(futureDate.getDate()).padStart(2, '0')
    const mm = String(futureDate.getMonth() + 1).padStart(2, '0')
    const yy = String(futureDate.getFullYear()).slice(-2)
    dates.add(`${dd}${mm}${yy}`)
  }

  return Array.from(dates)
}



export async function updateHomeImageUrlsFromCloudinary(homes) {
  const CLOUD_NAME = 'dool6mmp1';
  const API_KEY = '695486548144386';
  const API_SECRET = 'YGihIO3KaB2-7nMfmLnIEPMsMZ8'; // Optional: only if using server-side
  // const CLOUDINARY_API_BASE = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image`;
  const updatedHomes = []

  for (const home of homes) {
    const folderPath = `cc14cbf40c8979ad76c1798fe01db6781f/${home.title}`

    const searchQuery = {
      expression: `folder="${folderPath}"`,
    }

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/search`, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa(`${API_KEY}:${API_SECRET}`),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchQuery),
    })

    if (!res.ok) {
      console.error(`Cloudinary fetch failed for ${home.title}`)
      updatedHomes.push(home)
      continue
    }

    const data = await res.json()
    if (data.resources && data.resources.length > 0) {
      home.imgUrls = data.resources.map(r => r.secure_url)
    }

    updatedHomes.push(home)
  }

  return updatedHomes
}


async function getLocationSuggestions(term) {
  const locations = [
    'Paris', 'London', 'Lisbon', 'Tel Aviv', 'Tokyo',
    'New York', 'Los Angeles', 'Berlin', 'Madrid',
    'Rome', 'France', 'Germany', 'Israel', 'Spain',
    'Portugal', 'Italy', 'USA'
  ]

  if (!term) return []
  const lowerTerm = term.toLowerCase()
  return locations.filter(loc => loc.toLowerCase().startsWith(lowerTerm))
}

export function getSuggestedDestinations() {
  return [
    {
      title: "Nearby",
      subtitle: "Find what's around you"
    },
    {
      title: "Tel Aviv-Yafo, Israel",
      subtitle: "Because your wishlist has stays in Tel Aviv-Yafo"
    },
    {
      title: "Rome, Italy",
      subtitle: "For sights like Trevi Fountain"
    },
    {
      title: "Madrid, Spain",
      subtitle: "For its bustling nightlife"
    },
    {
      title: "Modi'in-Maccabim-Re'ut, Israel",
      subtitle: "Near you"
    },
    {
      title: "Athens, Greece",
      subtitle: "For its stunning architecture"
    },
    {
      title: "Pardes Hanna-Karkur, Israel",
      subtitle: "For a trip abroad"
    },
    {
      title: "Barcelona, Spain",
      subtitle: "Popular beach destination"
    },
    {
      title: "Zichron Yaakov, Israel",
      subtitle: "Near you"
    },
    {
      title: "Paphos, Cyprus",
      subtitle: "For sights like Aphrodite's Rock"
    },
    {
      title: "Lisbon, Portugal",
      subtitle: "For its top-notch dining"
    },
    {
      title: "Larnaca, Cyprus",
      subtitle: "For a trip abroad"
    },
    {
      title: "Prague, Czechia",
      subtitle: "For sights like Prague Castle"
    },
    {
      title: "Paris, France",
      subtitle: "For its bustling nightlife"
    },
    {
      title: "Limassol, Cyprus",
      subtitle: "For its seaside allure"
    },
    {
      title: "Melbourne, Australia",
      subtitle: "For sights like Eureka Tower"
    },
    {
      title: "Budapest, Hungary",
      subtitle: "For a trip abroad"
    },
    {
      title: "London, United Kingdom",
      subtitle: "For sights like Buckingham Palace"
    }
  ]
}


function updateImageUrlsFromAssets(homes, cloudinaryAssets) {
  const assets = cloudinaryAssets.resources
  console.log('homes', homes)
  console.log('!Array.isArray(homes)', !Array.isArray(homes))
  console.log('!Array.isArray(cloudinaryAssets)', !Array.isArray(cloudinaryAssets))
  if (!Array.isArray(homes) || !Array.isArray(assets)) return homes

  return homes.map(home => {
    const matchingAssets = assets.filter(asset => {
      return (
        asset.asset_folder &&
        asset.secure_url &&
        asset.asset_folder.toLowerCase().includes(home.title.toLowerCase())
      )
    })

    const secureUrls = matchingAssets.map(asset => asset.secure_url)

    return {
      ...home,
      imgUrls: secureUrls.length ? secureUrls : home.imgUrls // fallback if no match
    }
  })
}

function getNextMonthDates({ fromDay = 32, toDay = 32 } = {}) {
  const today = new Date()
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)

  const checkIn = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), fromDay)
  const checkOut = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), toDay)

  return {
    checkIn: checkIn.toISOString().split('T')[0],
    checkOut: checkOut.toISOString().split('T')[0],
  }
}

function doesHomeMatchLocation(home, locationFilter) {
  if (!locationFilter || !home?.location) return true
  const { city, country, address } = home.location
  const lowerFilter = locationFilter.toLowerCase()

  return (
    (city && city.toLowerCase().includes(lowerFilter)) ||
    (country && country.toLowerCase().includes(lowerFilter)) ||
    (address && address.toLowerCase().includes(lowerFilter))
  )
}

function doesHomeMatchDates(home, checkIn, checkOut) {
  if (!checkIn || !checkOut) return true
  if (!home?.unavailableDates || !Array.isArray(home.unavailableDates)) return true

  const unavailableSet = new Set(home.unavailableDates)
  const stayDates = getDatesBetween(checkIn, checkOut)

  // Convert each date to 'DDMMYY' and check if it's unavailable
  return stayDates.every(dateStr => {
    const formatted = formatDateToDDMMYY(dateStr)
    return !unavailableSet.has(formatted)
  })
}

function getDatesBetween(startStr, endStr) {
  const dates = []
  const current = new Date(startStr)
  const end = new Date(endStr)

  while (current < end) {
    const copy = new Date(current)
    dates.push(copy.toISOString().slice(0, 10)) // 'YYYY-MM-DD'
    current.setDate(current.getDate() + 1)
  }

  return dates
}

function formatDateToDDMMYY(dateStr) {
  const [year, month, day] = dateStr.split("-")
  return `${day}${month}${year.slice(-2)}`
}

function getImageSrcForTitle(title) {

  const fileName = title
  const test = `/Airdnd/icons/search_destinations_icons/${fileName}.png`;
  
  return test;
}

  function formatDate(dateStr) {
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = String(date.getFullYear()).slice(2)
    return `${day}${month}${year}`
  }
  function getDateRange(startStr, endStr) {
    const start = new Date(startStr)
    const end = new Date(endStr)
    const dates = []

    while (start <= end) {
      dates.push(formatDate(start.toISOString()))
      start.setDate(start.getDate() + 1)
    }

    return dates
  }