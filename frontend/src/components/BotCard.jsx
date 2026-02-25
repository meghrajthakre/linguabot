import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Edit3, BarChart3, Trash2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const BotCard = ({ bot, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  // ✅ Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // ✅ Delete Handler with Toast
  const handleDelete = async () => {
    try {
      await onDelete(bot._id);
      toast.success("Bot deleted successfully 🗑️");
      setIsMenuOpen(false);
    } catch (error) {
      toast.error("Failed to delete bot ❌");
    }
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg transition-all duration-300 hover:border-gray-300 hover:shadow-md flex flex-col h-full">
      
      <div className="p-8 flex flex-col flex-1 border-t-4 border-yellow-400 overflow-hidden rounded-tl-lg rounded-tr-lg">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="text-3xl">🤖</div>

          {/* Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 11-4 0 2 2 0 014 0zM10 12a2 2 0 11-4 0 2 2 0 014 0zM10 18a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                
                <Link
                  to={`/bot/${bot._id}/edit`}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                >
                  <Edit3 size={16} className="text-gray-400" />
                  Edit
                </Link>

                <Link
                  to={`/bot/${bot._id}/analytics`}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                >
                  <BarChart3 size={16} className="text-gray-400" />
                  Analytics
                </Link>

                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bot Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          {bot.name || "Untitled Bot"}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-6 line-clamp-2 flex-1">
          {bot.description || "No description provided"}
        </p>

        {/* Meta */}
        <div className="flex gap-8 mb-8 text-xs text-gray-500">
          <div>
            <p className="uppercase tracking-wide font-medium mb-1">Status</p>
            <p className="text-green-600 font-semibold">Active</p>
          </div>
          <div>
            <p className="uppercase tracking-wide font-medium mb-1">Language</p>
            <p className="text-gray-700 font-semibold">
              {bot.language?.toUpperCase() || "EN"}
            </p>
          </div>
        </div>

        {/* CTA */}
        <Link
          to={`/bot/${bot._id}`}
          className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 active:bg-yellow-600 transition-all group/btn"
        >
          View Bot
          <ArrowRight
            size={16}
            className="opacity-0 group-hover/btn:opacity-100 transition-opacity"
          />
        </Link>
      </div>
    </div>
  );
};

export default BotCard;