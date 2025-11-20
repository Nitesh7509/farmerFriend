import axios from "axios";
import { useState, useContext } from "react";
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

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      let response;
      
      // Use different endpoint for admin login
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

      // Update auth context
      login(response.data.user, response.data.role, response.data.token);

      // Redirect based on role
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
      <div className="flex items-center justify-center h-screen bg-gray-100" 
    style={{
      backgroundImage:
        "url('https://i.pinimg.com/736x/7d/6e/7b/7d6e7b52395cfd95fe3e9ae60a66bd54.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
    >
      <div className="h-3/4 w-2/3 bg-black opacity-80 flex justify-center items-center  flex-col "> 
        <h1 className="text-2xl font-bold mb-5 text-center text-white">welcomeBack to FarmerFriend</h1>    
      <div className="bg-white p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={submitHandler}>
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded mb-4"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block mb-2 font-medium">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded mb-4"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Select Role</label>

            <select
              name="role"
              className="w-full p-2 border rounded-md"
              value={role}
              onChange={(e)=>setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="farmer">Farmer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="text-right mb-4">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>

      </div>
      <Link to="/">
      <p className="text-center text-gray-600 mt-4">Don't have an account? <span className="text-blue-600 font-semibold">Sign Up</span></p>
      </Link>
      </div>

      </div>
    </>
  );
};

export default Login;
