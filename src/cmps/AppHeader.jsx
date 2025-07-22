import { AirdndIcon } from "./AirdndIcon"
import { useNavigate, Link } from "react-router-dom"

export function AppHeader() {
  const navigate = useNavigate()
  const globus = "/Airdnd/icons/globus.svg"
  const select = "/Airdnd/icons/select.svg"
  const magnifying_glass = "/Airdnd/icons/magnifying_glass.svg"

  return (
    <section className="header">
      <div className="logo-wrapper">
        {/* Home icon */}
        <Link to="/" className="logo-link">
          <AirdndIcon />
        </Link>

        {/* Video icons */}
        <div className="video-container">
          <div className="video-item">
            <video className="logo-video" autoPlay loop muted playsInline poster="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/3b89f74c-8695-46e4-9c8d-cf9e1d777e99.png?im_w=240">
              <source src="https://a0.muscache.com/videos/search-bar-icons/webm/house-twirl-selected.webm" type="video/webm" />
              <source src="https://a0.muscache.com/videos/search-bar-icons/hevc/house-twirl-selected.mov" type="video/mp4" />
            </video>
            <span className="video-title">Homes</span>
          </div>

          <div className="video-item">
            <video className="logo-video" autoPlay loop muted playsInline poster="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/e47ab655-027b-4679-b2e6-df1c99a5c33d.png?im_w=240">
              <source src="https://a0.muscache.com/videos/search-bar-icons/webm/balloon-twirl.webm" type="video/webm" />
              <source src="https://a0.muscache.com/videos/search-bar-icons/hevc/balloon-twirl.mov" type="video/mp4" />
            </video>
            <span className="video-title">Experiences</span>
          </div>

          <div className="video-item">
            <video className="logo-video" autoPlay loop muted playsInline poster="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/3d67e9a9-520a-49ee-b439-7b3a75ea814d.png?im_w=240">
              <source src="https://a0.muscache.com/videos/search-bar-icons/webm/consierge-twirl.webm" type="video/webm" />
              <source src="https://a0.muscache.com/videos/search-bar-icons/hevc/consierge-twirl.mov" type="video/mp4" />
            </video>
            <span className="video-title">Services</span>
          </div>
        </div>

        {/* Icons */}
        <div className="icon-container">
          <div className="host-text">Become a host</div>
          <Link to="/home" className="logo-link">
            <img src={globus} alt="Globus icon" className="globus-icon" />
          </Link>
          <Link to="/home" className="logo-link">
            <img src={select} alt="Select icon" className="select-icon" />
          </Link>
        </div>
      </div>

      {/* Search bar container */}
      <div className="search-bar">
        <div className="search-item">
          <div className="search-title">Where</div>
          <div className="search-value">Search destinations</div>
        </div>
        <div className="search-item">
          <div className="search-title">Check in</div>
          <div className="search-value">Add dates</div>
        </div>
        <div className="search-item">
          <div className="search-title">Check out</div>
          <div className="search-value">Add dates</div>
        </div>
        <div className="search-item">
          <div className="search-title">Who</div>
          <div className="search-value">Add guests</div>
        </div>
        <div>
            <Link to="/home" className="magnifying_glass">
            <img src={magnifying_glass} alt="Magnifying glass" className="magnifying-glass-icon" />
          </Link>
        </div>
      </div>
    </section>
  )
}
