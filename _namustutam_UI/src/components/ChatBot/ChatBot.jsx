import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { useLandingPage } from '../../context/LandingPageContext';
import defaultSystemContext from '../../assets/namustutam-context.txt?raw';
import './ChatBot.css';

const ChatBot = () => {
    const { landingData } = useLandingPage();
    const chatbotConfig = landingData?.chatbot || {};

    const isVisible = (landingData?.sectionVisibility?.chatbot !== false) && (chatbotConfig.enabled !== false);

    const botName = chatbotConfig.botName || 'Namustutam AI';
    const botSubtitle = chatbotConfig.botSubtitle || 'Online & ready to help';
    const welcomeText = chatbotConfig.welcomeMessage || "Hello! 👋 I'm your Namustutam AI assistant. How can I help you today?";
    const quickPrompts = chatbotConfig.quickPrompts || [
        'What services do you offer?',
        'Tell me about SaaS POS',
        'How much does a custom web app cost?',
        'How do I hire or contact you?'
    ];

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: welcomeText, sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Sync welcome message if modified dynamically in Admin Panel
    useEffect(() => {
        setMessages(prev => {
            if (prev.length === 1 && prev[0].id === 1) {
                return [{ id: 1, text: welcomeText, sender: 'bot' }];
            }
            return prev;
        });
    }, [welcomeText]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    if (!isVisible) {
        return null;
    }

    const sendMessageText = async (textToSend) => {
        if (!textToSend.trim() || isLoading) return;

        const userMessage = { id: Date.now(), text: textToSend, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const provider = chatbotConfig.provider || 'groq';
        let model = chatbotConfig.model || (provider === 'gemini' ? 'gemini-1.5-flash' : 'openai/gpt-oss-120b');
        if (model === 'llama-3.1-8b-instant') {
            model = 'openai/gpt-oss-120b';
        }
        const apiKey = (chatbotConfig.apiKey || '').trim();
        const systemPrompt = chatbotConfig.systemPrompt || defaultSystemContext;

        // Build messages list for conversation
        const conversationMessages = [
            ...messages.filter(msg => !msg.isError).map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            })),
            { role: 'user', content: textToSend }
        ];

        try {
            let botReplyText = '';
            let backendSuccess = false;

            // 1. Try server-side proxy endpoint first (handles CORS, protects key in production)
            try {
                const res = await axios.post('/api/landing-page/chat', {
                    messages: conversationMessages,
                    provider,
                    model,
                    apiKey,
                    systemPrompt
                }, { timeout: 35000 });

                if (res.data && res.data.reply) {
                    botReplyText = res.data.reply;
                    backendSuccess = true;
                }
            } catch (backendErr) {
                console.warn('Backend chat proxy:', backendErr.response?.data?.error || backendErr.message);
                if (backendErr.response?.status === 400 && !apiKey) {
                    setMessages(prev => [...prev, {
                        id: Date.now(),
                        text: "⚠️ No AI API key configured yet. The administrator can add their free Groq or Gemini API key in Admin Studio → AI Chatbot.",
                        sender: 'bot',
                        isError: true
                    }]);
                    setIsLoading(false);
                    return;
                }
            }

            // 2. Direct client fallback if backend was unreachable and API key is present
            if (!backendSuccess) {
                if (!apiKey) {
                    setMessages(prev => [...prev, {
                        id: Date.now(),
                        text: "⚠️ AI API Key is not configured. Please add an API key in the Admin Panel (Admin Studio → AI Chatbot).",
                        sender: 'bot',
                        isError: true
                    }]);
                    setIsLoading(false);
                    return;
                }

                if (provider === 'gemini' || apiKey.startsWith('AIzaSy')) {
                    // Direct Gemini call
                    const geminiContents = [
                        {
                            role: 'user',
                            parts: [{ text: `SYSTEM INSTRUCTIONS: ${systemPrompt}` }]
                        },
                        {
                            role: 'model',
                            parts: [{ text: 'Understood. I will act as the Namustutam AI assistant.' }]
                        },
                        ...conversationMessages.map(m => ({
                            role: m.role === 'assistant' ? 'model' : 'user',
                            parts: [{ text: m.content }]
                        }))
                    ];

                    const geminiRes = await axios.post(
                        `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-1.5-flash'}:generateContent?key=${apiKey}`,
                        { contents: geminiContents },
                        { headers: { 'Content-Type': 'application/json' }, timeout: 25000 }
                    );
                    botReplyText = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
                } else {
                    // Groq / OpenAI compatible call
                    const groqMessages = [
                        { role: 'system', content: systemPrompt },
                        ...conversationMessages
                    ];

                    let groqModelToUse = model || 'openai/gpt-oss-120b';
                    if (groqModelToUse === 'llama-3.1-8b-instant') {
                        groqModelToUse = 'openai/gpt-oss-120b';
                    }

                    try {
                        const groqRes = await axios.post(
                            '/api/groq/openai/v1/chat/completions',
                            {
                                model: groqModelToUse,
                                messages: groqMessages
                            },
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${apiKey}`
                                },
                                timeout: 25000
                            }
                        );
                        botReplyText = groqRes.data?.choices?.[0]?.message?.content || '';
                    } catch (groqErr) {
                        const errText = groqErr.response?.data?.error?.message || groqErr.message || '';
                        if (errText.includes('does not exist') || errText.includes('model_not_found') || groqErr.response?.status === 404) {
                            console.warn('Groq model failed, retrying with openai/gpt-oss-120b fallback:', errText);
                            const fallbackRes = await axios.post(
                                '/api/groq/openai/v1/chat/completions',
                                {
                                    model: 'openai/gpt-oss-120b',
                                    messages: groqMessages
                                },
                                {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${apiKey}`
                                    },
                                    timeout: 25000
                                }
                            );
                            botReplyText = fallbackRes.data?.choices?.[0]?.message?.content || '';
                        } else {
                            throw groqErr;
                        }
                    }
                }
            }

            if (!botReplyText) {
                throw new Error('Empty response received from AI engine.');
            }

            setMessages(prev => [...prev, {
                id: Date.now(),
                text: botReplyText,
                sender: 'bot'
            }]);

        } catch (error) {
            console.error('Error communicating with AI API:', error);
            let errMsg = error.message || 'Unknown network error';
            if (error.response?.data?.error?.message) {
                errMsg = error.response.data.error.message;
            } else if (error.response?.data?.error) {
                errMsg = error.response.data.error;
            }

            setMessages(prev => [...prev, {
                id: Date.now(),
                text: `⚠️ Error connecting to AI: ${errMsg}. Please verify your API key in Admin Studio → AI Chatbot.`,
                sender: 'bot',
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = (e) => {
        e.preventDefault();
        sendMessageText(input);
    };

    const handleQuickPromptClick = (prompt) => {
        sendMessageText(prompt);
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
        <div className="chatbot-wrapper hide-on-mobile">
            {/* Chatbot Floating Trigger Button */}
            <button
                className={`chatbot-toggle ${isOpen ? 'active' : ''} hide-on-mobile`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle AI Chatbot"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            {/* Chatbot Main Window */}
            <div className={`chatbot-window ${isOpen ? 'open' : ''} hide-on-mobile`}>
                <div className="chatbot-header">
                    <div className="chatbot-header-info">
                        <div className="chatbot-avatar">
                            <Bot size={20} />
                        </div>
                        <div>
                            <h3>{botName}</h3>
                            <p>{botSubtitle}</p>
                        </div>
                    </div>
                    <button className="close-btn" onClick={() => setIsOpen(false)} aria-label="Close Chat">
                        <X size={20} />
                    </button>
                </div>

                <div className="chatbot-messages">
                    {messages.map((msg) => {
                        let thinkingText = null;
                        let mainText = msg.text;

                        if (msg.sender === 'bot') {
                            const thinkMatch = mainText.match(/<think>([\s\S]*?)<\/think>/i);
                            if (thinkMatch) {
                                thinkingText = thinkMatch[1].trim();
                                mainText = mainText.replace(/<think>([\s\S]*?)<\/think>/i, '').trim();
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

                    {/* Quick Starter Question Chips (visible on initial greeting) */}
                    {messages.length === 1 && quickPrompts.length > 0 && !isLoading && (
                        <div className="chatbot-quick-prompts">
                            {quickPrompts.map((qp, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className="quick-prompt-chip"
                                    onClick={() => handleQuickPromptClick(qp)}
                                >
                                    <Sparkles size={12} />
                                    <span>{qp}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {isLoading && (
                        <div className="chat-message bot">
                            <div className="message-icon">
                                <Bot size={16} />
                            </div>
                            <div className="message-content typing">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chatbot-input-area" onSubmit={handleSend}>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            disabled={isLoading}
                        />
                    </div>
                    <button type="submit" disabled={!input.trim() || isLoading} className="send-btn" aria-label="Send Message">
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatBot;
