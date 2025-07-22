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
  getRandomBookedDates
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

function debounce(func, timeout = 300) {
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
