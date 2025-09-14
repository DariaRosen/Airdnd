import { useState, useEffect } from "react"
import { homeService } from "../services/home.service"
import { userService } from "../services/user.service"
import { FaStar } from "react-icons/fa"
import { formatDistanceToNow, differenceInYears, differenceInMonths, differenceInWeeks } from "date-fns"

export function Review({ homeId }) {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (homeId) loadReviews()
    }, [homeId])

    async function loadReviews() {
        try {
            setLoading(true)
            const reviews = await homeService.getHomeReviews(homeId)
            const reviewsWithUsers = await Promise.all(
                reviews.map(async (review) => {
                    const user = await userService.getById(review.user_id)
                    return { ...review, user }
                })
            )
            setReviews(reviewsWithUsers)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <p>Loading reviews...</p>

    return (
        <section className="reviews">
            {reviews.map((review) => (
                <ReviewItem key={review._id} review={review} />
            ))}
        </section>
    )
}

export function ReviewItem({ review }) {
    const [expanded, setExpanded] = useState(false)

    const timeAgo = review.createdAt
        ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })
        : ""

    const stars = Array.from({ length: review.rating }, (_, i) => i + 1)

    // ✅ Airbnb membership time
    let membership = ""
    if (review.user?.createdAt) {
        const created = new Date(review.user.createdAt)
        const years = differenceInYears(new Date(), created)
        if (years >= 1) {
            membership = `${years} ${years === 1 ? "year" : "years"} on Airbnb`
        } else {
            const months = differenceInMonths(new Date(), created)
            if (months >= 1) {
                membership = `${months} ${months === 1 ? "month" : "months"} on Airbnb`
            } else {
                const weeks = differenceInWeeks(new Date(), created)
                membership = `${weeks} ${weeks === 1 ? "week" : "weeks"} on Airbnb`
            }
        }
    }

    const defaultAvatar =
        "https://res.cloudinary.com/dool6mmp1/image/upload/v1757595867/Capture_igxch6.jpg"

    return (
        <article className="review-item">
            <div className="review-header">
                <img
                    src={review.user?.avatar || defaultAvatar}
                    alt={`${review.user?.firstName} ${review.user?.lastName}`}
                    className="review-avatar"
                />
                <div>
                    <h4>{review.user?.firstName} {review.user?.lastName}</h4>
                    {membership && <span>{membership}</span>}
                </div>
            </div>

            <div className="review-meta">
                <span className="review-stars"><FaStar className="star-icon" /></span>
                <span className="review-stars"><FaStar className="star-icon" /></span>
                <span className="review-stars"><FaStar className="star-icon" /></span>
                <span className="review-stars"><FaStar className="star-icon" /></span>
                <span className="review-stars"><FaStar className="star-icon" /></span>
                <span className="review-dot"> · </span>
                <span className="review-timeAgo">{timeAgo}</span>
                <span className="review-dot"> · </span>
                <span className="review-stayDuration">Stayed one night</span>
            </div>

            <p className="review-comment">
                {expanded ? review.comment : review.comment.slice(0, 150) + "..."}
            </p>

            {review.comment.length > 150 && (
                <button 
                    className="review-toggle"
                    onClick={() => setExpanded((prev) => !prev)}
                >
                    {expanded ? "Show less" : "Show more"}
                </button>
            )}
        </article>
    )
}


