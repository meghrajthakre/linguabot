import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import BotCard from "../components/BotCard";
import api from "../api/axios"; // <-- your axios instance
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  /* =========================
     FETCH USER BOTS
  ========================== */
  const fetchBots = async () => {
    try {
      const res = await api.get("/bots");
      setBots(res.data);
    } catch (error) {
      console.error("Error fetching bots:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBots();
  }, []);

  /* =========================
     DELETE BOT
  ========================== */
  const handleDelete = async (id) => {
    try {
      await api.delete(`/bots/${id}`);
      setBots((prev) => prev.filter((bot) => bot._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            🤖 Your Bots
          </h1>
          <p className="text-gray-500 mt-1">
            Manage, monitor and train your AI bots
          </p>
          <Link to="/how-to-make-bot">How to Make Bot</Link>
        </div>

        <button
          onClick={() => navigate("/create-bot")}
          className="flex cursor-pointer items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 font-semibold"
        >
          <Plus size={18} />
          Create New Bot
        </button>
      </div>

      {/* Stats Section (Dynamic) */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <p className="text-sm text-gray-500">Total Bots</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {bots.length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md">
          <p className="text-sm text-gray-500">Languages</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {[...new Set(bots.map(b => b.language))].length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md">
          <p className="text-sm text-gray-500">Created Bots</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {bots.length}
          </h2>
        </div>
      </div>

      {/* Bot Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">My Bots</h2>
      </div>

      {/* Loading State */}
      {loading ? (
        <p className="text-gray-500">Loading bots...</p>
      ) : bots.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow text-center">
          <p className="text-gray-500 mb-4">No bots created yet.</p>
          <button
          onClick={() => navigate("/create-bot")}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-5 py-2 rounded-xl">
            Create Your First Bot
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map(bot => (
            <BotCard
              key={bot._id}
              bot={bot}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;