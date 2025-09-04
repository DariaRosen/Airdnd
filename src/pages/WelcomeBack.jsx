
export function WelcomeBack() {
  return (
    <section className="welcome-back">
      <div className="welcome-card">
        <h1>Questions?</h1>
        <h2>Welcome back, Daria</h2>

        <form className="login-form">
          <div className="input-wrapper">
            <label htmlFor="phone">Phone Number</label>
            <input type="text" id="phone" placeholder="Enter your phone number" />
            <span className="error-message">
              <span className="error-icon">!</span> Phone number is required
            </span>
          </div>
          <button type="submit">Finish your listing</button>
        </form>

        <div className="footer-links">
          <button className="exit-btn">Exit</button>
          <button className="start-btn">Start a new listing</button>
        </div>
      </div>
    </section>
  );
}

