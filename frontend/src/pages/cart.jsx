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
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
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

  const handleCheckout = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    setShowCheckoutForm(true);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert('Razorpay SDK failed to load. Please check your internet connection.');
      return;
    }

    try {
      setLoading(true);

      // Create Razorpay order
      const orderResponse = await axios.post(
        `${backendurl}/api/payment/create-order`,
        { amount: total },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { order, key } = orderResponse.data;

      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: 'FarmerFriend',
        description: 'Order Payment',
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await axios.post(
              `${backendurl}/api/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyResponse.data.success) {
              // Create order after successful payment
              await createOrder('Razorpay', 'paid');
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#16a34a',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (paymentMethodType, paymentStatus = 'pending') => {
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
        paymentMethod: paymentMethodType,
        paymentStatus: paymentStatus
      };

      const response = await axios.post(`${backendurl}/api/order/create`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setCart({});
        setShowCheckoutForm(false);
        navigate('/home');
        alert('Order placed successfully!');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      alert('Please fill in all address fields');
      return;
    }

    if (paymentMethod === 'Razorpay') {
      await handleRazorpayPayment();
    } else {
      await createOrder('Cash on Delivery', 'pending');
    }
  };

  if (cartData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">🛒</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link
            to="/collection"
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-block"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartData.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row gap-4"
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
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

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
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-3"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/collection"
                className="block w-full text-center bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>
                  <button
                    onClick={() => setShowCheckoutForm(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handlePlaceOrder}>
                  <div className="space-y-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-700">Shipping Address</h3>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Street Address</label>
                      <input
                        type="text"
                        value={shippingAddress.street}
                        onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                        placeholder="Enter your street address"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">City</label>
                        <input
                          type="text"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                          placeholder="City"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">State</label>
                        <input
                          type="text"
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                          placeholder="State"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">ZIP Code</label>
                        <input
                          type="text"
                          value={shippingAddress.zipCode}
                          onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                          placeholder="ZIP Code"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Country</label>
                        <input
                          type="text"
                          value={shippingAddress.country}
                          onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                          placeholder="Country"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Order Summary</h3>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-semibold">{currency}{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery:</span>
                        <span className="font-semibold">{currency}{deliveryCharge}</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t">
                        <span>Total:</span>
                        <span className="text-green-600">{currency}{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Payment Method</h3>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Razorpay"
                          checked={paymentMethod === 'Razorpay'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4 text-green-600"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-800">Pay Online (Razorpay)</span>
                            <span className="text-2xl">💳</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Credit/Debit Card, UPI, Net Banking</p>
                        </div>
                      </label>

                      <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="COD"
                          checked={paymentMethod === 'COD'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4 text-green-600"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-800">Cash on Delivery</span>
                            <span className="text-2xl">💵</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Pay when you receive the order</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowCheckoutForm(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400"
                    >
                      {loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </div>
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
