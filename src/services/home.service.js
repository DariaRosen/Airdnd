import { storageService } from "./async-storage.service"
import { utilService } from "./util.service"
//import { userService } from '../user'

export const homeService = {
  query,
  getById,
  save,
  remove,
  getEmptyHome,
  getFormattedDateRange,
  getFilterFromSearchParams,
}
window.hs = homeService

const STORAGE_KEY = "homeDB"
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
      _id: makeId(),
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
    price: getRandomIntInclusive(100, 1000),
    capacity: getRandomIntInclusive(1, 10),
    rooms: getRandomIntInclusive(1, 5),
    beds: getRandomIntInclusive(1, 5),
    bathrooms: getRandomIntInclusive(1, 5),
    type: "apartment",
    imgUrls: [],
    rating: 0,
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

function _createHomes() {
  let homes = utilService.loadFromStorage(STORAGE_KEY)
  if (!homes || !homes.length) {
    homes = [
      {
        _id: utilService.makeId(),
        title: "Rustic Countryside House",
        description: "בית כפרי עם גינה ונוף לשדות ירוקים",
        price: 450,
        capacity: 4,
        rooms: 3,
        beds: 3,
        bathrooms: 2,
        type: "house",
        imgUrls: [
          `/Airdnd/img/${utilService.getRandomIntInclusive(1, 10)}.jpg`,
        ],
        rating: utilService.getRandomRating(),
        guestFavorite: utilService.getRandomGuestFavorite(),
        location: {
          country: "UK",
          city: "Cotswolds",
          address: "High St, Bourton-on-the-Water, GL54 2AP",
          lat: 51.8857,
          lng: -1.7578,
        },
        amenities: ["WiFi", "Fireplace", "Garden"],
        msgs: [],
        unavailableDates: [],
        createdAt: Date.now(),
      },
      {
        _id: utilService.makeId(),
        title: "Modern Loft Downtown",
        description: "לופט מודרני במרכז העיר עם מטבח מאובזר",
        price: 600,
        capacity: 3,
        rooms: 4,
        beds: 5,
        bathrooms: 2,
        type: "loft",
        imgUrls: [
          `/Airdnd/img/${utilService.getRandomIntInclusive(1, 10)}.jpg`,
        ],
        rating: utilService.getRandomRating(),
        guestFavorite: utilService.getRandomGuestFavorite(),
        location: {
          country: "Germany",
          city: "Berlin",
          address: "Rosenthaler Str. 72A, 10119 Berlin",
          lat: 52.5291,
          lng: 13.4011,
        },
        amenities: ["WiFi", "Kitchen", "Washer", "TV"],
        msgs: [],
        unavailableDates: [],
        createdAt: Date.now(),
      },
      {
        _id: utilService.makeId(),
        title: "Desert Eco Dome",
        description: "כיפת מגורים אקולוגית בלב המדבר",
        price: 390,
        capacity: 2,
        rooms: 2,
        beds: 1,
        bathrooms: 1,
        type: "dome",
        imgUrls: [
          `/Airdnd/img/${utilService.getRandomIntInclusive(1, 10)}.jpg`,
        ],
        rating: utilService.getRandomRating(),
        guestFavorite: utilService.getRandomGuestFavorite(),
        location: {
          country: "Israel",
          city: "Mitzpe Ramon",
          address: "Ma'ale Ben Tur St 1, Mitzpe Ramon",
          lat: 30.6063,
          lng: 34.8011,
        },
        amenities: ["Solar Power", "Outdoor Shower"],
        msgs: [],
        unavailableDates: [],
        createdAt: Date.now(),
      },
      {
        _id: utilService.makeId(),
        title: "Lakeview Cottage",
        description: "קוטג' קסום על שפת אגם עם קיאקים",
        price: 500,
        capacity: 5,
        rooms: 2,
        beds: 3,
        bathrooms: 1,
        type: "cabin",
        imgUrls: [
          `/Airdnd/img/${utilService.getRandomIntInclusive(1, 10)}.jpg`,
        ],
        rating: utilService.getRandomRating(),
        guestFavorite: utilService.getRandomGuestFavorite(),
        location: {
          country: "Canada",
          city: "Muskoka",
          address: "1072 Elgin House Rd, Port Carling, ON",
          lat: 45.1116,
          lng: -79.5795,
        },
        amenities: ["Kayaks", "Fireplace", "WiFi"],
        msgs: [],
        unavailableDates: [],
        createdAt: Date.now(),
      },
      {
        _id: utilService.makeId(),
        title: "Treehouse Escape",
        description: "בית עץ גבוה בין עצים ונוף עוצר נשימה",
        price: 420,
        capacity: 2,
        rooms: 2,
        beds: 1,
        bathrooms: 1,
        type: "treehouse",
        imgUrls: [
          `/Airdnd/img/${utilService.getRandomIntInclusive(1, 10)}.jpg`,
        ],
        rating: utilService.getRandomRating(),
        guestFavorite: utilService.getRandomGuestFavorite(),
        location: {
          country: "USA",
          city: "Atlanta",
          address: "135 Waddell St NE, Atlanta, GA",
          lat: 33.7537,
          lng: -84.3555,
        },
        amenities: ["WiFi", "Deck", "Nature View"],
        msgs: [],
        unavailableDates: [],
        createdAt: Date.now(),
      },
      {
        _id: utilService.makeId(),
        title: "Ski Chalet",
        description: "צ'לט סקי חמימי ליד המסלולים",
        price: 750,
        capacity: 6,
        rooms: 3,
        beds: 4,
        bathrooms: 3,
        type: "chalet",
        imgUrls: [
          `/Airdnd/img/${utilService.getRandomIntInclusive(1, 10)}.jpg`,
        ],
        rating: utilService.getRandomRating(),
        guestFavorite: utilService.getRandomGuestFavorite(),
        location: {
          country: "Switzerland",
          city: "Zermatt",
          address: "Bahnhofstrasse 50, 3920 Zermatt",
          lat: 46.0207,
          lng: 7.7491,
        },
        amenities: ["Fireplace", "Heated Floors", "WiFi"],
        msgs: [],
        unavailableDates: [],
        createdAt: Date.now(),
      },
      {
        _id: utilService.makeId(),
        title: "Historic City Flat",
        description: "דירה היסטורית בעיר העתיקה עם תקרות גבוהות",
        price: 540,
        capacity: 3,
        rooms: 2,
        beds: 2,
        bathrooms: 2,
        type: "apartment",
        imgUrls: [
          `/Airdnd/img/${utilService.getRandomIntInclusive(1, 10)}.jpg`,
        ],
        rating: utilService.getRandomRating(),
        guestFavorite: utilService.getRandomGuestFavorite(),
        location: {
          country: "Spain",
          city: "Barcelona",
          address: "Carrer de Ferran, 08002 Barcelona",
          lat: 41.3809,
          lng: 2.1755,
        },
        amenities: ["WiFi", "Balcony", "Washer"],
        msgs: [],
        unavailableDates: [],
        createdAt: Date.now(),
      },
      {
        _id: utilService.makeId(),
        title: "Rooftop Studio TLV",
        description: "סטודיו עם מרפסת גג במרכז תל אביב",
        price: 460,
        capacity: 2,
        rooms: 1,
        beds: 1,
        bathrooms: 1,
        type: "studio",
        imgUrls: [
          `/Airdnd/img/${utilService.getRandomIntInclusive(1, 10)}.jpg`,
        ],
        rating: utilService.getRandomRating(),
        guestFavorite: utilService.getRandomGuestFavorite(),
        location: {
          country: "Israel",
          city: "Tel Aviv",
          address: "Sheinkin St 45, Tel Aviv-Yafo",
          lat: 32.0663,
          lng: 34.7741,
        },
        amenities: ["WiFi", "AC", "Kitchenette"],
        msgs: [],
        unavailableDates: [],
        createdAt: Date.now(),
      },
      {
        _id: utilService.makeId(),
        title: "Canal View Apartment",
        description: "דירה יפהפייה עם נוף לתעלות של אמסטרדם",
        price: 690,
        capacity: 4,
        rooms: 4,
        beds: 3,
        bathrooms: 2,
        type: "apartment",
        imgUrls: [
          `/Airdnd/img/${utilService.getRandomIntInclusive(1, 10)}.jpg`,
        ],
        rating: utilService.getRandomRating(),
        guestFavorite: utilService.getRandomGuestFavorite(),
        location: {
          country: "Netherlands",
          city: "Amsterdam",
          address: "Herengracht 541, 1017 BW Amsterdam",
          lat: 52.3648,
          lng: 4.8936,
        },
        amenities: ["WiFi", "Coffee Maker", "Bike Rental"],
        msgs: [],
        unavailableDates: [],
        createdAt: Date.now(),
      },
      {
        _id: utilService.makeId(),
        title: "Tropical Jungle Bungalow",
        description: "בונגלו פרטי בתוך הג'ונגל עם מקלחת חוץ",
        price: 370,
        capacity: 2,
        rooms: 1,
        beds: 1,
        bathrooms: 1,
        type: "bungalow",
        imgUrls: [
          `/Airdnd/img/${utilService.getRandomIntInclusive(1, 10)}.jpg`,
        ],
        rating: utilService.getRandomRating(),
        guestFavorite: utilService.getRandomGuestFavorite(),
        location: {
          country: "Costa Rica",
          city: "Puerto Viejo",
          address: "Calle 213, Puerto Viejo de Talamanca",
          lat: 9.6586,
          lng: -82.7542,
        },
        amenities: ["Outdoor Shower", "Mosquito Net", "WiFi"],
        msgs: [],
        unavailableDates: [],
        createdAt: Date.now(),
      },
      {
        _id: utilService.makeId(),
        title: "Central Park Apartment",
        description: "דירה מקסימה ליד סנטרל פארק עם מטבח מאובזר",
        price: 720,
        capacity: 4,
        rooms: 3,
        beds: 3,
        bathrooms: 3,
        type: "apartment",
        imgUrls: [
          `/Airdnd/img/${utilService.getRandomIntInclusive(1, 10)}.jpg`,
        ],
        rating: utilService.getRandomRating(),
        guestFavorite: utilService.getRandomGuestFavorite(),
        location: {
          country: "USA",
          city: "New York",
          address: "15 Central Park West, New York, NY 10023",
          lat: 40.7712,
          lng: -73.9801,
        },
        amenities: ["WiFi", "Washer", "Elevator"],
        msgs: [],
        unavailableDates: [],
        createdAt: Date.now(),
      },
      {
        _id: utilService.makeId(),
        title: "Brooklyn Loft",
        description: "לופט תעשייתי משופץ בוויליאמסבורג",
        price: 680,
        capacity: 3,
        rooms: 2,
        beds: 2,
        bathrooms: 1,
        type: "loft",
        imgUrls: [
          `/Airdnd/img/${utilService.getRandomIntInclusive(1, 10)}.jpg`,
        ],
        rating: utilService.getRandomRating(),
        guestFavorite: utilService.getRandomGuestFavorite(),
        location: {
          country: "USA",
          city: "New York",
          address: "76 N 4th St, Brooklyn, NY 11249",
          lat: 40.7175,
          lng: -73.9613,
        },
        amenities: ["WiFi", "Kitchen", "Work Desk"],
        msgs: [],
        unavailableDates: [],
        createdAt: Date.now(),
      },
      {
        _id: utilService.makeId(),
        title: "Times Square Studio",
        description: "סטודיו קומפקטי בלב מנהטן, דקות הליכה מטיימס סקוור",
        price: 580,
        capacity: 2,
        rooms: 1,
        beds: 1,
        bathrooms: 1,
        type: "studio",
        imgUrls: [
          `/Airdnd/img/${utilService.getRandomIntInclusive(1, 10)}.jpg`,
        ],
        rating: utilService.getRandomRating(),
        guestFavorite: utilService.getRandomGuestFavorite(),
        location: {
          country: "USA",
          city: "New York",
          address: "1600 Broadway, New York, NY 10019",
          lat: 40.7591,
          lng: -73.9845,
        },
        amenities: ["AC", "WiFi", "Smart TV"],
        msgs: [],
        unavailableDates: [],
        createdAt: Date.now(),
      },
      {
        _id: utilService.makeId(),
        title: "Harlem Brownstone",
        description: "דירה בבית ברונסטון קלאסי בהארלם",
        price: 490,
        capacity: 4,
        rooms: 3,
        beds: 3,
        bathrooms: 2,
        type: "house",
        imgUrls: [
          `/Airdnd/img/${utilService.getRandomIntInclusive(1, 10)}.jpg`,
        ],
        rating: utilService.getRandomRating(),
        guestFavorite: utilService.getRandomGuestFavorite(),
        location: {
          country: "USA",
          city: "New York",
          address: "147 W 120th St, New York, NY 10027",
          lat: 40.8054,
          lng: -73.9512,
        },
        amenities: ["WiFi", "Backyard", "Washer"],
        msgs: [],
        unavailableDates: [],
        createdAt: Date.now(),
      },
      {
        _id: utilService.makeId(),
        title: "SoHo Artist Loft",
        description: "לופט רחב ידיים באזור הטרנדי של סוהו",
        price: 850,
        capacity: 5,
        rooms: 3,
        beds: 3,
        bathrooms: 4,
        type: "loft",
        imgUrls: [
          `/Airdnd/img/${utilService.getRandomIntInclusive(1, 10)}.jpg`,
        ],
        rating: utilService.getRandomRating(),
        guestFavorite: utilService.getRandomGuestFavorite(),
        location: {
          country: "USA",
          city: "New York",
          address: "101 Wooster St, New York, NY 10012",
          lat: 40.7251,
          lng: -74.0021,
        },
        amenities: ["WiFi", "Art Decor", "Workspace"],
        msgs: [],
        unavailableDates: [],
        createdAt: Date.now(),
      },
      {
        _id: utilService.makeId(),
        title: "Sheinkin Studio",
        description: "סטודיו מעוצב ברחוב שינקין השוקק",
        price: 490,
        capacity: 2,
        rooms: 1,
        beds: 1,
        bathrooms: 1,
        type: "studio",
        imgUrls: [
          `/Airdnd/img/${utilService.getRandomIntInclusive(1, 10)}.jpg`,
        ],
        rating: utilService.getRandomRating(),
        guestFavorite: utilService.getRandomGuestFavorite(),
        location: {
          country: "Israel",
          city: "Tel Aviv",
          address: "Sheinkin St 23, Tel Aviv-Yafo",
          lat: 32.0683,
          lng: 34.7729,
        },
        amenities: ["WiFi", "AC", "Balcony"],
        msgs: [],
        unavailableDates: [],
        createdAt: Date.now(),
      },
      {
        _id: utilService.makeId(),
        title: "Luxury Neve Tzedek Apartment",
        description: "דירת יוקרה בלב שכונת נווה צדק ההיסטורית",
        price: 880,
        capacity: 4,
        rooms: 3,
        beds: 2,
        bathrooms: 2,
        type: "apartment",
        imgUrls: [
          `/Airdnd/img/${utilService.getRandomIntInclusive(1, 10)}.jpg`,
        ],
        rating: utilService.getRandomRating(),
        guestFavorite: utilService.getRandomGuestFavorite(),
        location: {
          country: "Israel",
          city: "Tel Aviv",
          address: "Shabazi St 50, Tel Aviv-Yafo",
          lat: 32.0596,
          lng: 34.7621,
        },
        amenities: ["WiFi", "Washer", "Kitchen"],
        msgs: [],
        unavailableDates: [],
        createdAt: Date.now(),
      },
      {
        _id: utilService.makeId(),
        title: "Rooftop Loft Dizengoff",
        description: "לופט עם מרפסת גג פרטית ברחוב דיזנגוף",
        price: 720,
        capacity: 3,
        rooms: 2,
        beds: 2,
        bathrooms: 2,
        type: "loft",
        imgUrls: [
          `/Airdnd/img/${utilService.getRandomIntInclusive(1, 10)}.jpg`,
        ],
        rating: utilService.getRandomRating(),
        guestFavorite: utilService.getRandomGuestFavorite(),
        location: {
          country: "Israel",
          city: "Tel Aviv",
          address: "Dizengoff St 190, Tel Aviv-Yafo",
          lat: 32.0942,
          lng: 34.7749,
        },
        amenities: ["WiFi", "Deck", "AC"],
        msgs: [],
        unavailableDates: [],
        createdAt: Date.now(),
      },
      {
        _id: utilService.makeId(),
        title: "Old North Family Flat",
        description: "דירה מרווחת למשפחה בצפון הישן של תל אביב",
        price: 650,
        capacity: 5,
        rooms: 4,
        beds: 4,
        bathrooms: 4,
        type: "apartment",
        imgUrls: [
          `/Airdnd/img/${utilService.getRandomIntInclusive(1, 10)}.jpg`,
        ],
        rating: utilService.getRandomRating(),
        guestFavorite: utilService.getRandomGuestFavorite(),
        location: {
          country: "Israel",
          city: "Tel Aviv",
          address: "Weizmann St 15, Tel Aviv-Yafo",
          lat: 32.0937,
          lng: 34.7879,
        },
        amenities: ["WiFi", "Crib", "Elevator"],
        msgs: [],
        unavailableDates: [],
        createdAt: Date.now(),
      },
      {
        _id: utilService.makeId(),
        title: "Florentin Urban Pad",
        description: "דירת סטודיו מודרנית בשכונת פלורנטין היצירתית",
        price: 430,
        capacity: 2,
        rooms: 1,
        beds: 1,
        bathrooms: 2,
        type: "studio",
        imgUrls: [
          `/Airdnd/img/${utilService.getRandomIntInclusive(1, 10)}.jpg`,
        ],
        rating: utilService.getRandomRating(),
        guestFavorite: utilService.getRandomGuestFavorite(),
        location: {
          country: "Israel",
          city: "Tel Aviv",
          address: "Abarbanel St 56, Tel Aviv-Yafo",
          lat: 32.0541,
          lng: 34.7666,
        },
        amenities: ["WiFi", "Workspace", "Coffee Maker"],
        msgs: [],
        unavailableDates: [],
        createdAt: Date.now(),
      },
    ]
    utilService.saveToStorage(STORAGE_KEY, homes)
  }
}
