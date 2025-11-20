import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import About from './pages/about'
import Contact from './pages/contact'
import Collection from './pages/collection'
import Navbar from './components/navbar'
import Search from './components/search'
import Product from './pages/product'
import Cart from './pages/cart'
import Login from './pages/login'
import Signup from './pages/signup'
import Auth from './components/auth'
import Unauthorized from './pages/Unauthorized'
import Profile from './pages/profile'
import FarmerDashboard from './pages/FarmerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Orders from './pages/Orders'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Error from './pages/Error'
import Success from './pages/Success'

export const backendurl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  return (
    <div>
      <Navbar />
      <Search />
      <Routes>
        <Route path="/" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/reset-password/:token" element={<ResetPassword/>} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/error" element={<Error />} />
        <Route path="/success" element={<Success />} />

        {/* Protected Routes - All authenticated users */}
        <Route path="/home" element={
          <Auth>
            <Home />
          </Auth>
        } />
        
        <Route path="/collection" element={
          <Auth>
            <Collection />
          </Auth>
        } />
        
        <Route path="/about" element={
          <Auth>
            <About />
          </Auth>
        } />
        
        <Route path="/product/:productid" element={
          <Auth>
            <Product />
          </Auth>
        } />
        
        <Route path="/contact" element={
          <Auth>
            <Contact />
          </Auth>
        } />
        
        <Route path="/profile" element={
          <Auth>
            <Profile />
          </Auth>
        } />
        
        <Route path="/cart" element={
          <Auth>
            <Cart />
          </Auth>
        } />
        
        <Route path="/orders" element={
          <Auth>
            <Orders />
          </Auth>
        } />
        
        {/* Farmer-only route */}
        <Route path="/farmer-dashboard" element={
          <Auth requiredRole="farmer">
            <FarmerDashboard />
          </Auth>
        } />
        
        {/* Admin-only route */}
        <Route path="/admin-dashboard" element={
          <Auth requiredRole="admin">
            <AdminDashboard />
          </Auth>
        } />
      </Routes>
    </div>
  )
}

export default App