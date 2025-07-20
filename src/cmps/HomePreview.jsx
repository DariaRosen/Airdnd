import { Link } from "react-router-dom"
import { getFormattedDateRange } from "../services/home.service"
import { FaStar } from "react-icons/fa"
import { useSelector } from "react-redux"
import heart from "../../public/icons/heart.svg"

export function HomePreview({ home }) {
    const dateRange = getFormattedDateRange() // returns something like "Jul 15–17"
    return (
        <article className="home-preview">
            <div className="img-container">
                <img src={home.imgUrls[0]} alt={home.title} />
                {home.guestFavorite && (
                    <img src={heart} alt="Heart icon" className="heart-icon" />
                )}
            </div>
            <h4>{home.title}</h4>
            <p>{dateRange}</p>
            <p>{home.price}₪ for 1 night</p>
            <p>
                <FaStar className="star-icon" />
                {home.rating}
            </p>
        </article>
    )
}
