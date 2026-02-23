import React, { useState } from "react";
import TrainingPanel from "../components/TrainingPanel";



const SectionCard = ({ icon, title, subtitle, children, action }) => (
  <div className="bg-white border border-[#e8e0d0] rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-200 flex items-center justify-center text-lg">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>
      {action}
    </div>
    {children}
  </div>
);

/* ───────────────────────────────────────────── */
/* Chat Preview */
/* ───────────────────────────────────────────── */

const ChatPreview = () => {
  const initialMessages = [
    { from: "bot", text: "Hi! I'm your AI assistant 👋" },
    { from: "user", text: "What's your return policy?" },
    { from: "bot", text: "We offer 30-day hassle-free returns." },
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { from: "user", text: input },
      { from: "bot", text: "Processing your request..." },
    ]);
    setInput("");
  };

  const reset = () => setMessages(initialMessages);

  return (
    <>
      <div className="flex flex-col gap-3 min-h-[220px] max-h-[260px] overflow-y-auto pr-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.from === "user" ? "justify-end" : ""}`}
          >
            <div
              className={`px-4 py-2.5 text-sm rounded-2xl max-w-[75%] transition
                ${
                  m.from === "user"
                    ? "bg-yellow-400 text-black rounded-br-sm"
                    : "bg-[#f5f0e8] border border-[#e8e0d0] text-gray-800 rounded-bl-sm"
                }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="flex-1 border border-[#e8e0d0] rounded-xl px-4 py-2 text-sm bg-[#f5f0e8] focus:ring-2 focus:ring-yellow-300 outline-none"
          placeholder="Test your bot..."
        />
        <button
          onClick={send}
          className="w-10 h-10 rounded-xl bg-yellow-400 hover:bg-yellow-500 font-bold shadow-sm hover:shadow-md transition"
        >
          ➤
        </button>
      </div>

      <button
        onClick={reset}
        className="text-xs text-gray-400 hover:text-gray-600 mt-2 self-end"
      >
        Reset Chat
      </button>
    </>
  );
};

/* ───────────────────────────────────────────── */
/* Main Editor */
/* ───────────────────────────────────────────── */

const BotEditor = () => {
  const [botName, setBotName] = useState("Support Bot");

  return (
    <div className="min-h-screen bg-[#f5f0e8]">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* Top Bar */}
        <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              ⚙️ Bot Editor
            </h1>
            <p className="text-sm text-gray-500">
              Train and customize your AI assistant
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              className="border border-[#e8e0d0] rounded-lg px-3 py-1.5 text-sm font-bold bg-[#f5f0e8] focus:ring-2 focus:ring-yellow-300 outline-none"
            />
            <button className="bg-yellow-400 hover:bg-yellow-500 px-5 py-2 rounded-xl font-bold shadow-sm hover:shadow-md transition">
              Save Changes
            </button>
          </div>
        </div>


        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Training */}
          <SectionCard
            icon="📚"
            title="Training Data"
            subtitle="FAQs • Pricing • Docs"
            action={
              <span className="text-xs bg-[#f5f0e8] border border-[#e8e0d0] px-3 py-1 rounded-full">
                25 entries
              </span>
            }
          >
            <TrainingPanel />
          </SectionCard>

          {/* Right Column */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-6 h-fit">

            <SectionCard
              icon="🤖"
              title="Live Preview"
              subtitle="Test how your bot responds"
            >
              <ChatPreview />
            </SectionCard>

            <SectionCard
              icon="🎛️"
              title="Quick Settings"
              subtitle="Personality & behavior"
            >
              <div className="grid grid-cols-2 gap-4">
                <select className="border border-[#e8e0d0] rounded-lg px-3 py-2 text-sm bg-[#f5f0e8] focus:ring-2 focus:ring-yellow-300 outline-none">
                  <option>Friendly</option>
                  <option>Professional</option>
                </select>
                <select className="border border-[#e8e0d0] rounded-lg px-3 py-2 text-sm bg-[#f5f0e8] focus:ring-2 focus:ring-yellow-300 outline-none">
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </div>
            </SectionCard>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BotEditor;