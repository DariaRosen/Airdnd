import { useParams, Link } from "react-router-dom"
import { useState, useEffect, useMemo } from "react"
import { homeService } from "../services/home.service"
import { userService } from "../services/user.service"
import { useSelector } from "react-redux"
import { amenities } from "../assests/amenities"
import {AirdndIcon} from "../cmps/AirdndIcon"
import {BookingSearch} from "../cmps/BookingSearch"

export function HomeDetails() {
  const [home, setHome] = useState(null)
  const [selectedImgIdx, setSelectedImgIdx] = useState(null)
  const [isAmenitiesModalOpen, setIsAmenitiesModalOpen] = useState(false)
  const params = useParams()

  const homes = useSelector((storeState) => storeState.homeModule.homes || [])
  const uniqueAmenities = useMemo(() => {
    if (!homes.length) return []

    const allAmenities = homes.flatMap((home) => home.amenities || [])
    const unique = [...new Set(allAmenities)]

    console.log("uniqueAmenities:", unique)
    return unique
  }, [homes])

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

  if (!home)
    return (
      <div
        style={{ display: "flex", justifyContent: "center", margin: "4rem 0" }}
      >
        <AirdndIcon size={80} color="#FF385C" className="loading-icon" />
      </div>
    )

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
              key={idx + 1}
              onClick={() => setSelectedImgIdx(idx + 1)}
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
          <section className="amenities">
            {home.amenities.slice(0, 6).map((amenity) => {
              const match = amenities.find(
                (amen) => amen.key.toLowerCase() === amenity.toLowerCase()
              )
              if (!match) return null
              return (
                <div className="amenity" key={amenity}>
                  <img
                    src={`/Airdnd/public/icons/amenities/${match.icon}.svg`}
                    alt={match.label}
                  />
                  <span>{match.label}</span>
                </div>
              )
            })}
            {home.amenities.length > 6 && (
              <button
                className="btn-show-all"
                onClick={() => setIsAmenitiesModalOpen(true)}
              >
                Show all amenities
              </button>
            )}
          </section>
        </section>

        <aside className="side-panel">

            <BookingSearch home={home} />

        </aside>
      </section>

      {selectedImgIdx !== null && (
        <div
          className="modal image-modal"
          onClick={() => setSelectedImgIdx(null)}
        >
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
      {isAmenitiesModalOpen && (
        <div
          className="modal amenities-modal"
          onClick={() => setIsAmenitiesModalOpen(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setIsAmenitiesModalOpen(false)}
            >
              ×
            </button>
            <h2>All amenities</h2>
            <div className="all-amenities-grid">
              {home.amenities.map((amenity) => {
                const match = amenities.find(
                  (amen) => amen.key.toLowerCase() === amenity.toLowerCase()
                )
                if (!match) return null
                return (
                  <div className="amenity" key={amenity}>
                    <img
                      src={`/Airdnd/public/icons/amenities/${match.icon}.svg`}
                      alt={match.label}
                    />
                    <span>{match.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
