import React, { useState } from "react";
import "./chatGpt.css"; // Enable styling

function ChatGpt() {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hello! How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    // Replace with your actual Gemini API key
    const GEMINI_API_KEY = "AIzaSyA6vSx9FZIfDp-_GRJjzebR6tvC8scIInc";

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages((msgs) => [...msgs, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [{ text: input }]
                            }
                        ]
                    })
                }
            );
            const data = await response.json();
            const botReply =
                data.candidates?.[0]?.content?.parts?.[0]?.text ||
                "Sorry, I couldn't understand that.";

            setMessages((msgs) => [
                ...msgs,
                { sender: "bot", text: botReply }
            ]);
        } catch (error) {
            setMessages((msgs) => [
                ...msgs,
                { sender: "bot", text: "Error: Unable to get response.", error: error.message }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chatgpt-container">
            <div className="chatgpt-header">
                <h2>ChatGPT Assistant</h2>
            </div>
            <div className="chatgpt-messages">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`chatgpt-message ${msg.sender === "user" ? "user" : "bot"}`}
                    >
                        <span>{msg.text}</span>
                    </div>
                ))}
                {loading && (
                    <div className="chatgpt-message bot">
                        <span>Typing...</span>
                    </div>
                )}
            </div>
            <form className="chatgpt-input-area" onSubmit={handleSend}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    autoFocus
                    disabled={loading}
                />
                <button type="submit" disabled={loading || !input.trim()}>
                    <span role="img" aria-label="send">➤</span>
                </button>
            </form>
        </div>
    );
}

export default ChatGpt;