import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { ShopContext } from '../contexts/shopcontext';
import { AuthContext } from '../contexts/authcontext';

const Navbar = () => {
  const { setSearchResult, getCartCount } = useContext(ShopContext);
  const { user, role, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    setShowMobileMenu(false);
    navigate('/login');
  };

  if (location.pathname === "/login" || location.pathname === "/") {
    return null;
  }

  const cartCount = getCartCount();

  return (
    <div className='bg-white shadow-md sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto flex items-center justify-between p-3 sm:p-4'>
        {/* Logo */}
        <Link to="/home" className='flex items-center gap-2'>
          <div className='h-10 w-10 sm:h-12 sm:w-12'>
            <img className='h-full w-full rounded-full object-cover' src="../../images/logo.jpg" alt="logo" />
          </div>
          <span className='text-lg sm:text-xl font-bold text-green-600 hidden sm:block'>FarmerFriend</span>
        </Link>

        {/* Navigation Links - Hidden on mobile */}
        <nav className='hidden md:block'>
          <ul className='flex items-center gap-4 lg:gap-6'>
            <li>
              <NavLink 
                className={({ isActive }) => 
                  `text-base lg:text-lg font-semibold transition-colors ${isActive ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`
                } 
                to="/home"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                className={({ isActive }) => 
                  `text-base lg:text-lg font-semibold transition-colors ${isActive ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`
                } 
                to="/about"
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink 
                className={({ isActive }) => 
                  `text-base lg:text-lg font-semibold transition-colors ${isActive ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`
                } 
                to="/contact"
              >
                Contact
              </NavLink>
            </li>
            <li>
              <NavLink 
                className={({ isActive }) => 
                  `text-base lg:text-lg font-semibold transition-colors ${isActive ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`
                } 
                to="/collection"
              >
                Collection
              </NavLink>
            </li>
            {role === 'farmer' && (
              <li>
                <NavLink 
                  className={({ isActive }) => 
                    `text-base lg:text-lg font-semibold transition-colors ${isActive ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`
                  } 
                  to="/farmer-dashboard"
                >
                  Dashboard
                </NavLink>
              </li>
            )}
            {role === 'admin' && (
              <li>
                <NavLink 
                  className={({ isActive }) => 
                    `text-base lg:text-lg font-semibold transition-colors ${isActive ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`
                  } 
                  to="/admin-dashboard"
                >
                  Dashboard
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {/* Right Side Icons - Always visible */}
        <div className='flex items-center gap-3 sm:gap-4 md:gap-6'>
          {/* Search */}
          <NavLink to="/collection" className='hover:scale-110 transition-transform'>
            <img className='h-5 w-5 sm:h-6 sm:w-6' src="../../images/search_icon.png" alt="search" onClick={() => setSearchResult(true)} />
          </NavLink>

          {/* Profile Dropdown - Click to toggle on mobile, hover on desktop */}
          <div className='relative'>
            <img 
              className='h-5 w-5 sm:h-6 sm:w-6 cursor-pointer hover:scale-110 transition-transform' 
              src="../../images/profile_icon.png" 
              alt="profile"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            />
            {showProfileMenu && (
              <>
                {/* Backdrop for mobile */}
                <div 
                  className='fixed inset-0 md:hidden' 
                  onClick={() => setShowProfileMenu(false)}
                ></div>
                
                {/* Dropdown Menu */}
                <div className='absolute w-40 sm:w-44 top-8 right-0 z-50'>
                  <div className='bg-white shadow-xl rounded-lg py-2 border border-gray-200'>
                    {user && (
                      <p className='font-semibold px-4 py-2 text-sm border-b text-gray-800 truncate'>{user.name}</p>
                    )}
                    <Link to="/profile" onClick={() => setShowProfileMenu(false)}>
                      <p className='cursor-pointer hover:bg-gray-100 px-4 py-2.5 text-sm text-gray-700'>Profile</p>
                    </Link>
                    <Link to="/orders" onClick={() => setShowProfileMenu(false)}>
                      <p className='cursor-pointer hover:bg-gray-100 px-4 py-2.5 text-sm text-gray-700'>Orders</p>
                    </Link>
                    <p className='cursor-pointer hover:bg-red-50 px-4 py-2.5 text-sm text-red-600' onClick={handleLogout}>Logout</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Cart with Badge - Always visible */}
          <NavLink to="/cart" className='relative hover:scale-110 transition-transform'>
            <img className='h-5 w-5 sm:h-6 sm:w-6' src="../../images/cart_icon.png" alt="cart" />
            {cartCount > 0 && (
              <span className='absolute -top-1.5 sm:-top-2 -right-1.5 sm:-right-2 bg-green-600 text-white text-[10px] sm:text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center'>
                {cartCount}
              </span>
            )}
          </NavLink>

          {/* Mobile Menu Button - Visible only on mobile */}
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className='md:hidden p-1'
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showMobileMenu ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className='md:hidden bg-white border-t border-gray-200 shadow-lg'>
          <nav className='px-4 py-3'>
            <ul className='space-y-1'>
              <li>
                <NavLink 
                  className={({ isActive }) => 
                    `block py-2.5 px-3 rounded-lg font-semibold transition-colors ${isActive ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`
                  } 
                  to="/home"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink 
                  className={({ isActive }) => 
                    `block py-2.5 px-3 rounded-lg font-semibold transition-colors ${isActive ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`
                  } 
                  to="/collection"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Collection
                </NavLink>
              </li>
              <li>
                <NavLink 
                  className={({ isActive }) => 
                    `block py-2.5 px-3 rounded-lg font-semibold transition-colors ${isActive ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`
                  } 
                  to="/about"
                  onClick={() => setShowMobileMenu(false)}
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink 
                  className={({ isActive }) => 
                    `block py-2.5 px-3 rounded-lg font-semibold transition-colors ${isActive ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`
                  } 
                  to="/contact"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Contact
                </NavLink>
              </li>
              {role === 'farmer' && (
                <li>
                  <NavLink 
                    className={({ isActive }) => 
                      `block py-2.5 px-3 rounded-lg font-semibold transition-colors ${isActive ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`
                    } 
                    to="/farmer-dashboard"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Dashboard
                  </NavLink>
                </li>
              )}
              {role === 'admin' && (
                <li>
                  <NavLink 
                    className={({ isActive }) => 
                      `block py-2.5 px-3 rounded-lg font-semibold transition-colors ${isActive ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`
                    } 
                    to="/admin-dashboard"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Dashboard
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Navbar;
