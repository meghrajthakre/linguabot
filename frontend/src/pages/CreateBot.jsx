import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Plus, Trash2, ChevronDown, Sparkles, FileText, DollarSign, HelpCircle, RotateCcw, Send } from "lucide-react";
import api from "../api/axios";

/* ─── tiny helper ─── */
const Section = ({ icon: Icon, label, color, children }) => (
  <div className="group rounded-2xl border border-[#e8e0d0] bg-[#fdf9f3] p-5 transition-all hover:border-yellow-300 hover:shadow-sm">
    <div className="flex items-center gap-2 mb-4">
      <div className={`p-1.5 rounded-lg ${color}`}>
        <Icon size={15} />
      </div>
      <span className="text-sm font-semibold text-gray-700">{label}</span>
    </div>
    {children}
  </div>
);

const inputCls =
  "w-full border border-[#e8e0d0] bg-white rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 outline-none transition";

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
const CreateBot = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    language: "",
    faqs: [],
    pricing: [],
    docs: "",
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic"); // basic | knowledge

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* ── FAQs ── */
  const addFaq = () =>
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));

  const updateFaq = (i, field, val) =>
    setFormData((prev) => {
      const faqs = [...prev.faqs];
      faqs[i] = { ...faqs[i], [field]: val };
      return { ...prev, faqs };
    });

  const removeFaq = (i) =>
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, idx) => idx !== i),
    }));

  /* ── Pricing ── */
  const addPricing = () =>
    setFormData((prev) => ({
      ...prev,
      pricing: [...prev.pricing, { plan: "", price: "", features: "" }],
    }));

  const updatePricing = (i, field, val) =>
    setFormData((prev) => {
      const pricing = [...prev.pricing];
      pricing[i] = { ...pricing[i], [field]: val };
      return { ...prev, pricing };
    });

  const removePricing = (i) =>
    setFormData((prev) => ({
      ...prev,
      pricing: prev.pricing.filter((_, idx) => idx !== i),
    }));

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔥 Clean FAQs (remove empty ones)
      const cleanedFaqs = formData.faqs
        .filter(f => f.question.trim() && f.answer.trim())
        .map(f => ({
          question: f.question.trim(),
          answer: f.answer.trim(),
        }));

      // 🔥 Clean Pricing
      const cleanedPricing = formData.pricing
        .filter(p => p.plan.trim() || p.price.trim() || p.features.trim())
        .map(p => ({
          plan: p.plan.trim(),
          price: p.price.trim(),
          features: p.features
            ? p.features.split(",").map(f => f.trim()).filter(Boolean)
            : [],
        }));

      // 🔥 Final Payload (Backend Compatible)
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        language: formData.language.trim(),
        faqs: cleanedFaqs,
        pricing: cleanedPricing,
        docs: formData.docs.trim(),
      };

      console.log("Sending Payload:", payload);

      await api.post("/bots", payload);

      navigate("/");
    } catch (error) {
      console.error("Bot Create Error:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to create bot");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: Bot },
    { id: "knowledge", label: "Knowledge Base", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-[#F6F1E8] px-4 py-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ════ LEFT — FORM ════ */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col">

          {/* Header */}
          <div className="px-8 pt-8 pb-0">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-yellow-400 p-3 rounded-2xl shadow-sm">
                <Bot size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Create New Bot</h2>
                <p className="text-sm text-gray-400">Configure your multilingual AI assistant</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-[#F6F1E8] p-1 rounded-xl w-fit mb-6">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === id
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Form body */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 px-8 pb-8">
            <div className="flex-1 space-y-4">

              {/* ── BASIC TAB ── */}
              {activeTab === "basic" && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Bot Name */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                      Bot Name <span className="text-yellow-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="SupportBot"
                      className={inputCls}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Helps customers with product queries..."
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  {/* Language */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                      Primary Language <span className="text-yellow-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="language"
                        required
                        value={formData.language}
                        onChange={handleChange}
                        className={`${inputCls} appearance-none pr-10 cursor-pointer`}
                      >
                        <option value="">Select Language</option>
                        <option value="English">🇬🇧 English</option>
                        <option value="Hindi">🇮🇳 Hindi</option>
                        <option value="Spanish">🇪🇸 Spanish</option>
                        <option value="French">🇫🇷 French</option>
                        <option value="German">🇩🇪 German</option>
                        <option value="Portuguese">🇧🇷 Portuguese</option>
                        <option value="Arabic">🇸🇦 Arabic</option>
                      </select>
                      <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Docs */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                      Documentation / Context
                    </label>
                    <textarea
                      name="docs"
                      rows={3}
                      value={formData.docs}
                      onChange={handleChange}
                      placeholder="Paste product docs, policies, or any text context the bot should know..."
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                </div>
              )}

              {/* ── KNOWLEDGE TAB ── */}
              {activeTab === "knowledge" && (
                <div className="space-y-5 animate-fadeIn">

                  {/* FAQs */}
                  <Section icon={HelpCircle} label="FAQs" color="bg-blue-100 text-blue-600">
                    <div className="space-y-3">
                      {formData.faqs.map((faq, i) => (
                        <div key={i} className="bg-white rounded-xl p-3 border border-[#e8e0d0] space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-yellow-500 w-4">Q</span>
                            <input
                              value={faq.question}
                              onChange={(e) => updateFaq(i, "question", e.target.value)}
                              placeholder="What is your return policy?"
                              className={`${inputCls} flex-1`}
                            />
                            <button
                              type="button"
                              onClick={() => removeFaq(i)}
                              className="p-1.5 text-gray-300 hover:text-red-400 transition rounded-lg hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-bold text-gray-400 w-4 mt-2.5">A</span>
                            <textarea
                              value={faq.answer}
                              onChange={(e) => updateFaq(i, "answer", e.target.value)}
                              placeholder="We accept returns within 30 days..."
                              rows={2}
                              className={`${inputCls} flex-1 resize-none`}
                            />
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addFaq}
                        className="flex items-center gap-2 text-sm text-yellow-600 hover:text-yellow-700 font-medium px-3 py-2 rounded-xl hover:bg-yellow-50 transition w-full"
                      >
                        <Plus size={15} /> Add FAQ
                      </button>
                    </div>
                  </Section>

                  {/* Pricing */}
                  <Section icon={DollarSign} label="Pricing Plans" color="bg-green-100 text-green-600">
                    <div className="space-y-3">
                      {formData.pricing.map((p, i) => (
                        <div key={i} className="bg-white rounded-xl p-3 border border-[#e8e0d0] space-y-2">
                          <div className="flex gap-2">
                            <input
                              value={p.plan}
                              onChange={(e) => updatePricing(i, "plan", e.target.value)}
                              placeholder="Plan name (e.g. Pro)"
                              className={`${inputCls} flex-1`}
                            />
                            <input
                              value={p.price}
                              onChange={(e) => updatePricing(i, "price", e.target.value)}
                              placeholder="$29/mo"
                              className={`${inputCls} w-28`}
                            />
                            <button
                              type="button"
                              onClick={() => removePricing(i)}
                              className="p-1.5 text-gray-300 hover:text-red-400 transition rounded-lg hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <input
                            value={p.features}
                            onChange={(e) => updatePricing(i, "features", e.target.value)}
                            placeholder="Features (comma-separated): Unlimited messages, Priority support"
                            className={inputCls}
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addPricing}
                        className="flex items-center gap-2 text-sm text-yellow-600 hover:text-yellow-700 font-medium px-3 py-2 rounded-xl hover:bg-yellow-50 transition w-full"
                      >
                        <Plus size={15} /> Add Pricing Plan
                      </button>
                    </div>
                  </Section>

                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between items-center pt-6 mt-4 border-t border-[#f0e8d8]">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <div className="flex gap-3">
                {activeTab === "basic" && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("knowledge")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-yellow-300 text-yellow-700 text-sm font-medium hover:bg-yellow-50 transition"
                  >
                    Next <Sparkles size={14} />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 text-gray-900 font-semibold px-6 py-2.5 rounded-xl shadow-sm transition text-sm"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Bot size={15} /> Create Bot
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ════ RIGHT — CHAT PREVIEW ════ */}
        <div className="bg-white rounded-3xl shadow-lg p-6 flex flex-col h-[600px]">
          <ChatPreview
            botName={formData.name}
            botDescription={formData.description}
          />
        </div>

      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default CreateBot;


/* ════════════════════════════════════════════
   CHAT PREVIEW COMPONENT
════════════════════════════════════════════ */
const ChatPreview = ({ botName, botDescription }) => {
  const bottomRef = useRef(null);

  const getInitialMessages = () => [
    { from: "bot", text: `Hi! I'm ${botName || "your AI assistant"} 👋` },
    { from: "user", text: "What can you do?" },
    { from: "bot", text: botDescription || "I help answer customer queries." },
  ];

  const [messages, setMessages] = useState(getInitialMessages());
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  useEffect(() => { setMessages(getInitialMessages()); }, [botName, botDescription]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: botDescription || "I'm here to assist you with any customer queries." },
      ]);
      setTyping(false);
    }, 1200);
  };

  const reset = () => setMessages(getInitialMessages());

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#f0e8d8] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 p-2 rounded-xl shadow-sm">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900">{botName || "Bot Preview"}</h3>
            <p className="text-xs text-gray-400">Live conversation simulation</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-green-500 font-medium">Online</span>
        </div>
      </div>

      {/* Chat body */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-end gap-2 ${m.from === "user" ? "justify-end" : ""}`}
            style={{ animation: `fadeIn 0.2s ease-out ${i * 0.05}s both` }}
          >
            {m.from === "bot" && (
              <div className="bg-yellow-400 w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold shadow-sm flex-shrink-0">
                B
              </div>
            )}
            <div
              className={`px-4 py-2.5 text-sm rounded-2xl max-w-[78%] shadow-sm ${m.from === "user"
                  ? "bg-yellow-400 text-gray-900 rounded-br-sm"
                  : "bg-[#f5f0e8] border border-[#e8e0d0] text-gray-800 rounded-bl-sm"
                }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400 w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold shadow-sm">
              B
            </div>
            <div className="px-4 py-3 bg-[#f5f0e8] border border-[#e8e0d0] rounded-2xl rounded-bl-sm flex gap-1">
              {[0, 1, 2].map((n) => (
                <span
                  key={n}
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                  style={{ animation: `bounce 1s ease-in-out ${n * 0.2}s infinite` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="flex-1 border border-[#e8e0d0] rounded-xl px-4 py-2.5 text-sm bg-[#f5f0e8] focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 outline-none transition placeholder-gray-400"
          placeholder="Type a message..."
        />
        <button
          onClick={send}
          className="px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 font-semibold shadow-sm transition flex items-center gap-1.5 text-sm"
        >
          <Send size={14} /> Send
        </button>
      </div>

      <button
        onClick={reset}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mt-3 self-end transition"
      >
        <RotateCcw size={11} /> Reset Chat
      </button>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-4px); } }
      `}</style>
    </>
  );
};