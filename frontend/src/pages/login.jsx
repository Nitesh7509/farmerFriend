import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { backendurl } from "../App";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authcontext";
import { Link } from "react-router-dom";
import Toast from "../components/Toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      
      if (role === "admin") {
        response = await axios.post(`${backendurl}/api/user/adminlogin`, {
          email,
          password
        });
      } else {
        response = await axios.post(`${backendurl}/api/user/login`, {
          email,
          password,
          role
        });
      }

      login(response.data.user, response.data.role, response.data.token);

      if (response.data.role === "farmer") {
        navigate("/farmer-dashboard");
      } else if (response.data.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Please enter a valid email and password.";
      setToast({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="h-full overflow-y-auto scrollbar-hide">
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
              {/* Left Side - Branding */}
              <div className="hidden lg:block">
                <div className="space-y-6">
                  <div className="inline-block">
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      FarmerFriend
                    </h1>
                  </div>
                  <p className="text-2xl text-gray-700 font-light">
                    Welcome back! Login to access fresh, organic products directly from local farmers.
                  </p>
                  <div className="space-y-4 pt-8">
                    {[
                      { icon: '🌱', text: '100% Organic Products' },
                      { icon: '🚚', text: 'Fast & Reliable Delivery' },
                      { icon: '💰', text: 'Best Prices Guaranteed' }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                          {feature.icon}
                        </div>
                        <span className="text-lg text-gray-700">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Login Form */}
              <div className="relative">
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                    <p className="text-gray-600">Sign in to your account</p>
                  </div>

                  <form onSubmit={submitHandler} className="space-y-6">
                    {/* Role Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Login As
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'user', label: 'User', icon: '👤' },
                          { value: 'farmer', label: 'Farmer', icon: '👨‍🌾' },
                          { value: 'admin', label: 'Admin', icon: '⚙️' }
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setRole(option.value)}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                              role === option.value
                                ? 'border-green-600 bg-green-50 shadow-md'
                                : 'border-gray-200 hover:border-green-300'
                            }`}
                          >
                            <div className="text-2xl mb-1">{option.icon}</div>
                            <div className={`text-sm font-semibold ${
                              role === option.value ? 'text-green-600' : 'text-gray-600'
                            }`}>
                              {option.label}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Email Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                          </svg>
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none transition-colors"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none transition-colors"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Forgot Password */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input type="checkbox" className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                      </label>
                      <Link to="/forgot-password" className="text-sm font-semibold text-green-600 hover:text-green-700">
                        Forgot Password?
                      </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing in...
                        </span>
                      ) : (
                        'Sign In'
                      )}
                    </button>
                  </form>

                  {/* Sign Up Link */}
                  <div className="mt-8 text-center">
                    <p className="text-gray-600">
                      Don't have an account?{' '}
                      <Link to="/" className="font-semibold text-green-600 hover:text-green-700">
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default Login;
