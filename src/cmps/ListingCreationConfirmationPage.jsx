import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import confetti from "canvas-confetti"

export function ListingCreationConfirmationPage() {
    const navigate = useNavigate()

    useEffect(() => {
        // 🎉 Trigger confetti animation once when page loads
        confetti({
            particleCount: 200,
            spread: 80,
            origin: { y: 0.6 },
        })
    }, [])

    function handleBack() {
        navigate("/welcome-host")
    }

    return (
        <div className="confirmation-container">
            <div className="confirmation-icon">✔</div>
            <h1 className="confirmation-title">Thank you for your listing!</h1>
            <p className="confirmation-text">
                Your listing has been created successfully.
            </p>
            <button className="confirmation-button" onClick={handleBack}>
                Back Home
            </button>
        </div>
    )
}
