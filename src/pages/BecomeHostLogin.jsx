import { MiniHeader } from "../cmps/MiniHeader"
import { AppFooter } from "../cmps/AppFooter"

export function BecomeHostLogin() {
    return (
        <section className="become-host-login">
            <div className="become-host-login-content">
                <h1>Log in or sign up</h1>
                <h2>Welcome to Airbnb</h2>

                <div className="phone-input-wrapper">
                    <select name="country" id="country">
                        <option value="">Country code</option>
                        <option value="US">United States (+1)</option>
                        <option value="CA">Canada (+1)</option>
                        <option value="UK">United Kingdom (+44)</option>
                        <option value="IL">Israel (+972)</option>
                    </select>

                    <input
                        type="tel"
                        name="phone"
                        id="phone"
                        placeholder="Phone number"
                    />
                </div>


                <p className="info-txt">
                    We’ll call or text you to confirm your number. Standard message and data
                    rates apply.
                </p>
                <p className="privacy-txt">
                   Privacy Policy
                </p>

                <button>Continue</button>
            </div>
        </section>
    )
}
