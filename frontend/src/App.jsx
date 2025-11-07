import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import About from './pages/about'
import Contact from './pages/contact'
import Collection from './pages/collection'
import Navbar from './components/navbar'
const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={< Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/collection" element={<Collection />} />
      </Routes>
    </div>
  )
}

export default App