import { useNavigate } from "react-router-dom"

export function ConfirmationPage() {

    const navigate = useNavigate()

    function handleBack() {
        navigate("/")
    }
    return (
        <div className="confirmation-container">
            <div className="confirmation-icon">✔</div>
            <h1 className="confirmation-title">Thank you for your booking!</h1>
            <p className="confirmation-text">
                Your booking has been confirmed.
            </p>
            <button className="confirmation-button" onClick={handleBack}>
                Back Home
            </button>
        </div>
    )
}