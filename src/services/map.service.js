
export const mapService = {
    initMap,
    getUserPosition,
    setMarker,
    panTo,
    lookupAddressGeo,
    addClickListener,
    loadGoogleMaps,
    setMarkers,
    setZoom
}

// TODO: Enter your API Key
//const API_KEY = 'AIzaSyBljDF6gKT-m-nzL0Okmu4xNduoBEd2m3k'
const API_KEY = 'AIzaSyCcGWh_6sj0APzllBueyq2pjuR9Mm81EHg'

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

// Keep a global array to track your custom markers
var gCustomMarkers = []

export function setMarkers(homes, hoveredHomeId, onMarkerClick) {
    // Remove old custom markers from the map
    if (gCustomMarkers.length) {
        gCustomMarkers.forEach(marker => marker.setMap(null))
        gCustomMarkers = []
    }

    // If no homes, nothing to do
    if (!homes || homes.length === 0) return

    // Calculate bounds to fit all markers
    const bounds = new google.maps.LatLngBounds()

    homes.forEach(home => {
        const { location, price } = home
        if (!location?.lat || !location?.lng) return

        const position = new google.maps.LatLng(location.lat, location.lng)

        // Create your HTML custom marker
        const CustomMarker = createCustomMarkerClass()
        const isHovered = hoveredHomeId === home._id
        const marker = new CustomMarker(position, gMap, price, isHovered, home._id, onMarkerClick)

        gCustomMarkers.push(marker)
        bounds.extend(position)
    })

    if (!bounds.isEmpty()) {
        // Optionally add vertical padding for better positioning
        const northEast = bounds.getNorthEast()
        const southWest = bounds.getSouthWest()

        const latSpan = northEast.lat() - southWest.lat()
        const paddingFactor = 0.25

        const paddedNorthLat = northEast.lat() + latSpan * paddingFactor
        const paddedSouthLat = southWest.lat() - latSpan * paddingFactor

        const paddedBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(paddedSouthLat, southWest.lng()),
            new google.maps.LatLng(paddedNorthLat, northEast.lng())
        )

        gMap.fitBounds(paddedBounds)
    }
}

export function createCustomMarkerClass() {
    return class CustomMarker extends google.maps.OverlayView {
        constructor(position, map, price, isHovered = false, homeId, onMarkerClick) {
            super()
            this.position = position
            this.map = map
            this.price = price
            this.div = null
            this.isHovered = isHovered
            this.homeId = homeId
            this.onMarkerClick = onMarkerClick
            this.setMap(map)
        }

        onAdd() {
            this.div = document.createElement('div')
            this.div.className = 'custom-marker'
            this.div.innerText = `₪${this.price}`

            // Add hovered class if applicable
            if (this.isHovered) {
                this.div.classList.add('hovered-marker')
            }

            this.div.style.cursor = 'pointer'
            // Add click listener to div
            this.div.addEventListener('click', () => {
                if (this.onMarkerClick) {
                    this.onMarkerClick(this.homeId)
                }
            })

            const panes = this.getPanes()
            panes.overlayMouseTarget.appendChild(this.div)
            this.div.style.zIndex = this.isHovered ? '999' : '1'

            // Hover effect to raise z-index
            this.div.addEventListener('mouseenter', () => {
                this.div.style.zIndex = '1000'
            })
            this.div.addEventListener('mouseleave', () => {
                this.div.style.zIndex = this.isHovered ? '999' : '1'
            })
        }

        draw() {
            const projection = this.getProjection()
            const pos = projection.fromLatLngToDivPixel(this.position)

            if (pos && this.div) {
                this.div.style.left = pos.x + 'px'
                this.div.style.top = pos.y + 'px'
                this.div.style.position = 'absolute'
                this.div.style.transform = 'translate(-50%, -50%)'
            }
        }

        onRemove() {
            if (this.div && this.div.parentNode) {
                this.div.parentNode.removeChild(this.div)
                this.div = null
            }
        }
    }
}
function setZoom(level) {
    if (gMap && typeof gMap.setZoom === 'function') {
        gMap.setZoom(level)
    }
}
