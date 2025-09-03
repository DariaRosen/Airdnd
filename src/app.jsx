import React from "react"
import { HashRouter as Router, Routes, Route, Outlet } from "react-router-dom"
import { AppHeader } from "./cmps/AppHeader"
import { AppFooter } from "./cmps/AppFooter"
import { HomeBrowserWithMap } from "./pages/HomeBrowserWithMap"
import { HomePage } from "./pages/HomePage"
import { HomeDetails } from "./pages/HomeDetails"
import { HomesList } from "./cmps/HomesList"
import { UserMsg } from "./cmps/UserMsg"
import { BecomeHostLogin } from "./pages/BecomeHostLogin"
import { MiniHeader } from "./cmps/MiniHeader"
import { ConfirmationPage } from "./cmps/ConfirmationPage"

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
      <MiniHeader />
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
        </Route>
      </Routes>
    </Router>
  )
}
