import { HashRouter as Router, Routes, Route, Outlet } from "react-router-dom"
import { AppHeader } from "./cmps/AppHeader"
import { AppFooter } from "./cmps/AppFooter"
import { HomeBrowserWithMap } from "./pages/HomeBrowserWithMap"
import { HomePage } from "./pages/HomePage"
import { HomeDetails } from "./pages/HomeDetails"
import { HomesList } from "./cmps/HomesList"
import { UserMsg } from "./cmps/UserMsg"
import { BecomeHostLogin } from "./pages/BecomeHostLogin"
import { ConfirmationPage } from "./cmps/ConfirmationPage"
import { WelcomeHost } from './pages/WelcomeHost.jsx';
import { HostDashboard } from "./pages/HostDashboard.jsx"
import { HostBookings } from "./pages/HostBookings.jsx"
import { HostAddListing } from "./pages/HostAddListing.jsx"
import { HostListings } from "./pages/HostListings.jsx" 
function DefaultLayout() {
  return (
    <>
      <AppHeader />
      <main className="container">
        <Outlet />
      </main>
      <AppFooter />
      <UserMsg />
    </>
  )
}

function HostLayout() {
  return (
    <>
      <main className="container">
        <Outlet />
      </main>
      <AppFooter />
      <UserMsg />
    </>
  )
}

export function App() {
  return (
    <Router>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home/:homeId" element={<HomeDetails />} />
          <Route path="/list" element={<HomesList />} />
          <Route path="/filter" element={<HomeBrowserWithMap />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
        </Route>

        <Route element={<HostLayout />}>
          <Route path="/become-host" element={<BecomeHostLogin />} />
          <Route path="/welcome-host" element={<WelcomeHost />} />
          <Route path="/host-dashboard" element={<HostDashboard />} />
          <Route path="/host-bookings" element={<HostBookings />} />
          <Route path="/host-listing" element={<HostAddListing />} />
          <Route path="/host-listings" element={<HostListings />} />
        </Route>
      </Routes>
    </Router>
  )
}
