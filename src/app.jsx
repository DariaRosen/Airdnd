import React from "react"
import { HashRouter as Router, Routes, Route } from "react-router-dom"
import { AppHeader } from "./cmps/AppHeader"
import { AppFooter } from "./cmps/AppFooter"
import { HomePage } from "./pages/HomePage"
import { HomeDetails } from "./pages/HomeDetails"
import { HomesList } from "./cmps/HomesList"
import { UserMsg } from "./cmps/UserMsg"
import { HomeFilter } from "./cmps/HomeFilter"

export function App() {
  return (
    <Router>
      <section className="main-container">
        <AppHeader />
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home/:homeId" element={<HomeDetails />} />
            <Route path="/list" element={<HomesList />} />
            <Route path="/filter" element={<HomeFilter />} />
          </Routes>
        </main>
        <AppFooter />
        <UserMsg />
      </section>
    </Router>
  )
}

export default App
