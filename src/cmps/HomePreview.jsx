import { Link } from "react-router-dom"
import { getFormattedDateRange } from "../services/home.service"
import { FaStar } from "react-icons/fa"
import { useState } from "react"

export function HomePreview({ home }) {
    const dateRange = getFormattedDateRange() // returns something like "Jul 15–17"
    const [isLiked, setIsLiked] = useState(false)

    const toggleHeart = (e) => {
        e.preventDefault()   // 👈 stops the Link from navigating
        e.stopPropagation()  // 👈 stops the click from bubbling up
        setIsLiked(prev => !prev)
    }
    return (
        <article className="home-preview">
            <div className="img-container">
                <Link to={`/home/${home._id}`}>
                    <img src={home.imgUrls[0]} alt={home.title} />
                </Link>

                <img
                    src={isLiked ? './icons/heart_pink.svg' : './icons/heart.svg'}
                    alt="Heart icon"
                    className="heart-icon"
                    onClick={toggleHeart}
                />
            </div>

            <Link to={`/home/${home._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
