import { Link } from "react-router-dom";

const ProductItem = ({ id, name, price, image, stock, farmerName }) => {
  const imageUrl = Array.isArray(image) ? image[0] : image;
  
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
            <p className="text-sm text-gray-600 mb-2 flex items-center">
              <span className="mr-1">👨‍🌾</span>
              By {farmerName}
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
