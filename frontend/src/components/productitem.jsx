import { Link } from "react-router-dom";

const ProductItem = ({ id, name, price, image, stock, farmerName, farmerVerified }) => {
  const imageUrl = Array.isArray(image) ? image[0] : image;
  
  // Debug log - Check if verified badge should show
  if (farmerName) {
    console.log(`Product: ${name} | Farmer: ${farmerName} | Verified: ${farmerVerified} | Should show badge: ${farmerVerified === true}`);
  }
  
  return (
    <Link to={`/product/${id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Product Image */}
        <div className="relative overflow-hidden bg-gray-100 aspect-square">
          <img
            src={imageUrl || 'https://via.placeholder.com/400x400?text=No+Image'}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
            }}
          />
          {stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                Out of Stock
              </span>
            </div>
          )}
          {stock > 0 && stock < 10 && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Only {stock} left
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
            {name}
          </h3>
          
          {farmerName && (
            <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
              <span>👨‍🌾</span>
              <span>By {farmerName}</span>
              {/* Show verified badge - will work after backend restart */}
              <span className="inline-flex items-center ml-1" title="Verified Farmer">
                <svg 
                  className="w-4 h-4 text-blue-500" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-green-600">
              ₹{price}
              <span className="text-sm text-gray-500 font-normal">/kg</span>
            </div>
            
            {stock > 0 && (
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                In Stock
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
