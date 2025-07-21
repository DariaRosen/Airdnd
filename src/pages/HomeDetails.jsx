import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { homeService } from "../services/home.service"
import { userService } from "../services/user.service"

export function HomeDetails() {
  const [home, setHome] = useState(null)
  const [selectedImgIdx, setSelectedImgIdx] = useState(null)
  const params = useParams()

  useEffect(() => {
    loadHome()
  }, [params.homeId])

  async function loadHome() {
    try {
      const home = await homeService.getById(params.homeId)
      setHome(home)
    } catch (error) {
      console.log("error:", error)
    }
  }

  if (!home) return <div>Loading...</div> //do somthing better with effect

  return (
    <section className="home-details">
      <h1>{home.description}</h1>
      <section className="gallery">
        <div className="gallery-grid">
          <div className="main-img">
            <img
              src={home.imgUrls[0]}
              key={0}
              onClick={() => setSelectedImgIdx(0)}
            />
          </div>
          {home.imgUrls.slice(1, 5).map((url, idx) => (
            <div
              className="grid-img"
              key={idx+1}
              onClick={() => setSelectedImgIdx(idx)}
            >
              <img src={url} />
            </div>
          ))}
        </div>
      </section>
      <section className="content-grid">
        <section className="main-content-details">
          <h3>{`Entire ${home.type} in ${home.location.city}, ${home.location.country}`}</h3>
          <h4>{`${home.capacity} guests · ${home.rooms} rooms · ${
            home.beds
          } bed${home.beds > 1 ? "s" : ""} · ${home.bathrooms} bath${
            home.bathrooms > 1 ? "s" : ""
          }  `}</h4>
          <h3>What this place offers</h3>
          <h4>{home.amenities.join(", ")}</h4>
        </section>

        <aside className="side-panel">booking future</aside>
      </section>

      <Link to="/">Back</Link>
      {selectedImgIdx !== null && (
        <div className="modal" onClick={() => setSelectedImgIdx(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setSelectedImgIdx(null)}
            >
              ×
            </button>

            <img src={home.imgUrls[selectedImgIdx]} alt="Full size" />

            {selectedImgIdx > 0 && (
              <button
                className="arrow left"
                onClick={() => setSelectedImgIdx((prev) => prev - 1)}
              >
                ←
              </button>
            )}
            {selectedImgIdx < home.imgUrls.length - 1 && (
              <button
                className="arrow right"
                onClick={() => setSelectedImgIdx((prev) => prev + 1)}
              >
                →
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
