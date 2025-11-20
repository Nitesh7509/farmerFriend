import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/authcontext';
import { backendurl } from '../App';
import axios from 'axios';

const FarmerDashboard = () => {
    const { user, token } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('overview');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Product form state
    const [productForm, setProductForm] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        stock: ''
    });
    const [images, setImages] = useState({
        image1: null,
        image2: null,
        image3: null
    });

    const categories = ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Organic', 'Seeds', 'Tools', 'Other'];

    useEffect(() => {
        if (activeTab === 'products') {
            fetchProducts();
        } else if (activeTab === 'orders') {
            fetchOrders();
        }
    }, [activeTab]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendurl}/api/product/farmer-products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setProducts(response.data.products);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendurl}/api/order/farmer-orders`, {
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

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const response = await axios.put(`${backendurl}/api/order/update-status`, 
                { orderId, status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                // Update the local state
                setOrders(orders.map(order => 
                    order._id === orderId ? { ...order, status: newStatus } : order
                ));
                // Refresh products to show updated stock
                if (newStatus === 'approved') {
                    fetchProducts();
                }
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleStockUpdate = async (productId) => {
        try {
            const stockInput = document.getElementById(`stock-${productId}`);
            const newStock = parseInt(stockInput.value);

            if (isNaN(newStock) || newStock < 0) {
                return;
            }

            const response = await axios.put(`${backendurl}/api/product/update-stock`,
                { productId, stock: newStock },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                // Update the local state
                setProducts(products.map(product =>
                    product._id === productId ? { ...product, stock: newStock } : product
                ));
            }
        } catch (error) {
            console.error('Error updating stock:', error);
        }
    };

    const handleInputChange = (e) => {
        setProductForm({ ...productForm, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImages({ ...images, [e.target.name]: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('name', productForm.name);
            formData.append('price', productForm.price);
            formData.append('description', productForm.description);
            formData.append('category', productForm.category);
            formData.append('stock', productForm.stock);
            
            if (images.image1) formData.append('image1', images.image1);
            if (images.image2) formData.append('image2', images.image2);
            if (images.image3) formData.append('image3', images.image3);

            const response = await axios.post(`${backendurl}/api/product/addproduct`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setProductForm({ name: '', price: '', description: '', category: '', stock: '' });
                setImages({ image1: null, image2: null, image3: null });
                document.querySelectorAll('input[type="file"]').forEach(input => input.value = '');
                fetchProducts();
            }
        } catch (error) {
            console.error('Error adding product:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-green-600 text-white p-6 shadow-md">
                <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
                <p className="mt-2">Welcome back, {user?.name}!</p>
            </div>

            <div className="max-w-7xl mx-auto py-8 px-4">
                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-md mb-6">
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-6 py-3 font-semibold ${activeTab === 'overview' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('addProduct')}
                            className={`px-6 py-3 font-semibold ${activeTab === 'addProduct' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
                        >
                            Add Product
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`px-6 py-3 font-semibold ${activeTab === 'products' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
                        >
                            My Products
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-6 py-3 font-semibold ${activeTab === 'orders' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
                        >
                            Orders
                        </button>
                    </div>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
                                <p className="text-3xl font-bold text-green-600 mt-2">{products.length}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
                                <p className="text-3xl font-bold text-blue-600 mt-2">{orders.length}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
                                <p className="text-3xl font-bold text-purple-600 mt-2">
                                    ₹{orders.reduce((sum, order) => {
                                        if (order.items && Array.isArray(order.items)) {
                                            return sum + order.items.reduce((s, item) => s + (item.price * item.quantity), 0);
                                        }
                                        return sum;
                                    }, 0).toFixed(2)}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-700">Low Stock Items</h3>
                                <p className="text-3xl font-bold text-red-600 mt-2">
                                    {products.filter(p => p.stock < 10).length}
                                </p>
                            </div>
                        </div>

                        {/* Low Stock Alert */}
                        {products.filter(p => p.stock < 10).length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <h3 className="font-semibold text-red-800 mb-2">⚠️ Low Stock Alert</h3>
                                <p className="text-red-700 text-sm mb-3">The following products have low stock (less than 10 units):</p>
                                <div className="space-y-2">
                                    {products.filter(p => p.stock < 10).map(product => (
                                        <div key={product._id} className="flex justify-between items-center bg-white rounded px-3 py-2">
                                            <span className="font-medium text-gray-800">{product.name}</span>
                                            <span className="text-red-600 font-bold">Stock: {product.stock}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Add Product Tab */}
                {activeTab === 'addProduct' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={productForm.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Price (₹)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={productForm.price}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={productForm.stock}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Category</label>
                                <select
                                    name="category"
                                    value={productForm.category}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={productForm.description}
                                    onChange={handleInputChange}
                                    required
                                    rows="4"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Image 1</label>
                                    <input
                                        type="file"
                                        name="image1"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Image 2</label>
                                    <input
                                        type="file"
                                        name="image2"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Image 3</label>
                                    <input
                                        type="file"
                                        name="image3"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
                            >
                                {loading ? 'Adding Product...' : 'Add Product'}
                            </button>
                        </form>
                    </div>
                )}

                {/* My Products Tab */}
                {activeTab === 'products' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-6">My Products</h2>
                        {loading ? (
                            <p>Loading...</p>
                        ) : products.length === 0 ? (
                            <p className="text-gray-600">No products yet. Add your first product!</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map(product => (
                                    <div key={product._id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                                        {product.image && product.image[0] && (
                                            <img src={product.image[0]} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                                        )}
                                        <h3 className="font-bold text-lg">{product.name}</h3>
                                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description}</p>
                                        <div className="mt-4 flex justify-between items-center">
                                            <span className="text-green-600 font-bold">₹{product.price}</span>
                                            <span className={`text-sm font-semibold ${product.stock < 10 ? 'text-red-600' : 'text-gray-600'}`}>
                                                Stock: {product.stock}
                                            </span>
                                        </div>
                                        <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                                            {product.category}
                                        </span>
                                        
                                        {/* Stock Management */}
                                        <div className="mt-4 pt-4 border-t">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Update Stock</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    defaultValue={product.stock}
                                                    id={`stock-${product._id}`}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                                                />
                                                <button
                                                    onClick={() => handleStockUpdate(product._id)}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                                                >
                                                    Update
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-6">Customer Orders</h2>
                        {loading ? (
                            <p>Loading...</p>
                        ) : orders.length === 0 ? (
                            <p className="text-gray-600">No orders yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {orders.map(order => (
                                    <div key={order._id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold">Order #{order._id.slice(-8)}</h3>
                                                <p className="text-sm text-gray-600">Customer: {order.userId?.name}</p>
                                                <p className="text-sm text-gray-600">Email: {order.userId?.email}</p>
                                                <p className="text-sm text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                                                    order.status === 'approved' ? 'bg-blue-100 text-blue-600' :
                                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="approved">Approved</option>
                                                    <option value="delivered">Delivered</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="border-t pt-4">
                                            <h4 className="font-semibold mb-2">Products:</h4>
                                            {order.items && Array.isArray(order.items) && order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                                    <div>
                                                        <p className="font-medium">{item.productId?.name || 'Product'}</p>
                                                        <p className="text-sm text-gray-600">Category: {item.productId?.category || 'N/A'}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold">₹{item.price} × {item.quantity}</p>
                                                        <p className="text-sm text-gray-600">Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FarmerDashboard;
