import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { loadHomes } from "../store/homes/homes.action.js"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service"
import { getFormattedDateRange } from "../services/home/home.service"
import { HomesList } from "./HomesList.jsx"
const dateRange = getFormattedDateRange() // returns something like "Jul 15–17"

export function HomeIndex() {
  const homes = useSelector((storeState) => storeState.homeModule.homes)
  const filterBy = useSelector((storeState) => storeState.homeModule.filterBy)



  console.log(uniqueAmenities)


  useEffect(() => {
    loadHomes(filterBy)
      .then((homes) => {
        showSuccessMsg("Load homes successfully")
      })
      .catch((err) => {
        showErrorMsg("Cannot load homes")
      })
  }, [])
  console.log("homes", homes)
  return (
    <>
      <AppHeader />

      <div className="home-index">
        <hr />

        <ul className="home-list">
          {homes.map((home) => (
            <li className="home-preview" key={home._id}>
              <Link
                to={`/home/${home._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <HomePreview home={home} />
              </Link>
            </li>
          ))}
        </ul>

        <hr />
      </div>

      <AppFooter />
    </>
  )
}
