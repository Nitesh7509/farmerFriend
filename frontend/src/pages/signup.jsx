import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { backendurl } from "../App";
import { AuthContext } from "../contexts/authcontext";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const submitHandler = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post(`${backendurl}/api/user/register`, {
                email,
                password,
                name,
                role
            });

            // Save user data and token to AuthContext
            if (response.data.token) {
                login(response.data.user, response.data.role, response.data.token);
                
                // Redirect based on role
                if (response.data.role === "farmer") {
                    navigate("/farmer-dashboard");
                } else if (response.data.role === "admin") {
                    navigate("/admin-dashboard");
                } else {
                    navigate("/home");
                }
            } else {
                navigate("/login");
            }
        } catch (error) {
            console.error("Registration error:", error);
        }
    };

  return (
     <div
      className="flex justify-center items-center h-screen"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/7d/6e/7b/7d6e7b52395cfd95fe3e9ae60a66bd54.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="h-3/4 w-2/3 bg-black opacity-80 flex justify-center items-center  flex-col "> 
      <h1 className="text-2xl font-bold mb-5 text-center text-white">welcome to FarmerFriend</h1>    
      <div className="bg-white p-8 rounded-xl shadow-xl w-96  ">
        <h2 className="text-2xl font-bold mb-5 text-center">Create an Account</h2>

        <form onSubmit={submitHandler}>

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            className="w-full p-2 mb-3 border rounded-md"
            onChange={(e)=>setName(e.target.value)}
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full p-2 mb-3 border rounded-md"
            onChange={(e)=>setEmail(e.target.value)}
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="w-full p-2 mb-3 border rounded-md"
            onChange={(e)=>setPassword(e.target.value)}
          />

          {/* Role Selection */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Select Role</label>

            <select
              name="role"
              className="w-full p-2 border rounded-md"
              onChange={(e)=>setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="farmer">Farmer</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 mt-2 rounded-md hover:bg-green-700"
          >
            Sign Up
          </button>

        </form>
       
      </div>
      <Link to="/login">
      <p className="text-center text-gray-600 mt-4">Already have an account? <span className="text-blue-600 font-semibold">Login</span></p>
      </Link>
         </div>
    </div>
  );
};

export default Signup;
