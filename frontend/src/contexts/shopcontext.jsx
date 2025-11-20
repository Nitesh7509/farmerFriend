import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { backendurl } from "../App";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const deliveryCharge = 50;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(false);
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = await axios.post(`${backendurl}/api/product/listproduct`);
      if (response.data.success) {
        setProducts(response.data.product);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addtocard = (itemsid, quantity = 1) => {
    const carddata = structuredClone(cart);
    if (carddata[itemsid]) {
      carddata[itemsid] += quantity;
    } else {
      carddata[itemsid] = quantity;
    }
    setCart(carddata);
  };

  const updateQuantity = (itemsid, quantity) => {
    const carddata = structuredClone(cart);
    if (quantity <= 0) {
      delete carddata[itemsid];
    } else {
      carddata[itemsid] = quantity;
    }
    setCart(carddata);
  };

  const removeFromCart = (itemsid) => {
    const carddata = structuredClone(cart);
    delete carddata[itemsid];
    setCart(carddata);
  };

  const getCartCount = () => {
    let count = 0;
    for (const item in cart) {
      count += cart[item];
    }
    return count;
  };

  const getCartTotal = () => {
    let total = 0;
    for (const item in cart) {
      const product = products.find((p) => p._id === item);
      if (product) {
        total += product.price * cart[item];
      }
    }
    return total;
  };

  const value = {
    products,
    currency,
    deliveryCharge,
    searchQuery,
    setSearchQuery,
    searchResult,
    setSearchResult,
    cart,
    setCart,
    addtocard,
    updateQuantity,
    removeFromCart,
    getCartCount,
    getCartTotal,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
