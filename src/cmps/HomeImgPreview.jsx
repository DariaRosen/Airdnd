import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { updateFavoritesUser } from "../store/user/user.action"

export function HomeImgPreview({ home, onHover, showCarousel = true }) {
  const [currentImgIdx, setCurrentImgIdx] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const loggedInUser = useSelector(storeState => storeState.userModule.loggedInUser)


  useEffect(() => {
    setIsLiked(loggedInUser?.favorites?.includes(home._id) || false)
  }, [loggedInUser, home._id])

  useEffect(() => {
    setCurrentImgIdx(0)
  }, [home._id])

  const toggleHeart = async () => {
    setIsLiked(prev => !prev)
    const updatedUser = await updateFavoritesUser(loggedInUser._id, home._id)
    setIsLiked(updatedUser.favorites.includes(home._id))
  }

    const hasCarousel = showCarousel && home.imgUrls.length > 1

  return (
    <article
      onMouseEnter={() => onHover(home._id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="img-container">
        {hasCarousel ? (
          <div className="carousel-container">
            <button
              className="carousel-btn left"
              onClick={(e) => {
                e.stopPropagation()
                setCurrentImgIdx((prevIdx) => (prevIdx === 0 ? home.imgUrls.length - 1 : prevIdx - 1))
              }}
            >
              <img src="/Airdnd/icons/arrow1.svg" alt="Previous" className="arrow-icon rotate-left" />
            </button>

            <Link to={`/home/${home._id}`}>
              <img src={home.imgUrls[currentImgIdx]} alt={home.title} />
            </Link>

            <button
              className="carousel-btn right"
              onClick={(e) => {
                e.stopPropagation()
                setCurrentImgIdx((prevIdx) => (prevIdx === home.imgUrls.length - 1 ? 0 : prevIdx + 1))
              }}
            >
              <img src="/Airdnd/icons/arrow1.svg" alt="Next" className="arrow-icon" />
            </button>
          </div>
        ) : (
          <Link to={`/home/${home._id}`}>
            <img src={home.imgUrls[0]} alt={home.title} />
          </Link>
        )}

        <img
          src={isLiked ? "./icons/heart_pink.svg" : "./icons/heart.svg"}
          alt="Heart icon"
          className="heart-icon"
          onClick={toggleHeart}
        />

        {home.guestFavorite && (
          <div className="guest-fav-tag">
            <span>Guest favorite</span>
          </div>
        )}
      </div>
    </article>
  )
}
