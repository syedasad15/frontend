"use client";

import { useState } from "react";
import ChatBubble from "../components/ChatBubble";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://judgegpt-ncai-222957019725.europe-west1.run.app/query",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: input }),
        }
      );
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.response },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ Error connecting to backend." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">⚖️ PakLaw Judicial Assistant</h1>

      <div className="w-full max-w-2xl bg-white shadow-md rounded-xl p-4 mb-20 overflow-y-auto h-[70vh] flex flex-col">
        {messages.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} text={msg.text} />
        ))}
        {loading && <p className="text-gray-500">Processing…</p>}
      </div>

      <div className="fixed bottom-0 w-full max-w-2xl flex items-center p-4 bg-white border-t shadow-md">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your judicial query…"
          className="flex-1 border rounded-lg p-2 mr-2"
          rows={2}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </main>
  );
}
