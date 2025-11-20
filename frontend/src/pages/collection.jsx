import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../contexts/shopcontext";
import ProductItem from "../components/productitem";

const Collection = () => {
  const { products, searchQuery, searchResult } = useContext(ShopContext);
  const [filter, setFilter] = useState([]);
  const [category, setCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  const categories = [
    { value: "vegetables", label: "Vegetables", icon: "🥬" },
    { value: "fruits", label: "Fruits", icon: "🍎" },
    { value: "grains", label: "Grains", icon: "🌾" },
    { value: "dairy", label: "Dairy", icon: "🥛" },
    { value: "spices", label: "Spices", icon: "🌶️" },
    { value: "herbs", label: "Herbs", icon: "🌿" },
    { value: "seeds", label: "Seeds", icon: "🌱" },
    { value: "pulses", label: "Pulses", icon: "🫘" }
  ];

  const toggleFilter = (value) => {
    if (category.includes(value)) {
      setCategory(category.filter((item) => item !== value));
    } else {
      setCategory([...category, value]);
    }
  };

  const applyFilter = () => {
    let productFilter = [...products];

    // Apply search filter
    if (searchQuery && searchResult) {
      productFilter = productFilter.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (category.length > 0) {
      productFilter = productFilter.filter((product) =>
        category.some(cat => cat.toLowerCase() === product.category?.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortType) {
      case "low-high":
        productFilter.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        productFilter.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilter(productFilter);
  };

  useEffect(() => {
    setFilter(products);
  }, [products]);

  useEffect(() => {
    applyFilter();
  }, [category, searchQuery, searchResult, sortType, products]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-2">🔍</span> Filters
              </h2>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-4 text-lg">Categories</h3>
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <label
                      key={cat.value}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        value={cat.value}
                        checked={category.includes(cat.value)}
                        onChange={() => toggleFilter(cat.value)}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-xl">{cat.icon}</span>
                      <span className="text-gray-700">{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {category.length > 0 && (
                <button
                  onClick={() => setCategory([])}
                  className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:w-3/4">
            {/* Header with Sort */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Our Collection
                </h1>
                <p className="text-gray-600 mt-1">
                  {filter.length} {filter.length === 1 ? 'product' : 'products'} found
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-gray-700 font-medium">Sort by:</label>
                <select
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="relevant">Relevant</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filter.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filter.map((product) => (
                  <ProductItem
                    key={product._id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    id={product._id}
                    stock={product.stock}
                    farmerName={product.farmerId?.name}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
