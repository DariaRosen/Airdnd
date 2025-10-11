import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { MiniHeader } from "../cmps/MiniHeader"
import { loginWithPhone } from "../store/user/user.action"

export function BecomeHostLogin() {
    const navigate = useNavigate()
    const [country, setCountry] = useState("IL")
    const [phone, setPhone] = useState("")
    const [errors, setErrors] = useState({ phone: "" })
    const apple = "/Airdnd/icons/apple.svg"
    const email = "/Airdnd/icons/email.svg"
    const facebook = "/Airdnd/icons/facebook.svg"
    const google = "/Airdnd/icons/google.svg"
    const handleContinue = async () => {
        const newErrors = { phone: "" }
        let hasError = false

        if (!phone) {
            newErrors.phone = "Phone number is required"
            hasError = true
        }

        setErrors(newErrors)

        if (!hasError) {
            try {
                const user = await loginWithPhone(phone)
                if (user) {
                    navigate("/welcome-host")
                } else {
                    setErrors({ phone: "User not found. Please sign up." })
                }
            } catch (err) {
                console.error("Login failed", err)
                setErrors({ phone: "Failed to login. Try again." })
            }
        }
    }

    return (
        <section className="become-host-login">
            <MiniHeader />
            <div className="become-host-login-content">
                <h1>Log in or sign up</h1>
                <h2>Welcome to Airbnb</h2>

                <div className="phone-input-wrapper">
                    <select
                        name="country"
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    >
                        <option value="IL">Israel (+972)</option>
                        <option value="US">United States (+1)</option>
                        <option value="CA">Canada (+1)</option>
                        <option value="UK">United Kingdom (+44)</option>
                    </select>

                    <input
                        type="tel"
                        name="phone"
                        id="phone"
                        placeholder={phone ? phone : "+972 Phone number"}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={errors.phone ? "input-error error-bg" : ""}
                    />
                    {errors.phone && (
                        <p className="phone-error">
                            <span className="error-icon"></span> {errors.phone}
                        </p>
                    )}
                </div>

                <p className="info-txt">
                    We’ll call or text you to confirm your number. Standard message and data rates apply.
                </p>
                <p className="privacy-txt">Privacy Policy</p>

                <button onClick={handleContinue}>Continue</button>

                <h3>or</h3>

                <span className="social-login" onClick={handleContinue}>
                    <img src={google} alt="Google" className="social-icon" />
                    <h4>Continue with Google</h4>
                </span>
                <span className="social-login" onClick={handleContinue}>
                    <img src={apple} alt="Apple" className="social-icon" />
                    <h4>Continue with Apple</h4>
                </span>
                <span className="social-login" onClick={handleContinue}>
                    <img src={email} alt="Email" className="social-icon" />
                    <h4>Continue with email</h4>
                </span>
                <span className="social-login" onClick={handleContinue}>
                    <img src={facebook} alt="Facebook" className="social-icon" />
                    <h4>Continue with Facebook</h4>
                </span>



            </div>
        </section>
    )
}