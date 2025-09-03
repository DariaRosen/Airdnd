import { useNavigate } from "react-router-dom"

export function ConfirmationPage() {

    const navigate = useNavigate()

    function handleBack() {
        navigate("/")
    }
    return (
        <div className="confirmation-container">
            <div className="confirmation-icon">✔</div>
            <h1 className="confirmation-title">Thank you for your reservation!</h1>
            <p className="confirmation-text">
                Your booking has been confirmed. A confirmation email has been sent with all the details.
            </p>
            <button className="confirmation-button" onClick={handleBack}>
                Back Home
            </button>
        </div>
    )
}