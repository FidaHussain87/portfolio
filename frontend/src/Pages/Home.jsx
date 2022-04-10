import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Route, Routes } from 'react-router-dom'
import AboutUs from './AboutUs'
const Home = () => {
  const { t, i18n } = useTranslation()

  return (
    <React.StrictMode>
      <h1>Welcome Home</h1>
      <Link to="g">About Us</Link>
      <Routes>
        <Route path="g" element={<AboutUs />} />
      </Routes>
    </React.StrictMode>
  )
}

export default Home
