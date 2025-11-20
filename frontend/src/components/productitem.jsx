import { useContext } from 'react';
import { ShopContext } from '../contexts/shopcontext';
import { Link } from 'react-router-dom';

const ProductItem = ({ name, price, image, id, stock, farmerName }) => {
  const { currency, addtocard } = useContext(ShopContext);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (stock > 0) {
      addtocard(id, 1);
    }
  };

  return (
    <Link to={`/product/${id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
        <div className="relative overflow-hidden">
          <img
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
            src={image[0]}
            alt={name}
          />
          {stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">OUT OF STOCK</span>
            </div>
          )}
          {stock > 0 && (
            <button
              onClick={handleQuickAdd}
              className="absolute bottom-4 right-4 bg-green-600 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-green-700"
              title="Quick Add to Cart"
            >
              🛒
            </button>
          )}
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 h-14">
            {name}
          </h2>
          
          {/* Farmer Name */}
          {farmerName && (
            <div className="mb-2">
              <p className="text-xs text-blue-600 font-medium">
                👨‍🌾 By {farmerName}
              </p>
            </div>
          )}
          
          <div className="flex items-center justify-between mb-2">
            <p className="text-xl font-bold text-green-600">
              {currency}{price}
            </p>
            <span className="text-sm text-gray-500">per unit</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm text-gray-600">Stock:</span>
            <span className={`text-sm font-semibold ${
              stock === 0 ? 'text-red-600' : 
              stock < 10 ? 'text-orange-600' : 
              'text-green-600'
            }`}>
              {stock === 0 ? 'Out of Stock' : `${stock} available`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;