import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/authcontext';
import { backendurl } from '../App';
import axios from 'axios';

const Orders = () => {
    const { token } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, [token]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendurl}/api/order/user-orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter orders based on status
    const filteredOrders = statusFilter === 'all' 
        ? orders 
        : orders.filter(order => order.status === statusFilter);

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-600';
            case 'approved':
                return 'bg-blue-100 text-blue-600';
            case 'shipped':
                return 'bg-indigo-100 text-indigo-600';
            case 'processing':
                return 'bg-purple-100 text-purple-600';
            case 'pending':
                return 'bg-yellow-100 text-yellow-600';
            case 'cancelled':
                return 'bg-red-100 text-red-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    if (!loading && orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-8xl mb-4">📦</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">No Orders Yet</h2>
                    <p className="text-gray-600 mb-8">Start shopping to see your orders here!</p>
                    <a
                        href="/collection"
                        className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-block"
                    >
                        Browse Products
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
                            <p className="text-gray-600 mt-2">Track and manage your orders ({orders.length} total)</p>
                        </div>
                        
                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            <label className="text-gray-700 font-medium">Filter:</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            >
                                <option value="all">All Orders</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            No orders found
                        </h3>
                        <p className="text-gray-600">
                            {statusFilter !== 'all' ? `No ${statusFilter} orders found. Try changing the filter.` : 'You have no orders yet.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                        <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            {/* Order Header */}
                            <div className="bg-gray-50 px-6 py-4 border-b">
                                <div className="flex flex-wrap justify-between items-center gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Order ID</p>
                                        <p className="font-semibold text-gray-800">#{order._id.slice(-8).toUpperCase()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Order Date</p>
                                        <p className="font-semibold text-gray-800">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Amount</p>
                                        <p className="font-bold text-green-600 text-lg">₹{order.totalAmount.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="px-6 py-4">
                                <h3 className="font-semibold text-gray-800 mb-4">Order Items</h3>
                                <div className="space-y-4">
                                    {order.items && Array.isArray(order.items) && order.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 pb-4 border-b last:border-b-0">
                                            {item.productId?.image && item.productId.image[0] && (
                                                <img
                                                    src={item.productId.image[0]}
                                                    alt={item.productId.name}
                                                    className="w-20 h-20 object-cover rounded-lg"
                                                />
                                            )}
                                            <div className="flex-grow">
                                                <h4 className="font-semibold text-gray-800">
                                                    {item.productId?.name || 'Product'}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    Category: {item.productId?.category || 'N/A'}
                                                </p>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="text-sm text-gray-600">
                                                        Quantity: <span className="font-semibold">{item.quantity}</span>
                                                    </span>
                                                    <span className="text-sm text-gray-600">
                                                        Price: <span className="font-semibold">₹{item.price}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">Item Total</p>
                                                <p className="font-bold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping Address */}
                            {order.shippingAddress && (
                                <div className="px-6 py-4 bg-gray-50 border-t">
                                    <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
                                    <p className="text-gray-600 text-sm">
                                        {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                                    </p>
                                </div>
                            )}

                            {/* Payment Info */}
                            <div className="px-6 py-4 border-t">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-600">Payment Method</p>
                                        <p className="font-semibold text-gray-800">{order.paymentMethod || 'Cash on Delivery'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Payment Status</p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                            order.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' : 
                                            order.paymentStatus === 'failed' ? 'bg-red-100 text-red-600' : 
                                            'bg-yellow-100 text-yellow-600'
                                        }`}>
                                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
