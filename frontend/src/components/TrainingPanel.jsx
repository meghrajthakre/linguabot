import React from "react";

const TrainingPanel = () => {
  return (
    <div className="p-6 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg">

      <h3 className="text-lg font-bold mb-1">Train Your Bot</h3>
      <p className="text-sm text-gray-600 mb-5">
        Add FAQs, pricing, docs to train AI
      </p>

      {/* textarea */}
      <textarea
        placeholder="Paste your business info, FAQs, pricing..."
        className="w-full h-40 p-4 rounded-xl border bg-white outline-none mb-4"
      />

      {/* file upload */}
      <input
        type="file"
        className="w-full mb-4 bg-white p-3 rounded-xl border"
      />

      <button className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-xl shadow-md">
        Train Bot 🚀
      </button>
    </div>
  );
};

export default TrainingPanel;
