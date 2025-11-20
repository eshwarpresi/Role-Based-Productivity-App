import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.username, formData.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/50">

        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
          Welcome Back ✨
        </h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded-lg mb-4 animate-shake">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-700 font-medium">Username</label>
            <input
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-rose-400 focus:outline-none shadow-sm"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium">Password</label>
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-rose-400 focus:outline-none shadow-sm"
              placeholder="Enter password"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-rose-500 text-white font-semibold hover:bg-rose-600 active:scale-95 transition disabled:opacity-50 shadow-lg"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center mt-4 text-gray-700">
          Don’t have an account?{" "}
          <Link to="/register" className="text-rose-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>

        {/* Demo Info */}
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-sm text-amber-800 mt-6 shadow-sm">
          <strong>Demo Admin Account:</strong> <br />
          Username: <span className="font-medium">admin</span> <br />
          Password: <span className="font-medium">admin123</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
