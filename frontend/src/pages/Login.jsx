import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  const [show, setShow] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f3efe6] to-[#e8e1d2] px-6">
      
      <div className="w-full max-w-md bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-white/40">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-yellow-400 text-white px-4 py-2 rounded-xl font-bold text-lg shadow">
            🤖 LinguaBot
          </div>
          <h2 className="text-2xl font-bold mt-4 text-gray-800">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-sm">Login to your dashboard</p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={18}/>
            <input
              type="email"
              placeholder="Email address"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={18}/>
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <div
              className="absolute right-3 top-3.5 cursor-pointer text-gray-400"
              onClick={() => setShow(!show)}
            >
              {show ? <EyeOff size={18}/> : <Eye size={18}/>}
            </div>
          </div>

          {/* Remember */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox"/>
              Remember me
            </label>

            <span className="text-yellow-600 cursor-pointer hover:underline">
              Forgot password?
            </span>
          </div>

          {/* Button */}
          <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 rounded-xl shadow-md transition">
            Log In
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3 text-gray-400 text-sm">
          <div className="flex-1 h-[1px] bg-gray-200"></div>
          OR
          <div className="flex-1 h-[1px] bg-gray-200"></div>
        </div>

        {/* Social */}
        <div className="flex gap-3">
          <button className="flex-1 border py-2 rounded-xl hover:bg-gray-50">
            Google
          </button>
          <button className="flex-1 border py-2 rounded-xl hover:bg-gray-50">
            Apple
          </button>
        </div>

        {/* Bottom */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have account?{" "}
          <Link to="/signup" className="text-yellow-600 font-semibold cursor-pointer">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
