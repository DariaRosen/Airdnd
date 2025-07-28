import { Link } from "react-router-dom"
import { getFormattedDateRange } from "../services/home.service"
import { FaStar } from "react-icons/fa"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { updateFavoritesUser } from "../store/user/user.action"

export function HomePreviewBrowser({ home }) {
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
        <article className="home-preview-browser">
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

            <Link to={`/home/${home._id}`}>


                <p className="full-properties">

                    <span className="title-rating">
                        {home.title}
                        <FaStar className="star-icon" />
                        {home.rating}
                        {home.numberOfRaters}
                    </span>

                    <p>{home.description}</p>
                    <p>{home.beds} beds</p>
                    <p>{dateRange}</p>
                    <span className="price">
                        {home.price}₪ for 1 night
                        *{home.price * 2}₪ total
                    </span>
                </p>
            </Link>
        </article>
    )
}
