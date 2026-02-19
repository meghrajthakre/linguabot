import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navLink = (path, label) => {
    const active = location.pathname === path;

    return (
      <Link
        to={path}
        onClick={() => setOpen(false)}
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

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-yellow-500">
          {/* Vite public folder image */}
         <div className="flex items-center ">
           <img src="/icon.png" className="w-15 h-15 object-contain" alt="logo" />
          <span>LinguaBot</span>
         </div>
        </Link>

        <div className="flex-1" />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2 bg-white/40 backdrop-blur-md px-3 py-2 rounded-2xl shadow-inner">
          {navLink("/", "Dashboard")}
          {navLink("/bot", "Bot Editor")}
          {navLink("/analytics", "Analytics")}
        </div>

        {/* Auth desktop */}
        <div className="hidden md:flex items-center gap-3 ml-6">
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

        {/* Mobile menu button */}
        <button
          className="md:hidden ml-4"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden px-6 pb-4">
          <div className="flex flex-col gap-2 bg-white/70 backdrop-blur-xl rounded-2xl p-4 shadow">
            {navLink("/", "Dashboard")}
            {navLink("/bot", "Bot Editor")}
            {navLink("/analytics", "Analytics")}

            <hr className="my-2" />

            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-gray-700"
            >
              Login
            </Link>

            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="px-4 py-2 bg-yellow-400 text-white rounded-xl text-sm font-semibold text-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
