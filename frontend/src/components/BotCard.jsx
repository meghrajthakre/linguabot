import React from "react";
import { Link } from "react-router-dom";

const BotCard = ({ title = "Untitled Bot", description = "No description" }) => {
  return (
    <div className="p-6 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-md hover:shadow-xl transition">

      {/* bot icon + name */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-yellow-400/20 flex items-center justify-center text-xl">
          🤖
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
          <p className="text-xs text-gray-500">AI Support Bot</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">{description}</p>

      {/* actions */}
      <div className="flex gap-3">
        <Link
          to="/bot"
          className="px-4 py-2 text-sm bg-yellow-400 hover:bg-yellow-500 text-white rounded-xl shadow"
        >
          Open
        </Link>

        <Link
          to="/analytics"
          className="px-4 py-2 text-sm bg-white/70 hover:bg-white rounded-xl shadow text-gray-700"
        >
          Analytics
        </Link>
      </div>
    </div>
  );
};

export default BotCard;
