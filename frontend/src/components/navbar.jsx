import React from 'react'
import { NavLink } from 'react-router-dom'

const navbar = () => {
  return (
    <div className='flex items-center justify-between p-4'>
        <div className='h-12 , m-2 ' id="logo">
            <img className='h-full rounded-full' src="../../images/logo.jpg" alt="logo" />
        </div>
     <div  id="nav">
        <ul className='flex items-center justify-between gap-4 '>
            <NavLink className='text-xl font-bold' to="/">
            <p>Home</p></NavLink>
            <NavLink className='text-xl font-bold ' to="/about">About</NavLink>
            <NavLink className='text-xl font-bold' to="/contact">Contact</NavLink>
            <NavLink className='text-xl font-bold' to="/collection">Collection</NavLink>
        </ul>
     </div>
     <div className='  flex items-center justify-between gap-4  ' id="search">
     <div id="search">
      <img className=' h-6 w-6 ' src="../../images/search_icon.png" alt="" />
      </div>
      <div className='  group   relative ' id="profile">
        <div className='h-6 w-10'>
        <img className='h-6 w-6 cursor-pointer ' src="../../images/profile_icon.png" alt="" />
        </div>
      <div className='absolute w-20 top-5 p-5  right-0 group-hover:block hidden dropdown-menu text-black  ' id="profile-dropdown">
        <p className='cursor-pointer hover:text-gray-400 '>Profile</p>
        <p className='cursor-pointer hover:text-gray-400'>orders </p>
        <p className='cursor-pointer hover:text-gray-400'>logout</p>
      </div>
      </div>
      <div id="cart">
      <NavLink to="/cart">
     <img className=' h-6 w-6 ' src="../../images/cart_icon.png" alt="" />
      </NavLink>
      </div>
     </div>
     
    
    </div>
  )
}

export default navbar