import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000); // 👈 2 seconds minimum loader

    return () => clearTimeout(timer);
  }, []);

  // 👇 Jab tak auth loading ho ya 2s complete na ho
  if (loading || showLoader) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fdf9f3] via-[#f5f0e8] to-[#f0e8dc] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6 max-w-sm">

          {/* Spinner */}
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-transparent border-t-yellow-400 border-r-yellow-300 rounded-full animate-spin" />
            
            <div 
              className="absolute inset-2 border-4 border-transparent border-b-yellow-200 border-l-yellow-100 rounded-full animate-spin" 
              style={{ animationDirection: "reverse", animationDuration: "1.5s" }} 
            />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Text */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">
              Verifying access...
            </h2>
            <p className="text-sm text-gray-500">
              Setting up your workspace
            </p>
          </div>

          {/* Loading bar */}
          <div className="w-full max-w-xs h-1 bg-[#e8e0d0] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 rounded-full"
              style={{
                animation: "shimmer 2s infinite",
              }}
            />
          </div>

          {/* Dots */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>

          <style>{`
            @keyframes shimmer {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(100%);
              }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;