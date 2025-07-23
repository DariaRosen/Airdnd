import { useEffect, useState } from "react"
import { HomesList } from "./HomesList.jsx"
import { useLocation } from "react-router-dom";

export function HomeFilter() {
  const location = useLocation();
  const filterParams = location.state || {}; // { location: 'Tel Aviv-Yafo' } or { checkIn: '...', checkOut: '...' }
  const [homeCount, setHomeCount] = useState(0)

  useEffect(() => {
    console.log("Received props via Link state:", filterParams);
  }, [filterParams]);

  return (
    <section className="home-filter">
      {/* <h2>{homeCount} homes within map area</h2> */}
      <h2>Homes within map area</h2>
      <HomesList {...filterParams} onCountChange={setHomeCount} />
    </section>
  )
}