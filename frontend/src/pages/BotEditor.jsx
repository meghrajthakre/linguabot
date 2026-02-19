import React from "react";
import TrainingPanel from "../components/TrainingPanel";
import ChatPreview from "../components/ChatPreview";

const BotEditor = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">⚙️ Bot Editor</h1>
        <p className="text-gray-600">Train bot using FAQs & business data</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* training */}
        <section className="flex-1 bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Training Data</h2>
          <TrainingPanel />
        </section>

        {/* preview */}
        <aside className="w-full lg:w-96 bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow">
          <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
          <ChatPreview />
        </aside>

      </div>

    </div>
  );
};

export default BotEditor;
