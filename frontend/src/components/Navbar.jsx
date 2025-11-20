import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 border-b border-white/40 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent drop-shadow-sm"
          >
            TaskManager
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            {user ? (
              <>
                {/* User Bubble */}
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-white/50 shadow-sm">
                  <span className="text-gray-700 font-semibold">
                    👋 {user.username}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({user.role})
                  </span>
                </div>

                {/* Dashboard Button */}
                <Link
                  to="/"
                  className="px-5 py-2 rounded-full font-medium bg-gradient-to-r from-orange-400 to-rose-400 text-white shadow-md hover:opacity-90 transition active:scale-95"
                >
                  Dashboard
                </Link>

                {/* Admin Badge */}
                {user.role === "admin" && (
                  <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-semibold shadow">
                    Admin
                  </span>
                )}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white font-medium shadow-md hover:opacity-90 transition active:scale-95"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 bg-white/60 backdrop-blur hover:bg-gray-100 transition"
                >
                  Login
                </Link>

                {/* Register */}
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:opacity-90 transition active:scale-95"
                >
                  Register
                </Link>
              </>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
