import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { updateFavoritesUser } from "../store/user/user.action"

export function HomeImgPreview({ home, onHover = () => { }, showCarousel = true }) {
  const [currentImgIdx, setCurrentImgIdx] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [slideDirection, setSlideDirection] = useState('')
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
  const imgToShow = home.imgUrls[hasCarousel ? currentImgIdx : 0]

  return (
    <article
      onMouseEnter={() => hasCarousel && onHover(home._id)}
      onMouseLeave={() => hasCarousel && onHover(null)}
    >
      <div className={`img-container ${hasCarousel ? 'hoverable' : ''}`}>
        <div className="carousel-container">
          {hasCarousel && currentImgIdx > 0 && (
            <button
              className="carousel-btn left"
              onClick={(e) => {
                e.stopPropagation()
                setSlideDirection('left')
                setCurrentImgIdx(prevIdx => prevIdx - 1)
              }}
            >
              <img src="/Airdnd/icons/arrow1.svg" className="arrow-icon rotate-left" />
            </button>
          )}

          <Link to={`/home/${home._id}`}>
            <img
              key={imgToShow}
              src={imgToShow}
              alt={home.title}
              className={`carousel-img slide-${slideDirection}`}
              onAnimationEnd={() => setSlideDirection('')}
            />
          </Link>

          {hasCarousel && currentImgIdx < home.imgUrls.length - 1 && (
            <button
              className="carousel-btn right"
              onClick={(e) => {
                e.stopPropagation()
                setSlideDirection('right')
                setCurrentImgIdx(prevIdx => prevIdx + 1)
              }}
            >
              <img src="/Airdnd/icons/arrow1.svg" className="arrow-icon" />
            </button>
          )}

          {/* Dots below the image */}
          {hasCarousel && (
            <div className="carousel-dots">
              {(() => {
                const totalImgs = home.imgUrls.length
                const maxDots = 5
                let start = 0

                if (totalImgs <= maxDots) {
                  // Less than or equal to 5 images — show all, highlight the current one directly
                  return home.imgUrls.map((_, idx) => (
                    <span
                      key={idx}
                      className={`dot ${currentImgIdx === idx ? 'active' : ''}`}
                    />
                  ))
                }

                // More than 5 images — need to slide the visible window of dots
                if (currentImgIdx < 2) start = 0
                else if (currentImgIdx >= totalImgs - 2) start = totalImgs - maxDots
                else start = currentImgIdx - 2

                return home.imgUrls.slice(start, start + maxDots).map((_, idx) => {
                  let activeDotIdx = 2 // by default, highlight the middle dot
                  if (currentImgIdx < 2) activeDotIdx = currentImgIdx
                  else if (currentImgIdx >= totalImgs - 2)
                    activeDotIdx = maxDots - (totalImgs - currentImgIdx)

                  return (
                    <span
                      key={start + idx}
                      className={`dot ${idx === activeDotIdx ? 'active' : ''}`}
                    />
                  )
                })
              })()}
            </div>
          )}
        </div>

        <img
          src={isLiked ? "./icons/heart_pink.svg" : "./icons/heart.svg"}
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
