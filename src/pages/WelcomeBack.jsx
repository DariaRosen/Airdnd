import { AirdndIcon } from '../cmps/AirdndIcon'

export function WelcomeBack() {
    return (
        <section className="welcome-back">
            {/* Header */}
            <div className="welcome-header">
                <AirdndIcon color="#000000" />
                <div className="header-buttons">
                    <button className="questions-btn">Questions?</button>
                    <button className="exit-btn">Exit</button>
                </div>
            </div>

            {/* Listing container */}
            <div className="listing-container">
                <h1>Welcome back, Daria</h1>

                <div className="finish-listing">
                    <h2>Finish your listing</h2>
                    <div className="listing-item">
                        <img
                            src="/path/to/example-listing.png"
                            alt="Listing"
                            className="listing-thumb"
                        />
                        <span>עגכיעגיכעחיכחכחחטחטחטאחגכי</span>
                    </div>
                </div>

                <div className="new-listing">
                    <h2>Start a new listing</h2>
                    <button className="create-btn">
                        <span className="icon">+</span> Create a new listing
                    </button>
                    <button className="create-btn">
                        <span className="icon">🗂</span> Create from an existing listing
                    </button>
                </div>
            </div>
        </section>
    );
}
