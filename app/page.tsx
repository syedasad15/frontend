"use client";

import { useState, useEffect } from "react";
import ChatBubble from "../components/ChatBubble";

interface Message {
  role: "user" | "assistant";
  message: string;
}

export default function Home() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Start a new session on first load
  useEffect(() => {
    const createSession = async () => {
      const res = await fetch(
        "https://judgegpt-ncai-222957019725.europe-west1.run.app/new_session",
        { method: "POST" }
      );
      const data = await res.json();
      setSessionId(data.session_id);
    };
    createSession();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("user_input", input);

    const res = await fetch(
      "https://judgegpt-ncai-222957019725.europe-west1.run.app/chat",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    setMessages(data.chats);
    setInput("");
    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">⚖️ PakLaw Judicial Assistant</h1>

      <div className="w-full max-w-2xl bg-white shadow-md rounded-xl p-4 mb-20 overflow-y-auto h-[70vh] flex flex-col">
        {messages.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} text={msg.message} />
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
