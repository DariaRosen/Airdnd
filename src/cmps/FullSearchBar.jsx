
export function FullSearchBar() {
  return (
    <div className="search-bar full">
      <div className="item">
        <span>Where</span>
        <input type="text" placeholder="Search destinations" />
      </div>
      <div className="divider" />
      <div className="item">
        <span>Check in</span>
        <input type="text" placeholder="Add dates" />
      </div>
      <div className="divider" />
      <div className="item">
        <span>Check out</span>
        <input type="text" placeholder="Add dates" />
      </div>
      <div className="divider" />
      <div className="item">
        <span>Who</span>
        <input type="text" placeholder="Add guests" />
      </div>
      <button className="search-btn">🔍</button>
    </div>
  )
}
