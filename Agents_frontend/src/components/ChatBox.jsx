import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function ChatBox({ fileName, apiKey }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    setSending(true);

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    const formData = new FormData();
    formData.append("filename", fileName);
    formData.append("question", newMessage.text);
    formData.append("api_key", apiKey);

    try {
      const res = await axios.post("http://localhost:8000/chat", formData);
      if (res.data.error) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: res.data.error },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: res.data.answer },
        ]);
        if (res.data.chart_base64) {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", chart: res.data.chart_base64 },
          ]);
        }
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Error occurred" },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-4 border rounded-xl p-4 bg-white shadow-inner">
      <div className="h-72 overflow-y-auto space-y-3 pr-2">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-3 rounded-xl max-w-[80%] ${
              msg.sender === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {msg.text}
            {msg.chart && (
              <img
                src={`data:image/png;base64,${msg.chart}`}
                alt="chart"
                className="mt-2 rounded-lg shadow-md"
              />
            )}
          </motion.div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="💬 Ask about your data..."
          className="flex-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? "Sending..." : "Send ➤"}
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
