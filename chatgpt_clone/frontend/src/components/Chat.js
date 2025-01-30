import React, { useState, useEffect } from "react";
import { sendMessageToGemini, getChatHistory } from "../api";
import "./styles.css";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    getChatHistory().then(setMessages);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = await sendMessageToGemini(input);
    setMessages([...messages, newMessage]);
    setInput("");
  };

  return (
    <div className="chat-container">
      <h2>Chat with Gemini</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <p><strong>You:</strong> {msg.user_message}</p>
            <p><strong>Gemini:</strong> {msg.gemini_response}</p>
          </div>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>送信</button>
    </div>
  );
}

export default Chat;
