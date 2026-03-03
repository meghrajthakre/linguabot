import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken"); // or your auth check logic
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleGetStarted = () => {
    navigate("/register");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-yellow-50 overflow-x-hidden">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-100 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div
              className="flex items-center gap-3 text-2xl font-bold cursor-pointer hover:text-yellow-500 transition-colors duration-300"
              onClick={() => navigate("/")}
            >
              <span className="text-3xl">🤖</span>
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                LinguaBot
              </span>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="px-6 py-2 border-2 border-yellow-400 text-yellow-400 font-semibold rounded-lg hover:bg-yellow-400 hover:text-white transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative floating elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400 rounded-full opacity-5 animate-pulse -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400 rounded-full opacity-5 -z-10"></div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="animate-fade-in-left space-y-6">
              {/* Badge */}
              <div className="inline-block">
                <div className="px-4 py-2 bg-yellow-100 border border-yellow-200 rounded-full text-yellow-700 text-sm font-semibold tracking-wide">
                  🚀 AI-Powered, Effortless
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Build Your Own AI Chatbot in Minutes
              </h1>

              {/* Subheading */}
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl">
                No coding required. No credit card needed. Launch a ChatGPT-powered
                chatbot for your business today. Embed it on your website and watch
                your customer service transform.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleGetStarted}
                  className="px-8 py-3.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 transform active:translate-y-0"
                >
                  Get Started Free
                </button>
                <button
                  onClick={handleLogin}
                  className="px-8 py-3.5 bg-gray-100 text-gray-900 font-bold rounded-lg border-2 border-gray-200 hover:bg-white hover:border-yellow-400 hover:text-yellow-400 hover:-translate-y-1 transition-all duration-300 transform"
                >
                  Sign In
                </button>
              </div>

              {/* Trust Text */}
              <p className="text-sm text-gray-600 font-medium tracking-wide">
                ✓ No credit card required • Free to start • Deploy in minutes
              </p>
            </div>

            {/* Right Visual - Chat Mockup */}
            <div className="animate-fade-in-right">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                </div>

                {/* Chat Content */}
                <div className="p-6 space-y-4 bg-white">
                  {/* Assistant Message */}
                  <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
                    <div className="mr-8 p-3 bg-gradient-to-r from-yellow-200 to-yellow-300 text-gray-900 rounded-2xl rounded-tl-sm text-sm leading-relaxed">
                      Hi! I'm your AI assistant. How can I help?
                    </div>
                  </div>

                  {/* User Message */}
                  <div
                    className="animate-fade-in flex justify-end"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <div className="ml-8 p-3 bg-gray-100 text-gray-900 rounded-2xl rounded-tr-sm text-sm leading-relaxed">
                      How do I reset my password?
                    </div>
                  </div>

                  {/* Assistant Message */}
                  <div
                    className="animate-fade-in"
                    style={{ animationDelay: "0.7s" }}
                  >
                    <div className="mr-8 p-3 bg-gradient-to-r from-yellow-200 to-yellow-300 text-gray-900 rounded-2xl rounded-tl-sm text-sm leading-relaxed">
                      I'll help you right away...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-yellow-50/30 to-transparent">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center text-gray-900 mb-16">
            Why Choose LinguaBot?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-8 bg-white rounded-2xl border border-gray-200 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Deploy your chatbot instantly without any coding experience
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-white rounded-2xl border border-gray-200 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="text-5xl mb-4">🧠</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered</h3>
              <p className="text-gray-600 leading-relaxed">
                Uses latest AI technology to understand and respond naturally
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-white rounded-2xl border border-gray-200 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="text-5xl mb-4">🔧</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Fully Customizable
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Train it with your own data and match your brand perfectly
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 bg-white rounded-2xl border border-gray-200 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Track Everything
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get detailed analytics on every conversation and customer
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl sm:text-5xl font-black leading-tight">
            Ready to Transform Your Customer Service?
          </h2>
          <p className="text-lg sm:text-xl opacity-95">
            Join thousands of businesses using LinguaBot today
          </p>
          <button
            onClick={handleGetStarted}
            className="px-10 py-4 bg-white text-yellow-500 font-bold text-lg rounded-lg hover:bg-yellow-50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 transform inline-block mt-4"
          >
            Start Free Trial Now
          </button>
        </div>
      </section>

      {/* Animations in style tag */}
      <style>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out;
        }

        .animate-fade-in-right {
          animation: fadeInRight 0.8s ease-out;
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }

        @media (max-width: 768px) {
          .animate-fade-in-left,
          .animate-fade-in-right {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;