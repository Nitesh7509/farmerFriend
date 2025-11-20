import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { ShopContext } from '../contexts/shopcontext';
import { AuthContext } from '../contexts/authcontext';

const Navbar = () => {
  const { setSearchResult, getCartCount } = useContext(ShopContext);
  const { user, role, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (location.pathname === "/login" || location.pathname === "/") {
    return null;
  }

  const cartCount = getCartCount();

  return (
    <div className='bg-white shadow-md sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto flex items-center justify-between p-4'>
        {/* Logo */}
        <Link to="/home" className='flex items-center gap-2'>
          <div className='h-12 w-12'>
            <img className='h-full w-full rounded-full object-cover' src="../../images/logo.jpg" alt="logo" />
          </div>
          <span className='text-xl font-bold text-green-600 hidden sm:block'>FarmerFriend</span>
        </Link>

        {/* Navigation Links */}
        <nav>
          <ul className='flex items-center gap-6'>
            <li>
              <NavLink 
                className={({ isActive }) => 
                  `text-lg font-semibold transition-colors ${isActive ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`
                } 
                to="/home"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                className={({ isActive }) => 
                  `text-lg font-semibold transition-colors ${isActive ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`
                } 
                to="/about"
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink 
                className={({ isActive }) => 
                  `text-lg font-semibold transition-colors ${isActive ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`
                } 
                to="/contact"
              >
                Contact
              </NavLink>
            </li>
            <li>
              <NavLink 
                className={({ isActive }) => 
                  `text-lg font-semibold transition-colors ${isActive ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`
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
                    `text-lg font-semibold transition-colors ${isActive ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`
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
                    `text-lg font-semibold transition-colors ${isActive ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`
                  } 
                  to="/admin-dashboard"
                >
                  Dashboard
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {/* Right Side Icons */}
        <div className='flex items-center gap-6'>
          {/* Search */}
          <NavLink to="/collection" className='hover:scale-110 transition-transform'>
            <img className='h-6 w-6' src="../../images/search_icon.png" alt="search" onClick={() => setSearchResult(true)} />
          </NavLink>

          {/* Profile Dropdown */}
          <div className='group relative'>
            <img className='h-6 w-6 cursor-pointer hover:scale-110 transition-transform' src="../../images/profile_icon.png" alt="profile" />
            <div className='absolute w-40 top-0 pt-8 right-0 hidden group-hover:block'>
              <div className='bg-white shadow-lg rounded-md py-2 border border-gray-200'>
                {user && (
                  <p className='font-semibold px-4 py-2 text-sm border-b text-gray-800'>{user.name}</p>
                )}
                <Link to="/profile">
                  <p className='cursor-pointer hover:bg-gray-100 px-4 py-2 text-gray-700'>Profile</p>
                </Link>
                <Link to="/orders">
                  <p className='cursor-pointer hover:bg-gray-100 px-4 py-2 text-gray-700'>Orders</p>
                </Link>
                <p className='cursor-pointer hover:bg-red-50 px-4 py-2 text-red-600' onClick={handleLogout}>Logout</p>
              </div>
            </div>
          </div>

          {/* Cart with Badge */}
          <NavLink to="/cart" className='relative hover:scale-110 transition-transform'>
            <img className='h-6 w-6' src="../../images/cart_icon.png" alt="cart" />
            {cartCount > 0 && (
              <span className='absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
                {cartCount}
              </span>
            )}
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;