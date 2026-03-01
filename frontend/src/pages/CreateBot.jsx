import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  Plus,
  Trash2,
  ChevronDown,
  Sparkles,
  FileText,
  DollarSign,
  HelpCircle,
  RotateCcw,
  Send,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

// ═══ COMPREHENSIVE LANGUAGE LIST ═══
// Sorted by number of native speakers (most used by humans)
const LANGUAGES = [
  // Top 10 most spoken languages
  { code: "en", label: "English", flag: "🇬🇧", speakers: "372M" },
  { code: "hi", label: "Hindi", flag: "🇮🇳", speakers: "345M" },
  { code: "es", label: "Spanish", flag: "🇪🇸", speakers: "460M" },
  { code: "fr", label: "French", flag: "🇫🇷", speakers: "280M" },
  { code: "ar", label: "Arabic", flag: "🇸🇦", speakers: "310M" },
  { code: "pt", label: "Portuguese", flag: "🇧🇷", speakers: "252M" },
  { code: "ru", label: "Russian", flag: "🇷🇺", speakers: "154M" },
  { code: "ja", label: "Japanese", flag: "🇯🇵", speakers: "125M" },
  { code: "de", label: "German", flag: "🇩🇪", speakers: "132M" },

  // Next most spoken languages
  { code: "vi", label: "Vietnamese", flag: "🇻🇳", speakers: "85M" },
  { code: "tr", label: "Turkish", flag: "🇹🇷", speakers: "88M" },
  { code: "it", label: "Italian", flag: "🇮🇹", speakers: "85M" },
  { code: "pl", label: "Polish", flag: "🇵🇱", speakers: "45M" },
  { code: "uk", label: "Ukrainian", flag: "🇺🇦", speakers: "41M" },
  { code: "nl", label: "Dutch", flag: "🇳🇱", speakers: "25M" },

  // Additional widely used languages
  { code: "tr", label: "Turkish", flag: "🇹🇷", speakers: "88M" },
  { code: "sw", label: "Swahili", flag: "🇰🇪", speakers: "100M" },
  { code: "te", label: "Telugu", flag: "🇮🇳", speakers: "74M" },
  { code: "mr", label: "Marathi", flag: "🇮🇳", speakers: "83M" },
  { code: "bn", label: "Bengali", flag: "🇧🇩", speakers: "265M" },
  { code: "pa", label: "Punjabi", flag: "🇮🇳", speakers: "93M" },
  { code: "cs", label: "Czech", flag: "🇨🇿", speakers: "10.5M" },
];

// ═══ CONSTANTS ═══
const CONSTANTS = {
  LANGUAGES,
  TABS: [
    { id: "basic", label: "Basic Info", icon: Bot },
    { id: "knowledge", label: "Knowledge Base", icon: Sparkles },
  ],
  VALIDATION_RULES: {
    name: { required: true, minLength: 1, maxLength: 100 },
    language: { required: true },
    description: { maxLength: 500 },
    docs: { maxLength: 5000 },
    faqQuestion: { maxLength: 300 },
    faqAnswer: { maxLength: 1000 },
    pricingPlan: { maxLength: 50 },
    pricingPrice: { maxLength: 50 },
    pricingFeatures: { maxLength: 500 },
  },
  INPUT_CLASSES: {
    base: "w-full border border-[#e8e0d0] bg-white rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 outline-none transition",
    textarea: "resize-none",
    select: "appearance-none pr-10 cursor-pointer",
  },
  CHAT_PREVIEW_DELAY: 1200,
  API_TIMEOUT: 30000,
};

// ═══ CUSTOM HOOKS ═══

/**
 * Hook for managing FAQ state
 */
const useFaqManager = () => {
  const [faqs, setFaqs] = useState([]);

  const addFaq = useCallback(() => {
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
  }, []);

  const updateFaq = useCallback((index, field, value) => {
    setFaqs((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const removeFaq = useCallback((index) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const cleanFaqs = useCallback(() => {
    return faqs
      .filter((f) => f.question.trim() && f.answer.trim())
      .map((f) => ({
        question: f.question.trim(),
        answer: f.answer.trim(),
      }));
  }, [faqs]);

  return { faqs, addFaq, updateFaq, removeFaq, cleanFaqs };
};

/**
 * Hook for managing Pricing state
 */
const usePricingManager = () => {
  const [pricing, setPricing] = useState([]);

  const addPricing = useCallback(() => {
    setPricing((prev) => [...prev, { plan: "", price: "", features: "" }]);
  }, []);

  const updatePricing = useCallback((index, field, value) => {
    setPricing((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const removePricing = useCallback((index) => {
    setPricing((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const cleanPricing = useCallback(() => {
    return pricing
      .filter(
        (p) =>
          (p.plan || "").trim() ||
          (p.price || "").trim() ||
          (p.features || "").trim()
      )
      .map((p) => ({
        plan: (p.plan || "").trim(),
        price: (p.price || "").trim(),
        features: (p.features || "")
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
      }));
  }, [pricing]);

  return { pricing, addPricing, updatePricing, removePricing, cleanPricing };
};

/**
 * Hook for managing form state
 */
const useFormManager = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    language: "",
    docs: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  }, [errors]);

  const validate = useCallback(() => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Bot name is required";
    } else if (formData.name.length > CONSTANTS.VALIDATION_RULES.name.maxLength) {
      newErrors.name = `Bot name cannot exceed ${CONSTANTS.VALIDATION_RULES.name.maxLength} characters`;
    }

    if (!formData.language) {
      newErrors.language = "Language is required";
    }

    if (formData.description.length > CONSTANTS.VALIDATION_RULES.description.maxLength) {
      newErrors.description = `Description cannot exceed ${CONSTANTS.VALIDATION_RULES.description.maxLength} characters`;
    }

    if (formData.docs.length > CONSTANTS.VALIDATION_RULES.docs.maxLength) {
      newErrors.docs = `Documentation cannot exceed ${CONSTANTS.VALIDATION_RULES.docs.maxLength} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const reset = useCallback(() => {
    setFormData({
      name: "",
      description: "",
      language: "",
      docs: "",
    });
    setErrors({});
  }, []);

  return { formData, handleChange, validate, reset, errors };
};

// ═══ REUSABLE COMPONENTS ═══

/**
 * Section wrapper component
 */
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

/**
 * FormInput component - handles text, textarea, and select
 */
const FormInput = ({
  type = "text",
  label,
  name,
  required = false,
  error,
  value,
  onChange,
  placeholder,
  rows,
  options,
  maxLength,
  showCharCount = false,
  ...props
}) => {
  const handleChange = (e) => {
    const { value } = e.target;

    // Enforce max length
    if (maxLength && value.length > maxLength) {
      return;
    }

    onChange({ target: { name, value } });
  };

  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
        {label}
        {required && <span className="text-yellow-500 ml-1">*</span>}
      </label>

      {type === "select" ? (
        <div className="relative">
          <select
            name={name}
            value={value}
            onChange={handleChange}
            className={`${CONSTANTS.INPUT_CLASSES.base} ${CONSTANTS.INPUT_CLASSES.select}`}
            {...props}
          >
            <option value="">Select {label}</option>
            {options?.map((opt) => (
              <option key={opt.code || opt.value} value={opt.code || opt.value}>
                {opt.flag && `${opt.flag} `}
                {opt.label || opt.name}
                {opt.speakers && ` (${opt.speakers})`}
              </option>
            ))}
          </select>
          <ChevronDown
            size={15}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      ) : type === "textarea" ? (
        <div>
          <textarea
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            rows={rows || 3}
            maxLength={maxLength}
            className={`${CONSTANTS.INPUT_CLASSES.base} ${CONSTANTS.INPUT_CLASSES.textarea}`}
            {...props}
          />
          {showCharCount && maxLength && (
            <p className="text-xs text-gray-400 mt-1">
              {value.length} / {maxLength}
            </p>
          )}
        </div>
      ) : (
        <div>
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            maxLength={maxLength}
            className={CONSTANTS.INPUT_CLASSES.base}
            {...props}
          />
          {showCharCount && maxLength && (
            <p className="text-xs text-gray-400 mt-1">
              {value.length} / {maxLength}
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};

/**
 * FAQ Item Component
 */
const FaqItem = ({ faq, index, onUpdate, onRemove }) => (
  <div className="bg-white rounded-xl p-3 border border-[#e8e0d0] space-y-2">
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-yellow-500 w-4">Q</span>
      <input
        value={faq.question}
        onChange={(e) => onUpdate(index, "question", e.target.value)}
        placeholder="What is your return policy?"
        maxLength={CONSTANTS.VALIDATION_RULES.faqQuestion.maxLength}
        className={`${CONSTANTS.INPUT_CLASSES.base} flex-1`}
      />
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="p-1.5 text-gray-300 hover:text-red-400 transition rounded-lg hover:bg-red-50"
        aria-label="Remove FAQ"
      >
        <Trash2 size={14} />
      </button>
    </div>
    <div className="flex items-start gap-2">
      <span className="text-xs font-bold text-gray-400 w-4 mt-2.5">A</span>
      <textarea
        value={faq.answer}
        onChange={(e) => onUpdate(index, "answer", e.target.value)}
        placeholder="We accept returns within 30 days..."
        rows={2}
        maxLength={CONSTANTS.VALIDATION_RULES.faqAnswer.maxLength}
        className={`${CONSTANTS.INPUT_CLASSES.base} ${CONSTANTS.INPUT_CLASSES.textarea} flex-1`}
      />
    </div>
  </div>
);

/**
 * Pricing Item Component
 */
const PricingItem = ({ pricing, index, onUpdate, onRemove }) => (
  <div className="bg-white rounded-2xl p-4 border border-[#e8e0d0] space-y-3 shadow-sm hover:shadow-md transition">
    <div className="flex gap-3 items-center">
      <div className="flex-1">
        <label className="text-[11px] text-gray-400 uppercase block mb-1">
          Plan Name
        </label>
        <input
          value={pricing.plan || ""}
          onChange={(e) => onUpdate(index, "plan", e.target.value)}
          placeholder="Pro"
          maxLength={CONSTANTS.VALIDATION_RULES.pricingPlan.maxLength}
          className={CONSTANTS.INPUT_CLASSES.base}
        />
      </div>

      <div className="w-32">
        <label className="text-[11px] text-gray-400 uppercase block mb-1">
          Price
        </label>
        <input
          value={pricing.price || ""}
          onChange={(e) => onUpdate(index, "price", e.target.value)}
          placeholder="$29/mo"
          maxLength={CONSTANTS.VALIDATION_RULES.pricingPrice.maxLength}
          className={CONSTANTS.INPUT_CLASSES.base}
        />
      </div>

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="mt-6 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
        aria-label="Remove pricing plan"
      >
        <Trash2 size={16} />
      </button>
    </div>

    <div>
      <label className="text-[11px] text-gray-400 uppercase block mb-1">
        Features (comma separated)
      </label>
      <input
        value={pricing.features || ""}
        onChange={(e) => onUpdate(index, "features", e.target.value)}
        placeholder="Unlimited messages, Priority support, API access"
        maxLength={CONSTANTS.VALIDATION_RULES.pricingFeatures.maxLength}
        className={CONSTANTS.INPUT_CLASSES.base}
      />
      <p className="text-[11px] text-gray-400 mt-1">
        Separate features using commas.
      </p>
    </div>
  </div>
);

/**
 * Loading Button Component
 */
const LoadingButton = ({ loading, children, ...props }) => (
  <button
    {...props}
    disabled={loading || props.disabled}
    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 text-gray-900 font-semibold px-6 py-2.5 rounded-xl shadow-sm transition text-sm"
  >
    {loading ? (
      <>
        <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
        {typeof children === "string" ? `${children}...` : children}
      </>
    ) : (
      children
    )}
  </button>
);

// ═══ MAIN COMPONENT ═══

const CreateBot = () => {
  const navigate = useNavigate();
  const { formData, handleChange, validate, reset, errors } = useFormManager();
  const { faqs, addFaq, updateFaq, removeFaq, cleanFaqs } = useFaqManager();
  const { pricing, addPricing, updatePricing, removePricing, cleanPricing } =
    usePricingManager();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Validate basic form
      if (!validate()) {
        toast.error("Please fix the errors above");
        return;
      }

      setLoading(true);

      try {
        const payload = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          language: formData.language,
          faqs: cleanFaqs(),
          pricing: cleanPricing(),
          docs: formData.docs.trim(),
        };

        // Optional: Log payload in development
        if (process.env.NODE_ENV === "development") {
          console.log("Creating bot with payload:", payload);
        }

        // Set request timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          CONSTANTS.API_TIMEOUT
        );

        const response = await api.post("/bots", payload, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        toast.success("Bot created successfully! 🎉");
        reset();
        // Navigate with state to show success
        navigate("/", { state: { botCreated: true } });
      } catch (error) {
        console.error("Bot creation error:", error);

        // Granular error handling
        let errorMessage = "Failed to create bot";

        if (error.name === "AbortError") {
          errorMessage = "Request timed out. Please try again.";
        } else if (error.response?.status === 400) {
          errorMessage =
            error.response.data?.message ||
            "Invalid bot configuration. Please check your inputs.";
        } else if (error.response?.status === 409) {
          errorMessage = "A bot with this name already exists.";
        } else if (error.response?.status >= 500) {
          errorMessage =
            "Server error. Please try again later or contact support.";
        } else if (!error.response) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        }

        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [formData, validate, reset, cleanFaqs, cleanPricing, navigate]
  );

  return (
    <div className="min-h-screen bg-[#F6F1E8] px-4 py-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT — FORM */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-8 pt-8 pb-0">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-yellow-400 p-3 rounded-2xl shadow-sm">
                <Bot size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Bot</h1>
                <p className="text-sm text-gray-400">
                  Configure your multilingual AI assistant
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-[#F6F1E8] p-1 rounded-xl w-fit mb-6">
              {CONSTANTS.TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === id
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  aria-selected={activeTab === id}
                  role="tab"
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Form - Make scrollable if content overflows */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 px-8 pb-8 overflow-y-auto">
            <div className="flex-1 space-y-4">
              {/* BASIC TAB */}
              {activeTab === "basic" && (
                <div className="space-y-4 animate-fadeIn">
                  <FormInput
                    type="text"
                    label="Bot Name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="SupportBot"
                    error={errors.name}
                    maxLength={CONSTANTS.VALIDATION_RULES.name.maxLength}
                    showCharCount
                  />

                  <FormInput
                    type="textarea"
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Helps customers with product queries..."
                    error={errors.description}
                    maxLength={CONSTANTS.VALIDATION_RULES.description.maxLength}
                    showCharCount
                    rows={3}
                  />

                  <FormInput
                    type="select"
                    label="Primary Language"
                    name="language"
                    required
                    value={formData.language}
                    onChange={handleChange}
                    error={errors.language}
                    options={CONSTANTS.LANGUAGES}
                  />

                  <FormInput
                    type="textarea"
                    label="Documentation / Context"
                    name="docs"
                    value={formData.docs}
                    onChange={handleChange}
                    placeholder="Paste product docs, policies, or any text context the bot should know..."
                    error={errors.docs}
                    maxLength={CONSTANTS.VALIDATION_RULES.docs.maxLength}
                    showCharCount
                    rows={3}
                  />
                </div>
              )}

              {/* KNOWLEDGE TAB */}
              {activeTab === "knowledge" && (
                <div className="space-y-5 animate-fadeIn">
                  {/* FAQs */}
                  <Section
                    icon={HelpCircle}
                    label="FAQs"
                    color="bg-blue-100 text-blue-600"
                  >
                    <div className="space-y-3">
                      {faqs.length === 0 && (
                        <p className="text-xs text-gray-400 italic">
                          No FAQs added yet. Click below to add one.
                        </p>
                      )}
                      {faqs.map((faq, i) => (
                        <FaqItem
                          key={i}
                          faq={faq}
                          index={i}
                          onUpdate={updateFaq}
                          onRemove={removeFaq}
                        />
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
                  <Section
                    icon={DollarSign}
                    label="Pricing Plans"
                    color="bg-green-100 text-green-600"
                  >
                    <div className="space-y-4">
                      {pricing.length === 0 && (
                        <div className="text-xs text-gray-400 bg-[#f5f0e8] border border-dashed border-[#e8e0d0] rounded-xl p-4 text-center">
                          No pricing plans added yet.
                        </div>
                      )}
                      {pricing.map((p, i) => (
                        <PricingItem
                          key={i}
                          pricing={p}
                          index={i}
                          onUpdate={updatePricing}
                          onRemove={removePricing}
                        />
                      ))}
                      <button
                        type="button"
                        onClick={addPricing}
                        className="flex items-center justify-center gap-2 text-sm text-yellow-700 font-medium px-4 py-2.5 rounded-xl border border-dashed border-yellow-300 hover:bg-yellow-50 transition w-full"
                      >
                        <Plus size={15} />
                        Add Pricing Plan
                      </button>
                    </div>
                  </Section>
                </div>
              )}
            </div>

            {/* Footer Buttons - Sticky */}
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
                <LoadingButton loading={loading} type="submit">
                  <Bot size={15} /> Create Bot
                </LoadingButton>
              </div>
            </div>
          </form>
        </div>

        {/* RIGHT — CHAT PREVIEW */}
        <ChatPreview
          botName={formData.name}
          botDescription={formData.description}
        />
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CreateBot;

// ═══ CHAT PREVIEW COMPONENT ═══
// 🔥 FIXED: Scroll is now contained within the chat preview container only!

const ChatPreview = ({ botName, botDescription }) => {
  // Ref for the messages container (NOT the page)
  const messagesContainerRef = useRef(null);
  const bottomRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const getInitialMessages = useCallback(
    () => [
      { from: "bot", text: `Hi! I'm ${botName || "your AI assistant"} 👋` },
      { from: "user", text: "What can you do?" },
      { from: "bot", text: botDescription || "I help answer customer queries." },
    ],
    [botName, botDescription]
  );

  useEffect(() => {
    setMessages(getInitialMessages());
  }, [getInitialMessages]);

  // 🔥 FIX: Scroll only the messages container, not the entire page!
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const send = useCallback(() => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setTyping(true);

    const timeoutId = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text:
            botDescription || "I'm here to assist you with any customer queries.",
        },
      ]);
      setTyping(false);
    }, CONSTANTS.CHAT_PREVIEW_DELAY);

    return () => clearTimeout(timeoutId);
  }, [input, botDescription]);

  const reset = useCallback(() => {
    setMessages(getInitialMessages());
    setInput("");
    setTyping(false);
  }, [getInitialMessages]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    },
    [send]
  );

  return (
    <div className="rounded-3xl shadow-lg p-6 flex flex-col h-[600px] bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#f0e8d8] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 p-2 rounded-xl shadow-sm">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900">
              {botName || "Bot Preview"}
            </h3>
            <p className="text-xs text-gray-400">Live conversation simulation</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-green-500 font-medium">Online</span>
        </div>
      </div>

      {/* Messages Container - 🔥 FIXED: Scroll contained here only! */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin"
      >
        {messages.map((m, i) => (
          <ChatMessage key={i} message={m} index={i} />
        ))}

        {typing && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border border-[#e8e0d0] rounded-xl px-4 py-2.5 text-sm bg-[#f5f0e8] focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 outline-none transition placeholder-gray-400"
          placeholder="Type a message..."
          aria-label="Chat message input"
        />
        <button
          onClick={send}
          className="px-4 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 font-semibold shadow-sm transition flex items-center gap-1.5 text-sm"
          aria-label="Send message"
        >
          <Send size={14} /> Send
        </button>
      </div>

      <button
        onClick={reset}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mt-3 self-end transition"
        aria-label="Reset chat"
      >
        <RotateCcw size={11} /> Reset Chat
      </button>
    </div>
  );
};

/**
 * ChatMessage component
 */
const ChatMessage = ({ message, index }) => (
  <div
    className={`flex items-end gap-2 ${message.from === "user" ? "justify-end" : ""}`}
    style={{ animation: `fadeIn 0.2s ease-out ${index * 0.05}s both` }}
  >
    {message.from === "bot" && (
      <div className="bg-yellow-400 w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold shadow-sm flex-shrink-0">
        B
      </div>
    )}
    <div
      className={`px-4 py-2.5 text-sm rounded-2xl max-w-[78%] shadow-sm ${
        message.from === "user"
          ? "bg-yellow-400 text-gray-900 rounded-br-sm"
          : "bg-[#f5f0e8] border border-[#e8e0d0] text-gray-800 rounded-bl-sm"
      }`}
    >
      {message.text}
    </div>
  </div>
);

/**
 * TypingIndicator component
 */
const TypingIndicator = () => (
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
);