import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Save, Plus, Trash2 } from "lucide-react";
import api from "../api/axios";

const inputCls =
  "w-full border border-[#e8e0d0] bg-[#fdf9f3] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 outline-none transition";

const BotEditor = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    language: "English",
    faqs: [],
    pricing: [],
    docs: "",
  });

  /* ================= FETCH BOT ================= */
  useEffect(() => {
    const fetchBot = async () => {
      try {
        const { data } = await api.get(`/bots/${id}`);
        setFormData({
          name: data.name || "",
          description: data.description || "",
          language: data.language || "English",
          faqs: data.faqs || [],
          pricing: data.pricing || [],
          docs: data.docs || "",
        });
      } catch (err) {
        toast.error("Failed to load bot ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchBot();
  }, [id]);

  /* ================= FAQ HANDLERS ================= */
  const addFaq = () =>
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }]
    }));

  const updateFaq = (i, field, value) => {
    const updated = [...formData.faqs];
    updated[i][field] = value;
    setFormData({ ...formData, faqs: updated });
  };

  const removeFaq = (i) => {
    const updated = formData.faqs.filter((_, idx) => idx !== i);
    setFormData({ ...formData, faqs: updated });
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put(`/bots/${id}`, formData);
      toast.success("Bot updated successfully 🚀");
    } catch {
      toast.error("Update failed ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
        <div className="animate-spin w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8] px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              ⚙️ Bot Editor
            </h1>
            <p className="text-sm text-gray-400">
              Customize your AI assistant
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 px-6 py-2.5 rounded-xl font-semibold shadow-sm transition disabled:opacity-50"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save Changes
          </button>
        </div>

        {/* BASIC INFO CARD */}
        <div className="bg-white border border-[#e8e0d0] rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Basic Info
          </h2>

          <div className="space-y-4">
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Bot Name"
              className={inputCls}
            />

            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Bot Description"
              rows={3}
              className={`${inputCls} resize-none`}
            />

            <select
              value={formData.language}
              onChange={(e) =>
                setFormData({ ...formData, language: e.target.value })
              }
              className={inputCls}
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Portuguese</option>
              <option>Arabic</option>
              <option>Japanese</option>
              <option>Chinese</option>
              <option>Korean</option>
              <option>Russian</option>
            </select>
          </div>
        </div>

        {/* FAQ SECTION */}
        <div className="bg-white border border-[#e8e0d0] rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              FAQs
            </h2>

            <button
              onClick={addFaq}
              className="flex items-center gap-2 text-sm text-yellow-700 hover:text-yellow-800 font-medium"
            >
              <Plus size={14} />
              Add FAQ
            </button>
          </div>

          <div className="space-y-4">
            {formData.faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-[#fdf9f3] border border-[#e8e0d0] rounded-xl p-4 space-y-3 transition hover:shadow-sm"
              >
                <input
                  value={faq.question}
                  onChange={(e) =>
                    updateFaq(i, "question", e.target.value)
                  }
                  placeholder="Question"
                  className={inputCls}
                />

                <textarea
                  value={faq.answer}
                  onChange={(e) =>
                    updateFaq(i, "answer", e.target.value)
                  }
                  placeholder="Answer"
                  rows={2}
                  className={`${inputCls} resize-none`}
                />

                <div className="flex justify-end">
                  <button
                    onClick={() => removeFaq(i)}
                    className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {formData.faqs.length === 0 && (
              <div className="text-sm text-gray-400 text-center py-6 border border-dashed border-[#e8e0d0] rounded-xl">
                No FAQs added yet
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BotEditor;