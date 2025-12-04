import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { backendurl } from '../App';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    document.body.style.overflow = 'auto';
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.post(`${backendurl}/api/product/listproduct`);
      const allProducts = response.data.products || [];
      setProducts(allProducts);
      // Get top 5-star products for featured section
      const featured = allProducts.filter(p => p.rating === 5).slice(0, 4);
      setFeaturedProducts(featured);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    
    if (categoryId === 'all') {
      // Show all 5-star products
      const featured = products.filter(p => p.rating === 5).slice(0, 4);
      setFeaturedProducts(featured);
    } else {
      // Filter by category and show high-rated products (4+ stars)
      const categoryProducts = products.filter(p => {
        const productCategory = p.category?.toLowerCase() || '';
        return productCategory.includes(categoryId) && p.rating >= 4;
      }).slice(0, 4);
      
      setFeaturedProducts(categoryProducts);
    }
  };

  const categories = [
    { id: 'all', name: 'All Products', icon: '🛒', color: 'from-green-500 to-emerald-600' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥬', color: 'from-green-400 to-green-600' },
    { id: 'fruits', name: 'Fruits', icon: '🍎', color: 'from-red-400 to-pink-600' },
    { id: 'dairy', name: 'Dairy', icon: '🥛', color: 'from-blue-400 to-cyan-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-500 to-emerald-600">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8 text-white order-2 lg:order-1">
              <div className="inline-block">
                <span className="bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                  🌱 100% Organic & Fresh
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                Farm Fresh
                <span className="block text-yellow-300 mt-2">Delivered Daily</span>
              </h1>
              
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-green-50 leading-relaxed max-w-lg">
                Get the freshest organic produce delivered straight from local farms to your doorstep. Quality guaranteed!
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2">
                <Link
                  to="/collection"
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-white text-green-600 rounded-full font-bold text-sm sm:text-base lg:text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Shop Now
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                
                <Link
                  to="/about"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-full font-bold text-sm sm:text-base lg:text-lg hover:bg-white/20 transition-all duration-300 text-center"
                >
                  Learn More
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-4 sm:pt-8">
                {[
                  { value: '500+', label: 'Products' },
                  { value: '10K+', label: 'Customers' },
                  { value: '100%', label: 'Organic' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-300">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-green-100 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="relative order-1 lg:order-2 mb-8 lg:mb-0">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800" 
                  alt="Fresh Vegetables"
                  className="w-full rounded-2xl sm:rounded-3xl shadow-2xl"
                />
              </div>
              
              {/* Floating Cards - Hidden on mobile, visible on tablet+ */}
              <div className="hidden sm:block absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl animate-float">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                    🚚
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Free Delivery</p>
                    <p className="text-sm sm:text-base font-bold text-gray-800">On orders $50+</p>
                  </div>
                </div>
              </div>

              <div className="hidden sm:block absolute -top-4 sm:-top-6 -right-4 sm:-right-6 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl animate-float animation-delay-2000">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                    ⭐
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Rating</p>
                    <p className="text-sm sm:text-base font-bold text-gray-800">4.9/5.0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">Shop by Category</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600">Browse our wide selection of fresh products</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`group relative p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl transition-all duration-300 transform hover:-translate-y-2 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-br ' + category.color + ' text-white shadow-2xl scale-105'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                }`}
              >
                <div className="text-center">
                  <div className={`text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4 transform group-hover:scale-110 transition-transform ${
                    activeCategory === category.id ? 'animate-bounce' : ''
                  }`}>
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-sm sm:text-base md:text-lg">{category.name}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-10 lg:mb-12 gap-3 sm:gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1.5 sm:mb-2">⭐ Featured Products</h2>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg">
                {activeCategory === 'all' 
                  ? 'Our highest rated 5-star products' 
                  : `Top rated ${categories.find(c => c.id === activeCategory)?.name || 'products'}`
                }
              </p>
            </div>
            <Link
              to="/collection"
              className="flex items-center gap-1.5 sm:gap-2 text-green-600 font-semibold hover:text-green-700 transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap"
            >
              View All
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 sm:py-16 md:py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 border-t-4 border-b-4 border-green-600"></div>
              <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base md:text-lg">Loading amazing products...</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 h-48 sm:h-56 md:h-64">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                      ⭐ 5.0
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center gap-1 mb-3 sm:mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl sm:text-2xl font-bold text-gray-900">${product.price}</span>
                      <button className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors shadow-lg group-hover:scale-110">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl">
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {activeCategory === 'all' 
                  ? 'No Featured Products Yet' 
                  : `No ${categories.find(c => c.id === activeCategory)?.name || 'products'} Available`
                }
              </h3>
              <p className="text-gray-600">
                {activeCategory === 'all'
                  ? 'Check back soon for our top-rated items!'
                  : 'Try selecting a different category'
                }
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {[
              { icon: '🚚', title: 'Free Delivery', desc: 'On orders over $50', color: 'from-blue-500 to-cyan-500' },
              { icon: '💰', title: 'Best Prices', desc: 'Guaranteed low prices', color: 'from-yellow-500 to-orange-500' },
              { icon: '🌱', title: '100% Organic', desc: 'Certified fresh produce', color: 'from-green-500 to-emerald-500' },
              { icon: '🔒', title: 'Secure Payment', desc: 'Safe & encrypted', color: 'from-purple-500 to-pink-500' }
            ].map((feature, index) => (
              <div key={index} className="group bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br ${feature.color} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-3xl sm:text-4xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-5 md:mb-6">📧</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 md:mb-4">Stay Updated!</h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-green-100 mb-6 sm:mb-7 md:mb-8 px-4">Subscribe to get special offers, free giveaways, and updates</p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 rounded-full border-2 border-white/20 bg-white/10 text-white placeholder-white/60 focus:border-white focus:outline-none backdrop-blur-sm text-sm sm:text-base"
            />
            <button className="px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 bg-white text-green-600 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
