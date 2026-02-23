import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, LayoutDashboard, Bot, BarChart3, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/bot", label: "Bot Editor", icon: Bot },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  const NavLink = ({ path, label, icon: Icon, mobile = false }) => {
    const active = location.pathname === path;

    return (
      <Link
        to={path}
        onClick={() => setOpen(false)}
        className={`
          group relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
          transition-all duration-200 
          ${mobile ? "w-full" : ""}
          ${
            active
              ? "bg-yellow-400 text-white "
              : "text-gray-700 hover:bg-yellow-50"
          }
        `}
      >
        <Icon
          size={18}
          className={
            active
              ? "text-white"
              : "text-gray-500 group-hover:text-yellow-500"
          }
        />
        <span>{label}</span>
        {active && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-yellow-500 rounded-full" />
        )}
      </Link>
    );
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-[#f3efe6]/80 to-[#e8e1d2]/80 shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center">
        
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-yellow-400 p-2 rounded-2xl shadow-md">
            <Bot className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          
          <div className="flex flex-col">
            <span className="font-bold text-xl text-yellow-500">
              LinguaBot
            </span>
            <span className="text-[10px] text-gray-500 font-medium tracking-wider flex items-center gap-1">
              <Sparkles size={10} className="text-yellow-500" />
              AI MULTILINGUAL SUPPORT
            </span>
          </div>
        </Link>

        <div className="flex-1" />

        {user && (
          <div className="hidden md:flex items-center gap-2 bg-white px-3 py-2 rounded-2xl shadow-inner border border-gray-200">
            {navLinks.map((link) => (
              <NavLink key={link.path} {...link} />
            ))}
          </div>
        )}

        <div className="hidden md:flex items-center gap-4 ml-6">
          {user ? (
            <>
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shadow-md">
                  <User size={16} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium">
                    Welcome back
                  </span>
                  <span className="text-sm font-semibold text-gray-800 truncate max-w-[150px]">
                    {user.name || user.email.split("@")[0]}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex cursor-pointer items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold shadow-md transition-all"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-yellow-600 transition-colors"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-white rounded-xl shadow-md text-sm font-semibold transition-all"
              >
                <span className="flex items-center gap-2">
                  <Sparkles size={16} />
                  Get Started Free
                </span>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden  ml-4 p-2 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
    </header>
  );
};

export default Navbar;