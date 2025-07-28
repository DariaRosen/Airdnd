
export const mapService = {
    initMap,
    getUserPosition,
    setMarker,
    panTo,
    lookupAddressGeo,
    addClickListener,
    loadGoogleMaps,
    setMarkers
}

// TODO: Enter your API Key
const API_KEY = 'AIzaSyBljDF6gKT-m-nzL0Okmu4xNduoBEd2m3k'
var gMap
var gMarker
var gMarkers = []

function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            gMap = new google.maps.Map(
                document.querySelector('.map'), {
                center: { lat, lng },
                zoom: 8
            })
        })
}

function panTo({ lat, lng, zoom = 15 }) {
    const laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
    gMap.setZoom(zoom)
}

function lookupAddressGeo(geoOrAddress) {
    // Sample URLs:
    // const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}`
    // const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452`

    var url = `https://maps.googleapis.com/maps/api/geocode/json?key=${API_KEY}&`
    url += (geoOrAddress.lat) ? `latlng=${geoOrAddress.lat},${geoOrAddress.lng}` :
        `address=${geoOrAddress}`

    return fetch(url)
        .then(res => res.json())
        .then(res => {
            if (!res.results.length) return new Error('Found nothing')
            res = res.results[0]
            const { formatted_address, geometry } = res

            const geo = {
                address: formatted_address.substring(formatted_address.indexOf(' ')).trim(),
                lat: geometry.location.lat,
                lng: geometry.location.lng,
                zoom: gMap.getZoom()
            }
            return geo
        })

}

function addClickListener(cb) {
    gMap.addListener('click', (mapsMouseEvent) => {
        const geo = { lat: mapsMouseEvent.latLng.lat(), lng: mapsMouseEvent.latLng.lng() }
        lookupAddressGeo(geo).then(cb)
    })
}

function setMarker(loc) {
    (gMarker) && gMarker.setMap(null)
    if (!loc) return
    gMarker = new google.maps.Marker({
        position: loc.geo,
        map: gMap,
        title: loc.name
    })
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getUserPosition() {
    return new Promise((resolve, reject) => {
        function onSuccess(res) {
            const latLng = {
                lat: res.coords.latitude,
                lng: res.coords.longitude
            }
            resolve(latLng)
        }
        navigator.geolocation.getCurrentPosition(onSuccess, reject)
    })
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()

    const elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('GoogleMaps script failed to load')
    })
}

// map.service.js

export function loadGoogleMaps(apiKey) {
    return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
            resolve(window.google.maps)
            return
        }

        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
        script.async = true
        script.onload = () => resolve(window.google.maps)
        script.onerror = (err) => reject(err)
        document.body.appendChild(script)
    })
}

export function setMarkers(homes) {
    gMarkers.forEach(marker => marker.setMap(null))
    gMarkers = []

    homes.forEach(home => {
        const { location, title, price } = home
        if (!location?.lat || !location?.lng) return

        const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: gMap,
            title: title || '',
            icon: getCustomMarkerIcon(price, false),
        })

        // Simulate hover
        marker.addListener('mouseover', () => {
            marker.setIcon(getCustomMarkerIcon(price, true))
        })
        marker.addListener('mouseout', () => {
            marker.setIcon(getCustomMarkerIcon(price, false))
        })

        gMarkers.push(marker)
    })
}


function getCustomMarkerIcon(price, isHovered = false) {
  const width = isHovered ? 88 : 80
  const height = isHovered ? 44 : 40
  const fontSize = isHovered ? 18 : 16
  const radius = isHovered ? 22 : 20

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect rx="${radius}" ry="${radius}" x="0" y="0" width="${width}" height="${height}"
        fill="#fff" stroke="#ccc" stroke-width="1" />
      <text x="50%" y="55%" text-anchor="middle" fill="#000"
        font-size="${fontSize}" font-family="Arial" font-weight="bold">₪${price}</text>
    </svg>
  `
  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    scaledSize: new google.maps.Size(width, height),
    anchor: new google.maps.Point(width / 2, height / 2),
  }
}


