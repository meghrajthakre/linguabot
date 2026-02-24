import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bot } from "lucide-react";
import api from "../api/axios";

const CreateBot = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    language: "",
    docs: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/bots", formData);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Failed to create bot");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F1E8] p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT SIDE - FORM */}
        <div className="bg-white rounded-3xl shadow-md p-8">

          <div className="flex items-center gap-3 mb-6">
            <div className="bg-yellow-400 p-3 rounded-xl">
              <Bot size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Create New Bot</h2>
              <p className="text-sm text-gray-500">
                Setup your AI multilingual assistant
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Bot Name"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none"
            />

            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Bot Description"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none"
            />

            <select
              name="language"
              required
              value={formData.language}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none"
            >
              <option value="">Select Language</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
            </select>

            <textarea
              name="docs"
              rows="4"
              value={formData.docs}
              onChange={handleChange}
              placeholder="Paste your documentation or training info..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none"
            />

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded-xl font-semibold transition shadow"
              >
                {loading ? "Creating..." : "Create Bot"}
              </button>
            </div>

          </form>
        </div>

        {/* RIGHT SIDE - CHAT PREVIEW */}
        <div className="bg-white rounded-3xl shadow-md p-8 flex flex-col">
          <h3 className="text-lg font-semibold mb-4">
            Live Chat Preview
          </h3>

          <ChatPreview
            botName={formData.name}
            botDescription={formData.description}
          />
        </div>

      </div>
    </div>
  );
};

export default CreateBot;


/* ---------------- CHAT PREVIEW COMPONENT ---------------- */

const ChatPreview = ({ botName, botDescription }) => {

  const getInitialMessages = () => [
    {
      from: "bot",
      text: `Hi! I'm ${botName || "your AI assistant"} 👋`,
    },
    { from: "user", text: "What can you do?" },
    {
      from: "bot",
      text: botDescription || "I help answer customer queries.",
    },
  ];

  const [messages, setMessages] = useState(getInitialMessages());
  const [input, setInput] = useState("");

  // Reset preview when name or description changes
  useEffect(() => {
    setMessages(getInitialMessages());
  }, [botName, botDescription]);

  const send = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { from: "user", text: input },
      { from: "bot", text: "Processing your request..." },
    ]);

    setInput("");
  };

  const reset = () => {
    setMessages(getInitialMessages());
  };

  return (
    <>
      <div className="flex flex-col gap-3 min-h-[240px] max-h-[280px] overflow-y-auto pr-1 mb-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.from === "user" ? "justify-end" : ""}`}
          >
            <div
              className={`px-4 py-2.5 text-sm rounded-2xl max-w-[75%]
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

      <div className="flex gap-2">
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
        className="text-xs text-gray-400 hover:text-gray-600 mt-3 self-end"
      >
        Reset Chat
      </button>
    </>
  );
};