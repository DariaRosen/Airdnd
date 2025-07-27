// services/loadGoogleMapsAPI.js
let isAPILoaded = false

export function loadGoogleMapsAPI(apiKey) {
  if (isAPILoaded) return Promise.resolve()

  return new Promise((resolve, reject) => {
    window.initMap = () => {
      isAPILoaded = true
      resolve()
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`
    script.async = true
    script.onerror = reject

    document.head.appendChild(script)
  })
}
