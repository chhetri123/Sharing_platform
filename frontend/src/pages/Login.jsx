import { useState } from "react";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", formData);
      localStorage.setItem("token", response.data.token);
      toast.success("Login successful!");
      window.location.href = "/";
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            className="w-full p-2 border rounded-md"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            name="password"
            className="w-full p-2 border rounded-md"
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded-md hover:bg-primary/90 flex items-center justify-center"
        >
          <LogIn className="w-5 h-5 mr-2" />
          Login
        </button>
      </form>
      <p className="mt-4 text-center text-gray-600">
        Don't have an account?{" "}
        <Link to="/register" className="text-primary hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}

export default Login;
