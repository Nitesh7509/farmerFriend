

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            About FarmerFriend
          </h1>
          <p className="text-xl text-center max-w-3xl mx-auto">
            Connecting farmers directly with consumers for fresh, quality agricultural products
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-gray-600 text-lg mb-4">
              FarmerFriend is dedicated to empowering farmers by providing them with a direct platform to sell their produce to consumers. We eliminate middlemen, ensuring farmers get fair prices and consumers receive fresh, quality products.
            </p>
            <p className="text-gray-600 text-lg">
              Our platform bridges the gap between rural farmers and urban consumers, creating a sustainable ecosystem that benefits everyone involved.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img 
              src="https://i.pinimg.com/736x/7d/6e/7b/7d6e7b52395cfd95fe3e9ae60a66bd54.jpg" 
              alt="Farmers" 
              className="w-full h-96 object-cover"
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-xl font-bold mb-3 text-green-700">Sustainability</h3>
              <p className="text-gray-600">
                Promoting sustainable farming practices and reducing environmental impact through direct trade.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-3 text-green-700">Fair Trade</h3>
              <p className="text-gray-600">
                Ensuring farmers receive fair compensation for their hard work and quality produce.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-3 text-green-700">Quality</h3>
              <p className="text-gray-600">
                Delivering fresh, high-quality agricultural products directly from farm to table.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
            <div className="text-gray-600">Registered Farmers</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">10,000+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
            <div className="text-gray-600">Product Categories</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
            <div className="text-gray-600">Fresh Products</div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">🚜</div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-green-700">Direct from Farmers</h3>
                <p className="text-gray-600">
                  Buy directly from farmers, ensuring freshness and supporting local agriculture.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-3xl">💰</div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-green-700">Best Prices</h3>
                <p className="text-gray-600">
                  No middlemen means better prices for both farmers and consumers.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-3xl">🌾</div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-green-700">Wide Variety</h3>
                <p className="text-gray-600">
                  Access to diverse agricultural products from vegetables to grains and more.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-3xl">📦</div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-green-700">Fast Delivery</h3>
                <p className="text-gray-600">
                  Quick and reliable delivery to ensure products reach you fresh.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;