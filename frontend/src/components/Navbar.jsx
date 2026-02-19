import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const navLink = (path, label) => {
    const active = location.pathname === path;

    return (
      <Link
        to={path}
        className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
          active
            ? "bg-yellow-400 text-white shadow-md"
            : "text-gray-700 hover:bg-white/60"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-[#f3efe6]/80 to-[#e8e1d2]/80 border-b border-white/40 shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl text-yellow-500"
        >
          🤖 <span>LinguaBot</span>
        </Link>

        <div className="flex-1" />

        {/* Main Links */}
        <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md px-3 py-2 rounded-2xl shadow-inner">
          {navLink("/", "Dashboard")}
          {navLink("/bot", "Bot Editor")}
          {navLink("/analytics", "Analytics")}
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3 ml-6">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-black"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-xl shadow-md text-sm font-semibold transition"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
