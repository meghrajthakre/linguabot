import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [show, setShow] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f3efe6] to-[#e8e1d2] px-6">

      <div className="w-full max-w-md bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-white/40">

        <div className="flex flex-col items-center mb-6">
          <div className="bg-yellow-400 text-white px-4 py-2 rounded-xl font-bold text-lg shadow">
            🤖 LinguaBot
          </div>
          <h2 className="text-2xl font-bold mt-4 text-gray-800">
            Create Account
          </h2>
          <p className="text-gray-500 text-sm">Start your AI support bot</p>
        </div>

        <form className="space-y-4">
          
          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400" size={18}/>
            <input
              type="text"
              placeholder="Full name"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

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

          <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 rounded-xl shadow-md transition">
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have account?
          <Link to="/login"
          
          className="text-yellow-600 font-semibold cursor-pointer">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;
