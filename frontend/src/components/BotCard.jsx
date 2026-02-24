import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Edit3, BarChart3, Trash2, ArrowRight } from "lucide-react";

const BotCard = ({ bot, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDelete = () => {
    onDelete(bot._id);
    setIsMenuOpen(false);
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg transition-all duration-300 hover:border-gray-300 hover:shadow-sm flex flex-col h-full">
      
      {/* Top Accent Line */}
      <div className="h-0.5 bg-yellow-400" />

      <div className="p-8 flex flex-col flex-1">
        
        {/* Header with Icon */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="text-3xl flex-shrink-0">🤖</div>
          
          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="More options"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 11-4 0 2 2 0 014 0zM10 12a2 2 0 11-4 0 2 2 0 014 0zM10 18a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>

            {/* Dropdown */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 overflow-hidden">
                <Link
                  to={`/bot/${bot._id}/edit`}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Edit3 size={16} className="text-gray-400" />
                  Edit
                </Link>
                <Link
                  to={`/bot/${bot._id}/analytics`}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BarChart3 size={16} className="text-gray-400" />
                  Analytics
                </Link>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bot Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-tight">
          {bot.name || "Untitled Bot"}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-6 line-clamp-2 leading-relaxed flex-1">
          {bot.description || "No description provided"}
        </p>

        {/* Meta Information */}
        <div className="flex gap-8 mb-8 text-xs text-gray-500">
          <div>
            <p className="uppercase tracking-wide font-medium mb-1">Status</p>
            <p className="text-green-600 font-semibold">Active</p>
          </div>
          <div>
            <p className="uppercase tracking-wide font-medium mb-1">Language</p>
            <p className="text-gray-700 font-semibold">{bot.language?.toUpperCase() || "EN"}</p>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          to={`/bot/${bot._id}`}
          className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 active:bg-yellow-600 transition-colors duration-200 group/btn"
        >
          View Bot
          <ArrowRight size={16} className="opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200" />
        </Link>
      </div>
    </div>
  );
};

export default BotCard;