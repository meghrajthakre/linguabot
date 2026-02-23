import React, { useState } from "react";
import axios from "axios";

const TrainingPanel = () => {
  const [formData, setFormData] = useState({
    websiteName: "",
    description: "",
    faqs: [{ question: "", answer: "" }],
    pricing: [{ plan: "", price: "", features: "" }],
    docs: "",
  });

  const handleFAQChange = (index, field, value) => {
    const updated = [...formData.faqs];
    updated[index][field] = value;
    setFormData({ ...formData, faqs: updated });
  };

  const handlePricingChange = (index, field, value) => {
    const updated = [...formData.pricing];
    updated[index][field] = value;
    setFormData({ ...formData, pricing: updated });
  };

  const addFAQ = () => {
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { question: "", answer: "" }],
    });
  };

  const addPricing = () => {
    setFormData({
      ...formData,
      pricing: [...formData.pricing, { plan: "", price: "", features: "" }],
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/train", formData);
      alert("Bot trained successfully 🚀");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl">

      <h3 className="text-xl font-bold mb-2 text-gray-800">
        Train Your Bot
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Add FAQs, pricing & business data
      </p>

      {/* Website Name */}
      <input
        type="text"
        placeholder="Website Name"
        className="w-full p-3 mb-4 rounded-xl border focus:ring-2 focus:ring-yellow-400 outline-none"
        onChange={(e) =>
          setFormData({ ...formData, websiteName: e.target.value })
        }
      />

      {/* Description */}
      <textarea
        placeholder="Website Description"
        className="w-full h-24 p-3 mb-4 rounded-xl border focus:ring-2 focus:ring-yellow-400 outline-none"
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />

      {/* FAQs */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 text-gray-700">FAQs</h4>
        {formData.faqs.map((faq, index) => (
          <div key={index} className="mb-4 space-y-2">
            <input
              type="text"
              placeholder="Question"
              className="w-full p-2 rounded-lg border"
              onChange={(e) =>
                handleFAQChange(index, "question", e.target.value)
              }
            />
            <textarea
              placeholder="Answer"
              className="w-full p-2 rounded-lg border"
              onChange={(e) =>
                handleFAQChange(index, "answer", e.target.value)
              }
            />
          </div>
        ))}
        <button
          onClick={addFAQ}
          className="text-yellow-500 text-sm font-medium"
        >
          + Add FAQ
        </button>
      </div>

      {/* Pricing */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 text-gray-700">Pricing Plans</h4>
        {formData.pricing.map((plan, index) => (
          <div key={index} className="mb-4 space-y-2">
            <input
              type="text"
              placeholder="Plan Name"
              className="w-full p-2 rounded-lg border"
              onChange={(e) =>
                handlePricingChange(index, "plan", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Price"
              className="w-full p-2 rounded-lg border"
              onChange={(e) =>
                handlePricingChange(index, "price", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Features (comma separated)"
              className="w-full p-2 rounded-lg border"
              onChange={(e) =>
                handlePricingChange(index, "features", e.target.value)
              }
            />
          </div>
        ))}
        <button
          onClick={addPricing}
          className="text-yellow-500 text-sm font-medium"
        >
          + Add Pricing
        </button>
      </div>

      {/* Docs */}
      <textarea
        placeholder="Documentation / Policies"
        className="w-full h-28 p-3 mb-4 rounded-xl border focus:ring-2 focus:ring-yellow-400 outline-none"
        onChange={(e) =>
          setFormData({ ...formData, docs: e.target.value })
        }
      />

      <button
        onClick={handleSubmit}
        className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-xl shadow-md transition"
      >
        Train Bot 🚀
      </button>
    </div>
  );
};

export default TrainingPanel;