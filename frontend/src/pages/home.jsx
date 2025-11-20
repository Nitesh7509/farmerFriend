
import LatestProduct from '../components/latestproduct';
import Collection from '../components/collection';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
  

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12 my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to FarmerFriend
          </h2>
          <p className="text-xl mb-6 max-w-3xl mx-auto">
            Your trusted platform for fresh, organic products directly from farmers to your doorstep
          </p>
          <Link
            to="/collection"
            className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Categories Section */}
      <Collection />

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">🌱</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">100% Fresh</h3>
            <p className="text-gray-600">
              All products are sourced directly from farmers ensuring maximum freshness
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">🚚</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Fast Delivery</h3>
            <p className="text-gray-600">
              Quick and reliable delivery service to get products to you on time
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Best Prices</h3>
            <p className="text-gray-600">
              Direct from farmers means no middlemen and better prices for you
            </p>
          </div>
        </div>
      </div>

      {/* Latest Products Section */}
      <LatestProduct />

      {/* Call to Action */}
      <div className="bg-green-50 py-16 my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Are you a Farmer?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our platform and start selling your products directly to consumers. Get fair prices and grow your business.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Contact Us to Join
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;