import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { homeService } from "../services/home.service"
import { userService } from "../services/user.service"
import { amenities } from "../assests/amenities"
import { AirdndIcon } from "../cmps/AirdndIcon"
import { BookingSearch } from "../cmps/BookingSearch"
import { Review } from "../cmps/Review"

export function HomeDetails() {
  const [home, setHome] = useState(null)
  const [reviewsCount, setReviewsCount] = useState(0)
  const [rating, setRating] = useState(0)
  const [host, setHost] = useState(null)
  const [selectedImgIdx, setSelectedImgIdx] = useState(null)
  const [isAmenitiesModalOpen, setIsAmenitiesModalOpen] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [reviews, setReviews] = useState([])
  const [reviewsWithUsers, setReviewsWithUsers] = useState([])
  const params = useParams()

  useEffect(() => {
    if (params.homeId) loadHome()
  }, [params.homeId])

  async function loadHome() {
    try {
      const homeData = await homeService.getById(params.homeId)
      setHome(homeData)

      const reviews = await homeService.getHomeReviews(homeData._id)

      // Fetch users for each review
      const reviewsWithUsers = await Promise.all(
        reviews.map(async (review) => {
          const user = await userService.getById(review.user_id)
          return { ...review, user }
        })
      )
      setReviewsWithUsers(reviewsWithUsers)

      const avgRating = await homeService.getHomeRating(homeData._id)
      setRating(avgRating)

      if (homeData.host_id) {
        const hostData = await userService.getById(homeData.host_id)
        setHost(hostData)
      }
    } catch (err) {
      console.log("Error loading home:", err)
    }
  }

  if (!home)
    return (
      <div className="loading-wrapper">
        <AirdndIcon size={80} color="#FF385C" className="loading-icon" />
      </div>
    )

  const descriptionLines = home.description.split("\n")
  const displayedDescription = showFullDescription
    ? descriptionLines
    : descriptionLines.slice(0, 7)

  return (
    <section className="home-details">
      <h1>{home.title}</h1>

      {/* Gallery */}
      <section className="gallery">
        <div className="gallery-grid">
          <div className="main-img">
            <img src={home.imgUrls[0]} key={0} onClick={() => setSelectedImgIdx(0)} />
          </div>
          {home.imgUrls.slice(1, 5).map((url, idx) => (
            <div className="grid-img" key={idx + 1} onClick={() => setSelectedImgIdx(idx + 1)}>
              <img src={url} />
            </div>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="content-grid">
        <section className="main-content-details">
          <h3>{`Entire ${home.type} in ${home.location.city}, ${home.location.country}`}</h3>
          <h4>{`${home.capacity} guests · ${home.rooms} rooms · ${home.beds} bed${home.beds > 1 ? "s" : ""} · ${home.bathrooms} bath${home.bathrooms > 1 ? "s" : ""}`}</h4>

          <p>Rating: {rating} ⭐</p>
          <p>{reviewsCount} reviews</p>

          {/* Hosted by info */}
          {host && (
            <div className="host-info">
              <img className="host-avatar" src={host.avatar || host.imgUrl} alt={`${host.firstName} avatar`} />
              <p>
                Hosted by {host.firstName} {host.lastName} · Hosting: {host.hosting} years
              </p>
            </div>
          )}

          {/* Description */}
          <section className="home-description">
            {displayedDescription.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
            {!showFullDescription && descriptionLines.length > 7 && (
              <button className="btn-show-more" onClick={() => setShowFullDescription(true)}>
                Show more
              </button>
            )}
          </section>

          {/* Highlights */}
          {home.highlights && (
            <section className="home-highlights">
              <h3>Highlights</h3>
              {Object.entries(home.highlights).map(([key, value]) => (
                <p key={key}><strong>{value}</strong></p>
              ))}
            </section>
          )}

          {/* Amenities */}
          <h3>What this place offers</h3>
          <section className="amenities">
            {home.amenities.slice(0, 6).map((amenity) => {
              const match = amenities.find((amen) => amen.key.toLowerCase() === amenity.toLowerCase())
              if (!match) return null
              return (
                <div className="amenity" key={amenity}>
                  <img src={`${import.meta.env.BASE_URL}icons/amenities/${match.icon}.svg`} alt={match.label} />
                  <span>{match.label}</span>
                </div>
              )
            })}
            {home.amenities.length > 6 && (
              <button className="btn-show-all" onClick={() => setIsAmenitiesModalOpen(true)}>
                Show all amenities
              </button>
            )}
          </section>

          {/* Reviews */}
          <section className="home-reviews">
            <h3>Reviews</h3>
              <Review homeId={home._id} />
          </section>
        </section>

        <aside className="side-panel">
          <BookingSearch home={home} />
        </aside>
      </section>

      {/* Modals (Images & Amenities) */}
      {selectedImgIdx !== null && (
        <div className="modal image-modal" onClick={() => setSelectedImgIdx(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedImgIdx(null)}>×</button>
            <img src={home.imgUrls[selectedImgIdx]} alt="Full size" />
            {selectedImgIdx > 0 && <button className="arrow left" onClick={() => setSelectedImgIdx(prev => prev - 1)}>←</button>}
            {selectedImgIdx < home.imgUrls.length - 1 && <button className="arrow right" onClick={() => setSelectedImgIdx(prev => prev + 1)}>→</button>}
          </div>
        </div>
      )}

      {isAmenitiesModalOpen && (
        <div className="modal amenities-modal" onClick={() => setIsAmenitiesModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setIsAmenitiesModalOpen(false)}>×</button>
            <h2>All amenities</h2>
            <div className="all-amenities-grid">
              {home.amenities.map((amenity) => {
                const match = amenities.find((amen) => amen.key.toLowerCase() === amenity.toLowerCase())
                if (!match) return null
                return (
                  <div className="amenity" key={amenity}>
                    <img src={`${import.meta.env.BASE_URL}icons/amenities/${match.icon}.svg`} alt={match.label} />
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
