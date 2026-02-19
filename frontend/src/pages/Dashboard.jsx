import React from "react";
import BotCard from "../components/BotCard";

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 ">

      {/* header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🤖 Your Bots</h1>
        <p className="text-gray-600">Manage and train your AI bots</p>
      </div>

      {/* stats */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-5 shadow">
          <p className="text-sm text-gray-500">Total Bots</p>
          <h2 className="text-2xl font-bold text-gray-800">3</h2>
        </div>

        <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-5 shadow">
          <p className="text-sm text-gray-500">Conversations</p>
          <h2 className="text-2xl font-bold text-gray-800">1,240</h2>
        </div>

        <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-5 shadow">
          <p className="text-sm text-gray-500">Languages</p>
          <h2 className="text-2xl font-bold text-gray-800">12</h2>
        </div>
      </div>

      {/* bot header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My Bots</h2>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-5 py-2 rounded-xl shadow font-semibold">
          + Create Bot
        </button>
      </div>

      {/* bot cards */}
      <div className="grid md:grid-cols-2 gap-5">
        <BotCard title="Support Bot" description="Handles customer support queries" />
        <BotCard title="Sales Bot" description="Answers pricing & sales questions" />
      </div>

    </div>
  );
};

export default Dashboard;
