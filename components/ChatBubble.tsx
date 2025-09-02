interface ChatBubbleProps {
  role: "user" | "assistant";
  text: string;
}

export default function ChatBubble({ role, text }: ChatBubbleProps) {
  return (
    <div
      className={`p-3 my-2 rounded-lg max-w-[80%] ${
        role === "user"
          ? "bg-blue-100 self-end ml-auto"
          : "bg-gray-100 self-start mr-auto"
      }`}
    >
      <strong>
        {role === "user" ? "🧑 Counsel:" : "⚖️ Assistant:"}
      </strong>
      <p className="whitespace-pre-wrap">{text}</p>
    </div>
  );
}
