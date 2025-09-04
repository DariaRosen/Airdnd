import { Link } from "react-router-dom"
import { FaStar } from "react-icons/fa"
import { getFormattedDateRange } from "../services/home.service"

export function HomeTextPreview({ home, variant = "main", onHover = () => { } }) {
  const dateRange = getFormattedDateRange()

  return (
    <article>
      <Link
        to={`/home/${home._id}`}
        onMouseEnter={() => onHover(home._id)}
        onMouseLeave={() => onHover(null)}
        style={{ textDecoration: 'none' }}
      >
        {variant === "main" && (
          <div className="main">
            <h4>{home.title}</h4>
            <p>{dateRange}</p>
            <p className="price-rating">
              <span className="price">{home.price}₪ for 1 night</span>
              <span className="rating">
                <FaStar className="star-icon" />
                {home.rating}
              </span>
            </p>
          </div>
        )}

        {variant === "browser" && (
          <div className="browser">
            <span className="title-rating">
              <span className="title">{home.title}</span>
              <span className="rating-block">
                <FaStar className="star-icon" />
                {home.rating} ({home.numberOfRaters})
              </span>
            </span>
            <p className="description">{home.description}</p>
            <p className="beds">{home.beds} beds</p>
            <p className="date-range-browser">{dateRange}</p>
            <span className="price-browser">
              <span className="night-price">₪{home.price} </span>
              <span>night</span> •
              <span className="total-price">₪{home.price * 2} total</span>
            </span>
          </div>
        )}

        {variant === "map" && (
          <div className="map">
            <span className="title-rating">
              <span className="title">{home.title}</span>
              <span className="rating-block">
                <FaStar className="star-icon" />
                {home.rating} ({home.numberOfRaters})
              </span>
            </span>
            <p className="description-map">{home.description}</p>
            <span className="price-browser">
              <span className="night-price">₪{home.price} </span>
              <span>night</span> •
              <span className="date-range-browser">{dateRange}</span>
            </span>
          </div>
        )}
      </Link>
    </article>
  )
}
