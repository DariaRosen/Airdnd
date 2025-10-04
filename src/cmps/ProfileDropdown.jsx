import { Link } from "react-router-dom"

export function ProfileDropdown({ onClose }) {
  return (
    <div className="profile-dropdown">
      <Link to="/wishlists" className="dropdown-item">Wishlists</Link>
      <Link to="/trips" className="dropdown-item">Trips</Link>
      <Link to="/messages" className="dropdown-item">Messages</Link>
      <Link to="/profile" className="dropdown-item">Profile</Link>
      <hr />
      <Link to="/account" className="dropdown-item">Account settings</Link>
      <Link to="/languages" className="dropdown-item">Languages & currency</Link>
      <Link to="/help" className="dropdown-item">Help Center</Link>
      <hr />
      <Link to="/become-host" className="dropdown-item">Become a host</Link>
      <Link to="/refer-host" className="dropdown-item">Refer a Host</Link>
      <Link to="/find-cohost" className="dropdown-item">Find a co-host</Link>
      <Link to="/gift-cards" className="dropdown-item">Gift cards</Link>
      <hr />
      <Link to="/logout" className="dropdown-item">Log out</Link>
    </div>
  )
}
