import { Link } from "react-router-dom"
import { getFormattedDateRange } from "../services/home.service"
import { FaStar } from "react-icons/fa"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { updateFavoritesUser } from "../store/user/user.action"

export function HomePreview({ home }) {
  const dateRange = getFormattedDateRange() // returns something like "Jul 15–17"
  const loggedInUser = useSelector(
    (storeState) => storeState.userModule.loggedInUser
  )
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    setIsLiked(loggedInUser?.favorites?.includes(home._id) || false)
  }, [loggedInUser, home._id])

  const toggleHeart = async (homeId) => {
    setIsLiked((prev) => !prev)
    const updatedUser = await updateFavoritesUser(loggedInUser._id, homeId)
    setIsLiked(updatedUser.favorites.includes(homeId))
  }
  return (
    <article className="home-preview">
      <div className="img-container">
        <Link to={`/home/${home._id}`}>
          <img src={home.imgUrls[0]} alt={home.title} />
        </Link>

        <img
          src={isLiked ? "./icons/heart_pink.svg" : "./icons/heart.svg"}
          alt="Heart icon"
          className="heart-icon"
          onClick={() => toggleHeart(home._id)}
        />

        {home.guestFavorite && (
          <div className="guest-fav-tag">
            <span>Guest favorite</span>
          </div>
        )}
      </div>

      <Link
        to={`/home/${home._id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <h4>{home.title}</h4>
        <p>{home.price}₪ for 1 night</p>
        <p>
          <FaStar className="star-icon" />
          {home.rating}
        </p>
      </Link>
    </article>
  )
}
