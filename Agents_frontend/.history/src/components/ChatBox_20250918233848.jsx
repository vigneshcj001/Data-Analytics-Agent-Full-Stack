import { useState } from "react";
import axios from "axios";

function ChatBox({ fileName }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages([...messages, newMessage]);

    const formData = new FormData();
    formData.append("filename", fileName);
    formData.append("question", input);

    const res = await axios.post("http://localhost:8000/chat", formData);
    const botMessage = { sender: "bot", text: res.data.answer };

    setMessages((prev) => [...prev, botMessage]);
    setInput("");
  };

  return (
    <div>
      <div className="border p-3 h-64 overflow-y-auto mb-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.sender === "user" ? "text-blue-600" : "text-green-600"
            }
          >
            <b>{msg.sender}:</b> {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="border flex-1 p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
        />
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
