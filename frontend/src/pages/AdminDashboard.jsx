import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/authcontext';
import { backendurl } from '../App';
import axios from 'axios';

const AdminDashboard = () => {
    const { user, token } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [farmers, setFarmers] = useState([]);
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [farmerDetails, setFarmerDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        } else if (activeTab === 'farmers') {
            fetchFarmers();
        }
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${backendurl}/api/user/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendurl}/api/user/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setUsers(response.data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFarmers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendurl}/api/user/admin/farmers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setFarmers(response.data.farmers);
            }
        } catch (error) {
            console.error('Error fetching farmers:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFarmerDetails = async (farmerId) => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendurl}/api/user/admin/farmer/${farmerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setFarmerDetails(response.data);
                setSelectedFarmer(farmerId);
            }
        } catch (error) {
            console.error('Error fetching farmer details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
            return;
        }

        try {
            const response = await axios.delete(`${backendurl}/api/user/admin/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                fetchUsers();
                fetchStats();
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleDeleteFarmer = async (farmerId, farmerName) => {
        if (!window.confirm(`Are you sure you want to delete farmer "${farmerName}"? This will also delete all their products.`)) {
            return;
        }

        try {
            const response = await axios.delete(`${backendurl}/api/user/admin/user/${farmerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                fetchFarmers();
                fetchStats();
                setSelectedFarmer(null);
                setFarmerDetails(null);
            }
        } catch (error) {
            console.error('Error deleting farmer:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-indigo-600 text-white p-6 shadow-md">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="mt-2">Welcome, {user?.name || 'Administrator'}!</p>
            </div>

            <div className="max-w-7xl mx-auto py-8 px-4">
                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-md mb-6">
                    <div className="flex border-b overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600'}`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === 'users' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600'}`}
                        >
                            Manage Users
                        </button>
                        <button
                            onClick={() => setActiveTab('farmers')}
                            className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === 'farmers' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600'}`}
                        >
                            Manage Farmers
                        </button>
                    </div>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div>
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-2xl font-bold mb-4">Platform Overview</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                                    <p className="text-3xl font-bold text-indigo-600">{stats?.totalUsers || 0}</p>
                                    <p className="text-gray-600 mt-2">Total Users</p>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <p className="text-3xl font-bold text-green-600">{stats?.totalFarmers || 0}</p>
                                    <p className="text-gray-600 mt-2">Total Farmers</p>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <p className="text-3xl font-bold text-blue-600">{stats?.totalProducts || 0}</p>
                                    <p className="text-gray-600 mt-2">Total Products</p>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <p className="text-3xl font-bold text-purple-600">₹{stats?.totalRevenue?.toFixed(2) || 0}</p>
                                    <p className="text-gray-600 mt-2">Total Revenue</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
                        {loading ? (
                            <p>Loading...</p>
                        ) : users.length === 0 ? (
                            <p className="text-gray-600">No users found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {users.map(user => (
                                            <tr key={user._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleDeleteUser(user._id, user.name)}
                                                        className="text-red-600 hover:text-red-800 font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Farmers Tab */}
                {activeTab === 'farmers' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Farmers List */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold mb-6">Manage Farmers</h2>
                            {loading && !farmerDetails ? (
                                <p>Loading...</p>
                            ) : farmers.length === 0 ? (
                                <p className="text-gray-600">No farmers found.</p>
                            ) : (
                                <div className="space-y-4">
                                    {farmers.map(farmer => (
                                        <div
                                            key={farmer._id}
                                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                                selectedFarmer === farmer._id ? 'border-indigo-600 bg-indigo-50' : 'hover:border-gray-400'
                                            }`}
                                            onClick={() => fetchFarmerDetails(farmer._id)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-lg">{farmer.name}</h3>
                                                    <p className="text-sm text-gray-600">{farmer.email}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Joined: {new Date(farmer.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteFarmer(farmer._id, farmer.name);
                                                    }}
                                                    className="text-red-600 hover:text-red-800 font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Farmer Details */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold mb-6">Farmer Details</h2>
                            {loading && selectedFarmer ? (
                                <p>Loading details...</p>
                            ) : !farmerDetails ? (
                                <p className="text-gray-600">Select a farmer to view details</p>
                            ) : (
                                <div className="space-y-6">
                                    {/* Farmer Info */}
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">Information</h3>
                                        <p><span className="font-medium">Name:</span> {farmerDetails.farmer.name}</p>
                                        <p><span className="font-medium">Email:</span> {farmerDetails.farmer.email}</p>
                                    </div>

                                    {/* Products */}
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">Products ({farmerDetails.products.length})</h3>
                                        {farmerDetails.products.length === 0 ? (
                                            <p className="text-gray-600 text-sm">No products</p>
                                        ) : (
                                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                                {farmerDetails.products.map(product => (
                                                    <div key={product._id} className="border rounded p-2 text-sm">
                                                        <p className="font-medium">{product.name}</p>
                                                        <p className="text-gray-600">₹{product.price} | Stock: {product.stock}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Orders */}
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">Orders ({farmerDetails.orders.length})</h3>
                                        {farmerDetails.orders.length === 0 ? (
                                            <p className="text-gray-600 text-sm">No orders</p>
                                        ) : (
                                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                                {farmerDetails.orders.map(order => (
                                                    <div key={order._id} className="border rounded p-2 text-sm">
                                                        <p className="font-medium">Order #{order._id.slice(-8)}</p>
                                                        <p className="text-gray-600">
                                                            Customer: {order.userId?.name} | ₹{order.totalAmount}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Status: {order.status} | {new Date(order.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
