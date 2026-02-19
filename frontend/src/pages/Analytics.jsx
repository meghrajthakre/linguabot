import React from "react";

const Analytics = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📊 Analytics</h1>
        <p className="text-gray-600">Track bot performance & usage</p>
      </div>

      {/* stats */}
      <div className="grid md:grid-cols-4 gap-5 mb-8">

        <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-5 shadow">
          <p className="text-sm text-gray-500">Total Chats</p>
          <h2 className="text-2xl font-bold">1,240</h2>
        </div>

        <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-5 shadow">
          <p className="text-sm text-gray-500">Users</p>
          <h2 className="text-2xl font-bold">340</h2>
        </div>

        <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-5 shadow">
          <p className="text-sm text-gray-500">Languages</p>
          <h2 className="text-2xl font-bold">18</h2>
        </div>

        <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-5 shadow">
          <p className="text-sm text-gray-500">Avg Response</p>
          <h2 className="text-2xl font-bold">1.2s</h2>
        </div>

      </div>

      {/* chart box */}
      <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow h-72 flex items-center justify-center text-gray-400">
        📈 Charts coming soon...
      </div>

    </div>
  );
};

export default Analytics;
