import { useState, useRef, useEffect, useMemo } from "react"
import { useSelector } from "react-redux"
import { utilService } from "../services/util.service.js"
import { HomeImgPreview } from "./HomeImgPreview.jsx"
import { HomeTextPreview } from "./HomeTextPreview.jsx"

export function HomesList({ location, checkIn, checkOut }) {
  const homes = useSelector(s => s.homeModule.homes)

  const VISIBLE = 7
  const [startIdx, setStartIdx] = useState(0)
  const [step, setStep] = useState(0)
  const [cardW, setCardW] = useState(0)

  const trackRef = useRef(null)
  const carouselRef = useRef(null)
  const arrow1 = "/Airdnd/icons/arrow1.svg"

  const filteredHomes = useMemo(() => {
    return homes.filter(home => {
      const byLoc = location ? utilService.doesHomeMatchLocation(home, location) : true
      const byDates = (checkIn && checkOut) ? utilService.doesHomeMatchDates(home, checkIn, checkOut) : true
      return byLoc && byDates
    })
  }, [homes, location, checkIn, checkOut])

  const total = filteredHomes.length

  const measureStep = () => {
    const el = carouselRef.current
    const track = trackRef.current
    if (!el || !track) return

    const styles = getComputedStyle(track)
    const gap = parseFloat(styles.gap || "10")

    const exactCardW = Math.floor((el.clientWidth - gap * (VISIBLE - 1)) / VISIBLE)
    setCardW(exactCardW)
    setStep(Math.round(exactCardW + gap))

    const maxStart = Math.max(0, total - VISIBLE)
    setStartIdx(p => Math.min(p, maxStart))
  }

  useEffect(() => {
    measureStep()
    window.addEventListener("resize", measureStep)
    return () => window.removeEventListener("resize", measureStep)
  }, [])

  useEffect(() => {
    measureStep()
  }, [total])

  const next = () => setStartIdx(p => Math.min(p + 1, Math.max(0, total - VISIBLE)))
  const prev = () => setStartIdx(p => Math.max(p - 1, 0))

  const translateX = -(startIdx * step)
  const showArrows = total > VISIBLE

  return (
    <section className="home-carousel-wrapper">
      {showArrows && (
        <div className="home-carousel-header">
          <button onClick={prev} disabled={startIdx === 0} className="circle-arrow-btn">
            <img src={arrow1} alt="Previous" className="arrow-icon rotate-left" />
          </button>
          <button onClick={next} disabled={startIdx >= total - VISIBLE} className="circle-arrow-btn">
            <img src={arrow1} alt="Next" className="arrow-icon" />
          </button>
        </div>
      )}

      <section className="home-carousel" ref={carouselRef}>
        <ul
          ref={trackRef}
          className="home-list"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {filteredHomes.map(home => (
            <li
              className="home-preview"
              key={home._id}
              style={{ width: `${cardW}px`, flex: `0 0 ${cardW}px` }}
            >
              <div className="card-img">
                <HomeImgPreview home={home} showCarousel={false} />
              </div>
              <HomeTextPreview home={home} variant="main" />
            </li>
          ))}
        </ul>

        {filteredHomes.length === 0 && (
          <p className="no-results-msg">No homes match your search.</p>
        )}
      </section>
    </section>
  )
}
