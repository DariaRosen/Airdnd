import { useState, useEffect } from "react"
import { homeService } from "../services/home.service"
import { userService } from "../services/user.service"

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
        <section>
            {reviews.map((review) => (
                <ReviewItem key={review._id} review={review} />
            ))}
        </section>
    )
}

function ReviewItem({ review }) {
    const [expanded, setExpanded] = useState(false)

    return (
        <article>
            <h4>{review.user.fullname}</h4>
            <p>
                {expanded ? review.comment : review.comment.slice(0, 100) + "..."}
            </p>
            <button onClick={() => setExpanded((prev) => !prev)}>
                {expanded ? "Show less" : "Read more"}
            </button>
        </article>
    )
}
