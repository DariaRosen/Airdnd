import { Link } from "react-router-dom"
import { getFormattedDateRange } from "../services/home.service"
import { FaStar } from "react-icons/fa"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { updateFavoritesUser } from "../store/user/user.action"

export function HomePreviewBrowser({ home }) {
    const dateRange = getFormattedDateRange() // returns something like "Jul 15–17"
    const [currentImgIdx, setCurrentImgIdx] = useState(0)
    const loggedInUser = useSelector(
        (storeState) => storeState.userModule.loggedInUser
    )
    const [isLiked, setIsLiked] = useState(false)

    useEffect(() => {
        setIsLiked(loggedInUser?.favorites?.includes(home._id) || false)
    }, [loggedInUser, home._id])

    useEffect(() => {
        setCurrentImgIdx(0)
    }, [home._id])

    const toggleHeart = async (homeId) => {
        setIsLiked((prev) => !prev)
        const updatedUser = await updateFavoritesUser(loggedInUser._id, homeId)
        setIsLiked(updatedUser.favorites.includes(homeId))
    }
    return (
        <article className="home-preview-browser">
            <div className="img-container">

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
                <div className="full-properties">
                    <span className="title-rating">
                        <span className="title">{home.title}</span>
                        <span className="rating-block">
                            <FaStar className="star-icon" />
                            {home.rating} ({home.numberOfRaters})
                        </span>
                    </span>

                    <p className="description">{home.description}</p>
                    <p className="beds">{home.beds} beds</p>
                    <p className="date-range-browser">{dateRange}</p>

                    <span className="price-browser">
                        <span className="night-price">₪{home.price} </span>
                        <span>night</span> •
                        <span className="total-price"> ₪{home.price * 2} total</span>
                    </span>
                </div>
            </Link>
        </article>
    )

}
