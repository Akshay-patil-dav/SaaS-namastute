import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import systemContext from '../../assets/namustutam-context.txt?raw';
import './ChatBot.css';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your Namustutam AI assistant. How can I help you today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Fallback to hardcoded key for deployment if env var is missing
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim() || "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";
            
            if (!apiKey || apiKey === 'YOUR_FREE_GEMINI_API_KEY_HERE') {
                setMessages(prev => [...prev, { 
                    id: Date.now(), 
                    text: "API Key is missing! Please add your free Gemini or Groq API key in the .env file.", 
                    sender: 'bot',
                    isError: true
                }]);
                setIsLoading(false);
                return;
            }

            const isGroq = apiKey.startsWith('gsk_');
            let botReplyText = "";

            if (isGroq) {
                // Map previous messages to Groq's format
                const groqMessages = [
                    { role: "system", content: systemContext },
                    ...messages.filter(msg => !msg.isError).map(msg => ({
                        role: msg.sender === 'user' ? "user" : "assistant",
                        content: msg.text
                    })),
                    { role: "user", content: input }
                ];

                // Use local proxy to bypass CORS
                const response = await axios.post(
                    '/api/groq/openai/v1/chat/completions',
                    {
                        model: "llama-3.1-8b-instant",
                        messages: groqMessages
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        }
                    }
                );
                botReplyText = response.data.choices[0].message.content;
            } else {
                // Map previous messages to Gemini's format
                const geminiContents = [
                    {
                        role: "user",
                        parts: [{ text: `SYSTEM INSTRUCTIONS: ${systemContext}` }]
                    },
                    {
                        role: "model",
                        parts: [{ text: "Understood. I am the Namustutam AI." }]
                    },
                    ...messages.filter(msg => !msg.isError).map(msg => ({
                        role: msg.sender === 'user' ? "user" : "model",
                        parts: [{ text: msg.text }]
                    })),
                    {
                        role: "user",
                        parts: [{ text: input }]
                    }
                ];

                // Use local proxy for Gemini
                const response = await axios.post(
                    `/api/gemini/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                    {
                        contents: geminiContents
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                botReplyText = response.data.candidates[0].content.parts[0].text;
            }
            
            setMessages(prev => [...prev, { 
                id: Date.now(), 
                text: botReplyText, 
                sender: 'bot' 
            }]);

        } catch (error) {
            console.error("Error communicating with AI API:", error);
            
            // Extract meaningful error message
            let errMsg = error.message || "Unknown network error";
            if (error.response) {
                errMsg = error.response.data?.error?.message || `HTTP ${error.response.status}: ${error.response.statusText}`;
            }

            setMessages(prev => [...prev, { 
                id: Date.now(), 
                text: `Error connecting to AI: ${errMsg}. Please check your API key or network.`, 
                sender: 'bot',
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderTextWithLinks = (text) => {
        if (!text) return null;
        
        // 1. Split by ### Headers
        const headerRegex = /(###\s+[^\n]+)/g;
        const headerParts = text.split(headerRegex);

        return headerParts.map((headerPart, h) => {
            if (headerPart.match(headerRegex)) {
                return (
                    <div key={`h-${h}`} className="chat-md-header">
                        {headerPart.replace(/^###\s+/, '')}
                    </div>
                );
            }

            // 2. Split by URL
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const urlParts = headerPart.split(urlRegex);
            
            return urlParts.map((part, i) => {
                if (part.match(urlRegex)) {
                    return (
                        <a 
                            key={`u-${h}-${i}`} 
                            href={part} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="chat-link"
                        >
                            {part}
                        </a>
                    );
                }
                
                // 3. Parse **bold** text
                const boldRegex = /\*\*(.*?)\*\*/g;
                const boldParts = part.split(boldRegex);
                
                return boldParts.map((subPart, j) => {
                    if (j % 2 === 1) {
                        return <strong key={`b-${h}-${i}-${j}`} className="chat-bold">{subPart}</strong>;
                    }
                    return subPart; 
                });
            });
        });
    };

    return (
        <div className="chatbot-wrapper">
            {/* Chatbot Toggle Button */}
            <button 
                className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Chatbot"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            {/* Chatbot Window */}
            <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
                <div className="chatbot-header">
                    <div className="chatbot-header-info">
                        <div className="chatbot-avatar">
                            <Bot size={20} />
                        </div>
                        <div>
                            <h3>Namustutam AI</h3>
                            <p>Online & ready to help</p>
                        </div>
                    </div>
                    <button className="close-btn" onClick={() => setIsOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <div className="chatbot-messages">
                    {messages.map((msg) => {
                        let thinkingText = null;
                        let mainText = msg.text;
                        
                        if (msg.sender === 'bot') {
                            const thinkMatch = mainText.match(/<think>([\s\S]*?)<\/think>/);
                            if (thinkMatch) {
                                thinkingText = thinkMatch[1].trim();
                                mainText = mainText.replace(/<think>([\s\S]*?)<\/think>/, '').trim();
                            }
                        }

                        return (
                            <div key={msg.id} className={`chat-message ${msg.sender} ${msg.isError ? 'error' : ''}`}>
                                <div className="message-icon">
                                    {msg.sender === 'bot' ? <Bot size={16} /> : <User size={16} />}
                                </div>
                                <div className="message-content">
                                    {thinkingText && (
                                        <details className="chat-thinking-block">
                                            <summary>🧠 Thought Process</summary>
                                            <div className="chat-thinking-content">
                                                {thinkingText}
                                            </div>
                                        </details>
                                    )}
                                    {renderTextWithLinks(mainText)}
                                </div>
                            </div>
                        );
                    })}
                    {isLoading && (
                        <div className="chat-message bot">
                            <div className="message-icon">
                                <Bot size={16} />
                            </div>
                            <div className="message-content typing">
                                <Loader2 size={16} className="spin-anim" />
                                <span>AI is thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chatbot-input-area" onSubmit={handleSend}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={!input.trim() || isLoading} className="send-btn">
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatBot;
