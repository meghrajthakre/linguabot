import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { Send } from "lucide-react";
import BackButton from "../components/BackButton";

const BotView = () => {
    const { id } = useParams();

    const [bot, setBot] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const bottomRef = useRef(null);

    /* ===============================
       FETCH BOT INFO
    ============================== */
    useEffect(() => {
        const fetchBot = async () => {
            const res = await api.get(`/bots/${id}`);
            setBot(res.data);

            setMessages([
                {
                    from: "bot",
                    text: `Hi! I'm ${res.data.name} 👋 How can I help you?`,
                },
            ]);
        };

        fetchBot();
    }, [id]);

    /* ===============================
       AUTO SCROLL
    ============================== */
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    /* ===============================
       SEND MESSAGE
    ============================== */
    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input;

        setMessages((prev) => [
            ...prev,
            { from: "user", text: userMessage },
        ]);

        setInput("");
        setLoading(true);

        try {
            const res = await api.post(`/chat/${id}`, {
                message: userMessage,
            });

            setMessages((prev) => [
                ...prev,
                {
                    from: "bot",
                    text: res.data.aiResponse,
                    time: res.data.responseTimeMs,
                },
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    from: "bot",
                    text: "Something went wrong. Please try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    if (!bot) return null;

    return (
        <div className="min-h-screen bg-[#F6F1E8] flex items-center justify-center p-6">

            <div className="w-80 max-w-3xl h-[70vh] bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl flex flex-col">

                {/* HEADER */}
                {/* HEADER */}
                <div className="p-5 border-b border-white/40 flex items-center justify-between">

                    {/* Left Side */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-yellow-400/20 flex items-center justify-center text-lg">
                            🤖
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-800">
                                {bot.name}
                            </h2>
                            <p className="text-xs text-gray-500">
                                {bot.language?.toUpperCase()} AI Assistant
                            </p>
                        </div>
                    </div>

                    {/* Right Side Back Button */}
                    <BackButton label="Back" />

                </div>

                {/* CHAT BODY */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">

                    {messages.map((m, i) => (
                        <div
                            key={i}
                            className={`flex ${m.from === "user" ? "justify-end" : ""}`}
                        >
                            <div
                                className={`px-4 py-3 rounded-2xl text-sm max-w-[75%] shadow-sm
                ${m.from === "user"
                                        ? "bg-yellow-400 text-black rounded-br-sm"
                                        : "bg-white/70 border border-white/40 text-gray-800 rounded-bl-sm"
                                    }`}
                            >
                                {m.text}

                                {m.time && (
                                    <div className="text-[10px] text-gray-400 mt-1">
                                        {m.time} ms
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {loading && (
                        <div className="flex">
                            <div className="px-4 py-3 rounded-2xl bg-white/70 border border-white/40 text-gray-500 text-sm animate-pulse">
                                Typing...
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* INPUT */}
                <div className="p-4 border-t border-white/40 flex gap-3">

                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 rounded-xl bg-white/70 border border-white/40 focus:ring-2 focus:ring-yellow-300 outline-none text-sm"
                    />

                    <button
                        onClick={sendMessage}
                        disabled={loading}
                        className="w-12 h-12 rounded-xl bg-yellow-400 hover:bg-yellow-500 flex items-center justify-center shadow-md transition"
                    >
                        <Send size={18} />
                    </button>

                </div>
            </div>
        </div>
    );
};

export default BotView;