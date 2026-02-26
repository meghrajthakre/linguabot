import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Edit3, BarChart3, Trash2, ArrowRight, MoreVertical, Bot, CheckCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmationModal from "./Confirmationmodal";

const BotCard = ({ bot, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const menuRef = useRef(null);
  const location = useLocation();

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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleDeleteClick = () => {
    setIsMenuOpen(false);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(bot._id);
      toast.success("Bot deleted successfully 🗑️");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete bot ❌");
    } finally {
      setIsDeleting(false);
    }
  };

  const getLanguageColor = (lang) => {
    const colors = {
      english: "bg-blue-100 text-blue-700",
      hindi: "bg-orange-100 text-orange-700",
      spanish: "bg-red-100 text-red-700",
      french: "bg-purple-100 text-purple-700",
      german: "bg-green-100 text-green-700",
      portuguese: "bg-yellow-100 text-yellow-700",
      arabic: "bg-pink-100 text-pink-700",
      japanese: "bg-indigo-100 text-indigo-700",
      chinese: "bg-rose-100 text-rose-700",
      korean: "bg-cyan-100 text-cyan-700",
      russian: "bg-gray-100 text-gray-700",
    };
    return colors[lang?.toLowerCase()] || "bg-gray-100 text-gray-700";
  };

  return (
    <>
      <div className="group relative h-full rounded-2xl bg-white border border-[#e8e0d0] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
        {/* Gradient Header */}
        <div className="relative h-22 bg-gradient-to-br from-yellow-400 to-yellow-500 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8" />

          {/* Icon and Menu */}
          <div className="relative h-full px-6 py-4 flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-white/90 shadow-md flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
              🤖
            </div>

            {/* Menu Button */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
                title="More options"
              >
                <MoreVertical size={18} className="text-white" />
              </button>

              {isMenuOpen && (
                <div className="absolute z-100 right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#e8e0d0] z-20 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                  <Link
                    to={`/bot/${bot._id}/edit`}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-[#e8e0d0] transition-colors"
                  >
                    <Edit3 size={16} className="text-yellow-600" />
                    <span>Edit Bot</span>
                  </Link>

                  <Link
                    to={`/bot/${bot._id}/analytics`}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-[#e8e0d0] transition-colors"
                  >
                    <BarChart3 size={16} className="text-blue-600" />
                    <span>View Analytics</span>
                  </Link>

                  <button
                    onClick={handleDeleteClick}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Delete Bot</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-6 space-y-4">
          {/* Bot Name */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-yellow-600 transition-colors">
              {bot.name || "Untitled Bot"}
            </h3>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 flex-1">
            {bot.description || "No description provided"}
          </p>

          {/* Meta Info */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            {/* Status and Language Row */}
            <div className="flex gap-3 flex-wrap">
              {/* Status Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
                <CheckCircle size={14} className="text-green-600" />
                <span className="text-xs font-semibold text-green-700">Active</span>
              </div>

              {/* Language Badge */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${getLanguageColor(
                  bot.language
                )}`}
              >
                <span>🌍</span>
                <span>{bot.language || "English"}</span>
              </div>
            </div>

            {/* Created Date */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock size={12} />
              <span>
                Created{" "}
                {bot.createdAt
                  ? new Date(bot.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : "Recently"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer - CTA Button */}
        <div className="p-6 pt-0">
          <Link
            to={`/bot/${bot._id}`}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:shadow-md text-gray-900 font-semibold rounded-lg transition-all duration-200 group/btn hover:scale-105 active:scale-95"
          >
            <span>View Bot</span>
            <ArrowRight
              size={16}
              className="opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all duration-200"
            />
          </Link>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Delete Bot"
        message={`Are you sure you want to delete "${bot.name || "this bot"}"? This action cannot be undone.`}
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsModalOpen(false)}
        isLoading={isDeleting}
      />
    </>
  );
};

export default BotCard;