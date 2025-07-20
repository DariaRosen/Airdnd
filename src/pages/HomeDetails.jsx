import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { homeService } from "../services/home.service"
import {userService} from '../services/user.service'

export function HomeDetails() {
  const [home, setHome] = useState(null)
  const params = useParams()

  useEffect(() => {
    loadHome()
  }, [params.homeId])

  async function loadHome() {
    try {
      const home = await homeService.getById(params.homeId)
      setHome(home)
    } catch (error) {
      console.log("error:", error)
    }
  }

  if (!home) return <div>Loading...</div> //do somthing better with effect

  return (
    <section className="home-details">
      <h1>{home.description}</h1>
      <section className="gallery">
        <h1>pictures here</h1>
      </section>
      <section className="content-grid">
        <section className="main-content-details">
          <h3>{`Entire ${home.type} in ${home.location.city}, ${home.location.country}`}</h3>
          <h4>{`${home.capacity} guests · ${home.rooms} rooms · ${
            home.beds
          } bed${home.beds > 1 ? "s" : ""} · ${home.bathrooms} bath${
            home.bathrooms > 1 ? "s" : ""
          }  `}</h4>
          <h3>What this place offers</h3>
          <h4>{home.amenities.join(", ")}</h4>
        </section>

        <aside className="side-panel">booking future</aside>
      </section>

      <Link to="/">Back</Link>
    </section>
  )
}
