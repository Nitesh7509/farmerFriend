import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../contexts/shopcontext";
import { AuthContext } from "../contexts/authcontext";
import { backendurl } from "../App";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const { 
    products, 
    currency, 
    cart, 
    updateQuantity, 
    removeFromCart, 
    deliveryCharge,
    getCartTotal,
    setCart
  } = useContext(ShopContext);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    phone: ''
  });

  useEffect(() => {
    const cartProducts = [];

    for (const id in cart) {
      if (cart[id] > 0) {
        const product = products.find((item) => item._id === id);
        if (product) {
          cartProducts.push({
            ...product,
            quantity: cart[id],
          });
        }
      }
    }

    setCartData(cartProducts);
  }, [cart, products]);

  const subtotal = getCartTotal();
  const total = subtotal + (subtotal > 0 ? deliveryCharge : 0);

  const handleCheckout = () => {
    if (!token) {
      navigate('/login');
      return;
    }
    setShowCheckoutForm(true);
  };

  const createOrder = async () => {
    try {
      setLoading(true);

      const items = cartData.map(item => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price
      }));

      const orderData = {
        items,
        totalAmount: total,
        shippingAddress,
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'pending'
      };

      const response = await axios.post(`${backendurl}/api/order/create`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setCart({});
        setShowCheckoutForm(false);
        navigate('/success');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.phone) {
      alert('Please fill in all required fields');
      return;
    }

    createOrder();
  };

  if (cartData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl shadow-xl p-12">
          <div className="text-8xl mb-6 animate-bounce-slow">🛒</div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8 text-lg">Discover fresh products from local farms!</p>
          <Link
            to="/collection"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Browse Products
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">🛒 Shopping Cart</h1>
        <p className="text-gray-600 mb-8">Review your items and proceed to checkout</p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartData.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col sm:flex-row gap-4 border border-gray-100"
              >
                {/* Product Image */}
                <Link to={`/product/${item._id}`} className="flex-shrink-0">
                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className="w-32 h-32 object-cover rounded-lg hover:scale-105 transition-transform"
                  />
                </Link>

                {/* Product Details */}
                <div className="flex-grow">
                  <Link to={`/product/${item._id}`}>
                    <h3 className="text-xl font-semibold text-gray-800 hover:text-green-600 transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                  <p className="text-green-600 font-bold text-lg mt-2">
                    {currency}{item.price}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                    >
                      <span>🗑️</span> Remove
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="text-sm text-gray-600">Item Total</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {currency}{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">💰 Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartData.length} items)</span>
                  <span className="font-semibold">{currency}{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span className="font-semibold">
                    {subtotal > 0 ? `${currency}${deliveryCharge}` : `${currency}0`}
                  </span>
                </div>

                {subtotal >= 500 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-700 text-sm font-medium">
                      🎉 You're eligible for free delivery on orders above ₹500!
                    </p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-800">
                    <span>Total</span>
                    <span className="text-green-600">{currency}{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 mb-3 shadow-lg"
              >
                Proceed to Checkout →
              </button>

              <Link
                to="/collection"
                className="block w-full text-center bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:border-green-500 hover:text-green-600 transition-all"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-xl">✅</span>
                  <span>100% Fresh Products</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-xl">🚚</span>
                  <span>Fast & Reliable Delivery</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-xl">💰</span>
                  <span>Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Form Modal */}
        {showCheckoutForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 overflow-y-auto">
            <div className="min-h-screen flex items-center justify-center p-4 py-8">
              <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 relative">
              <div className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 p-6 rounded-t-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                </div>
                <div className="relative flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-white">Complete Your Order</h2>
                    <p className="text-green-100 mt-1">🌱 Just one step away from fresh products!</p>
                  </div>
                  <button
                    onClick={() => setShowCheckoutForm(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center transition-colors text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              <form onSubmit={handlePlaceOrder} className="p-8">
                {/* Delivery Address Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">📍</span>
                    <h3 className="text-xl font-bold text-gray-800">Delivery Address</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.street}
                        onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                        placeholder="House no., Building name, Street"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                          placeholder="Enter city"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          State <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                          placeholder="Enter state"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          PIN Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.zipCode}
                          onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                          required
                          pattern="[0-9]{6}"
                          maxLength="6"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                          placeholder="6-digit PIN code"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={shippingAddress.phone}
                          onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                          required
                          pattern="[0-9]{10}"
                          maxLength="10"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                          placeholder="10-digit mobile number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Country</label>
                      <input
                        type="text"
                        value={shippingAddress.country}
                        readOnly
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Order Summary Section */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border-2 border-green-100">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">📦</span>
                    <h3 className="text-xl font-bold text-gray-800">Order Summary</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-700">
                      <span className="font-medium">Items ({cartData.length})</span>
                      <span className="font-semibold">{currency}{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span className="font-medium">Delivery Charges</span>
                      <span className="font-semibold">{currency}{deliveryCharge}</span>
                    </div>
                    <div className="border-t-2 border-green-200 pt-3 flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-800">Total Amount</span>
                      <span className="text-2xl font-bold text-green-600">{currency}{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Method Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">💵</span>
                    <h3 className="text-xl font-bold text-gray-800">Payment Method</h3>
                  </div>
                  
                  <div className="bg-white border-3 border-green-500 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-green-100 rounded-full p-3">
                          <span className="text-3xl">💰</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-lg">Cash on Delivery</h4>
                          <p className="text-gray-600 text-sm mt-1">Pay when you receive your order</p>
                        </div>
                      </div>
                      <div className="bg-green-500 text-white rounded-full p-2">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-green-800 text-sm font-medium">✓ No advance payment required</p>
                      <p className="text-green-700 text-sm mt-1">✓ Inspect products before payment</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowCheckoutForm(false)}
                    className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    ← Go Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Place Order 🎉
                      </span>
                    )}
                  </button>
                </div>

                <p className="text-center text-gray-500 text-sm mt-4">
                  By placing this order, you agree to our terms and conditions
                </p>
              </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
