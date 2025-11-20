import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../contexts/shopcontext';
import { AuthContext } from '../contexts/authcontext';
import axios from 'axios';
import { backendurl } from '../App';
import Toast from '../components/Toast';

const Product = () => {
  const { productid } = useParams();
  const { products, addtocard, currency } = useContext(ShopContext);
  const { user, token } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [feedbacks, setFeedbacks] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [toast, setToast] = useState(null);
  const [showAllFeedbacks, setShowAllFeedbacks] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const navigate = useNavigate();

  // Calculate average rating
  const averageRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length).toFixed(1)
    : 0;

  useEffect(() => {
    const foundProduct = products.find((item) => item._id === productid);
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedImage(foundProduct.image[0]);
    }
    fetchFeedbacks();
  }, [productid, products]);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`${backendurl}/api/feedback/product/${productid}`);
      if (response.data.success) {
        setFeedbacks(response.data.feedbacks);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setToast({ message: 'Please login to submit feedback', type: 'error' });
      return;
    }

    if (!comment.trim()) {
      setToast({ message: 'Please enter a comment', type: 'error' });
      return;
    }

    try {
      const response = await axios.post(
        `${backendurl}/api/feedback/create`,
        {
          productId: productid,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setToast({ message: 'Feedback submitted successfully!', type: 'success' });
        setComment('');
        setRating(5);
        fetchFeedbacks();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit feedback';
      setToast({ message: errorMessage, type: 'error' });
    }
  };

  const handleLikeFeedback = async (feedbackId) => {
    if (!token) {
      setToast({ message: 'Please login to like feedback', type: 'error' });
      return;
    }

    try {
      await axios.post(
        `${backendurl}/api/feedback/like/${feedbackId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchFeedbacks();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to like feedback';
      setToast({ message: errorMessage, type: 'error' });
    }
  };

  const handleReplySubmit = async (feedbackId) => {
    if (!token) {
      setToast({ message: 'Please login to reply', type: 'error' });
      return;
    }

    if (!replyText.trim()) {
      setToast({ message: 'Please enter a reply', type: 'error' });
      return;
    }

    try {
      const response = await axios.post(
        `${backendurl}/api/feedback/reply/${feedbackId}`,
        { comment: replyText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setToast({ message: 'Reply added successfully!', type: 'success' });
        setReplyText('');
        setReplyingTo(null);
        fetchFeedbacks();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add reply';
      setToast({ message: errorMessage, type: 'error' });
    }
  };

  const displayedFeedbacks = showAllFeedbacks ? feedbacks : feedbacks.slice(0, 10);

  const handleAddToCart = () => {
    if (product.stock === 0) {
      return;
    }
    if (quantity > product.stock) {
      return;
    }
    addtocard(product._id, quantity);
  };

  const handleBuyNow = () => {
    if (product.stock === 0) {
      return;
    }
    if (quantity > product.stock) {
      return;
    }
    addtocard(product._id, quantity);
    navigate('/cart');
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div>
              {/* Main Image */}
              <div className="mb-4 rounded-lg overflow-hidden border-2 border-gray-200 relative">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
                {/* Average Rating Badge */}
                {feedbacks.length > 0 && (
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-gray-800">{averageRating}</span>
                      <span className="text-xs text-gray-600">{feedbacks.length} {feedbacks.length === 1 ? 'review' : 'reviews'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.image.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.image.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === img
                          ? 'border-green-600 scale-105'
                          : 'border-gray-200 hover:border-green-400'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <div className="flex-grow">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {product.name}
                </h1>

                {/* Category Badge */}
                {product.category && (
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                    {product.category}
                  </span>
                )}

                {/* Farmer Info */}
                {product.farmerId && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Sold by:</span>{' '}
                      <span className="text-blue-700 font-medium">{product.farmerId.name}</span>
                    </p>
                  </div>
                )}

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-green-600">
                    {currency}{product.price}
                  </span>
                  <span className="text-gray-600 ml-2">per unit</span>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description || 'Fresh and high-quality product directly from farmers.'}
                  </p>
                </div>

                {/* Stock Status */}
                {product.stock !== undefined && (
                  <div className="mb-6">
                    {product.stock > 0 ? (
                      <p className="text-green-600 font-medium flex items-center gap-2">
                        <span>✅</span> In Stock ({product.stock} available)
                      </p>
                    ) : (
                      <p className="text-red-600 font-medium flex items-center gap-2">
                        <span>❌</span> Out of Stock
                      </p>
                    )}
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={product.stock === 0}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          setQuantity(Math.min(Math.max(1, val), product.stock || 1));
                        }}
                        disabled={product.stock === 0}
                        className="w-16 text-center py-2 font-semibold focus:outline-none disabled:bg-gray-100"
                        min="1"
                        max={product.stock}
                      />
                      <button
                        onClick={() => setQuantity(Math.min(quantity + 1, product.stock))}
                        disabled={product.stock === 0 || quantity >= product.stock}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-gray-600">
                      Total: <span className="font-bold text-green-600">{currency}{(product.price * quantity).toFixed(2)}</span>
                    </span>
                  </div>
                  {quantity >= product.stock && product.stock > 0 && (
                    <p className="text-orange-600 text-sm mt-2">Maximum available quantity selected</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <span>🛒</span> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
                </button>
              </div>

              {/* Product Features */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-xl">🌱</span>
                  <span>100% Fresh & Organic</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-xl">🚚</span>
                  <span>Fast Delivery Available</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-xl">🔄</span>
                  <span>Easy Returns & Refunds</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="p-8 border-t">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Feedback</h2>

            {/* Submit Feedback Form */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Share Your Experience</h3>
              <form onSubmit={handleSubmitFeedback}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-3xl transition-transform hover:scale-110"
                      >
                        {star <= rating ? '⭐' : '☆'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Your Feedback</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this product..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    rows="4"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Submit Feedback
                </button>
              </form>
            </div>

            {/* Display Feedbacks */}
            <div className="space-y-4">
              {feedbacks.length > 0 ? (
                <>
                  {displayedFeedbacks.map((feedback) => (
                    <div key={feedback._id} className="bg-white p-6 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">{feedback.userId?.name || 'Anonymous'}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-yellow-500">
                                {i < feedback.rating ? '⭐' : '☆'}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-3">{feedback.comment}</p>

                      {/* Like and Reply Buttons */}
                      <div className="flex items-center gap-4 mt-4">
                        <button
                          onClick={() => handleLikeFeedback(feedback._id)}
                          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <span className={feedback.likes?.includes(user?.id || user?._id) ? 'text-blue-600' : ''}>
                            👍
                          </span>
                          <span className="text-sm">{feedback.likes?.length || 0}</span>
                        </button>
                        <button
                          onClick={() => setReplyingTo(replyingTo === feedback._id ? null : feedback._id)}
                          className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                        >
                          💬 Reply
                        </button>
                      </div>

                      {/* Reply Form */}
                      {replyingTo === feedback._id && (
                        <div className="mt-4 pl-4 border-l-2 border-gray-200">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your reply..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                            rows="2"
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleReplySubmit(feedback._id)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                            >
                              Submit Reply
                            </button>
                            <button
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText('');
                              }}
                              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-400 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Display Replies */}
                      {feedback.replies && feedback.replies.length > 0 && (
                        <div className="mt-4 pl-4 border-l-2 border-green-200 space-y-3">
                          {feedback.replies.map((reply) => (
                            <div key={reply._id} className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-start justify-between">
                                <p className="font-semibold text-sm text-gray-800">
                                  {reply.userId?.name || 'Anonymous'}
                                </p>
                                <span className="text-xs text-gray-500">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm mt-1">{reply.comment}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* See More Button */}
                  {feedbacks.length > 10 && (
                    <div className="text-center pt-4">
                      <button
                        onClick={() => setShowAllFeedbacks(!showAllFeedbacks)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        {showAllFeedbacks ? 'Show Less' : `See More (${feedbacks.length - 10} more)`}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-center py-8">No feedback yet. Be the first to share your experience!</p>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Product;