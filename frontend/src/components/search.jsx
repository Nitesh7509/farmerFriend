import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../contexts/shopcontext";
import { useLocation } from "react-router-dom";

const Search = () => {
  const { searchQuery, setSearchQuery, searchResult, setSearchResult } =
    useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("/collection")) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  const handleClear = () => {
    setSearchQuery("");
    setSearchResult(false);
  };

  return searchResult && visible ? (
    <div className="flex justify-center items-center py-6 px-4 bg-gradient-to-r from-green-50 to-blue-50">
      <div className="relative w-full max-w-2xl">
        <div className="flex items-center bg-white rounded-full shadow-lg border-2 border-green-200 hover:border-green-400 transition-all duration-300 overflow-hidden">
          {/* Search Icon */}
          <div className="pl-5 pr-3">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Input Field */}
          <input
            className="flex-1 py-3 px-2 text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
            type="text"
            placeholder="Search for fresh products, vegetables, fruits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />

          {/* Clear Button */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="px-3 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {/* Close Search Button */}
          <button
            onClick={handleClear}
            className="px-5 py-3 bg-green-600 text-white hover:bg-green-700 transition-colors"
            aria-label="Close search"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Search Hint */}
        {searchQuery && (
          <div className="absolute top-full mt-2 left-0 right-0 text-center">
            <p className="text-sm text-gray-600">
              Searching for: <span className="font-semibold text-green-700">{searchQuery}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default Search;
