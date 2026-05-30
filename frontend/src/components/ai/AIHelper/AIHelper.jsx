import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bot, X, Send, Minimize2, Maximize2,
  Wrench, Sparkles, AlertCircle, ChevronRight,
  RotateCcw, Copy, Check, Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient, { API } from '../../../api/config';
import { useAuth } from '../../../context/AuthContext';
import { useCompany } from '../../../context/CompanyContext';
import './AIHelper.css';

// ── System prompt sent with every request ────────────────────────────────────
const SYSTEM_PROMPT = `You are an intelligent AI assistant integrated into Namastute POS — a SaaS business management platform.
Help users with: inventory management, POS sales, product management, purchase orders, stock adjustments, stock transfers, reports, settings configuration, and any feature questions.
Keep responses clear, concise, and actionable. For code or configuration, use code blocks. For steps, use numbered lists.`;

// ── Quick action prompts ──────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { icon: '🔧', label: 'Fix Error', prompt: 'I have an error in the system. Help me troubleshoot it: ' },
  { icon: '📖', label: 'Explain Feature', prompt: 'Please explain how this feature works in Namastute POS: ' },
  { icon: '✨', label: 'Improve Workflow', prompt: 'How can I improve my workflow for: ' },
  { icon: '💡', label: 'Best Practice', prompt: 'What are the best practices for: ' },
];

const STORAGE_KEY_PREFIX = 'nms_ai_chat_';
const MAX_CONTEXT_MSGS = 10; // last N non-system messages sent as context

function getStorageKey(email) {
  return `${STORAGE_KEY_PREFIX}${btoa(email || 'guest').replace(/=/g, '')}`;
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ── Single message bubble ─────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`ai-msg ai-msg--${msg.role}`}>
      {msg.role === 'assistant' && (
        <div className="ai-msg__avatar"><Bot size={13} /></div>
      )}
      <div className="ai-msg__bubble">
        <div className="ai-msg__content">{msg.content}</div>
        <div className="ai-msg__meta">
          <span className="ai-msg__time">{formatTime(msg.ts)}</span>
          {msg.role === 'assistant' && (
            <button className="ai-msg__copy" onClick={handleCopy} title="Copy response">
              {copied ? <Check size={10} /> : <Copy size={10} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Animated typing indicator ─────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="ai-msg ai-msg--assistant">
      <div className="ai-msg__avatar"><Bot size={13} /></div>
      <div className="ai-msg__bubble ai-msg__bubble--typing">
        <span /><span /><span />
      </div>
    </div>
  );
}

// ── Main AIHelper component ───────────────────────────────────────────────────
export default function AIHelper() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiConfig, setAiConfig] = useState(null);   // { hasKey, provider, model }
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Company info comes from the shared CompanyContext — updates in real-time
  const { companyInfo } = useCompany();

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const msgsRef = useRef([]);   // mirror of `messages` to avoid stale closure in sendMessage

  // ── Load chat history (per-user, localStorage) ────────────────────────────
  useEffect(() => {
    if (!user?.email) return;

    const key = getStorageKey(user.email);
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          msgsRef.current = parsed;
          return;
        }
      } catch { /* ignore */ }
    }

    // First time — show welcome
    const firstName = user?.name ? user.name.split(' ')[0] : 'there';
    const bizName = companyInfo.name || 'Namastute POS';
    const welcome = [{
      role: 'assistant',
      content: `👋 Hi ${firstName}! I'm your ${bizName} AI Helper.\n\nI can help you with inventory, sales, settings, product management, and more. Try the quick actions above, or just type your question!`,
      ts: Date.now(),
    }];
    setMessages(welcome);
    msgsRef.current = welcome;
  }, [user?.email]);

  // ── Persist chat on change ────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.email || messages.length === 0) return;
    msgsRef.current = messages;
    try {
      // Keep only the last 50 messages to avoid large localStorage entries
      const toSave = messages.slice(-50);
      localStorage.setItem(getStorageKey(user.email), JSON.stringify(toSave));
    } catch { /* quota exceeded — ignore */ }
  }, [messages, user?.email]);

  // ── Fetch AI config (has key? which provider/model?) ──────────────────────
  const fetchAiConfig = useCallback(async () => {
    if (!user) return;
    try {
      const res = await apiClient.get(`${API.AI}/settings`);
      setAiConfig(res.data);
    } catch {
      setAiConfig({ hasKey: false });
    }
  }, [user]);

  useEffect(() => { fetchAiConfig(); }, [fetchAiConfig]);

  // Re-check config whenever the panel opens (user might have just added a key)
  useEffect(() => {
    if (isOpen) fetchAiConfig();
  }, [isOpen]);

  // ── Auto-scroll to bottom ─────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  // ── Auto-resize textarea ──────────────────────────────────────────────────
  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = 'auto';
    inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 90) + 'px';
  }, [input]);

  // ── Focus input + clear badge when panel opens ────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 120);
      setUnreadCount(0);
    }
  }, [isOpen]);

  // ── Send a message ────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text || isLoading) return;

    // Append user message immediately
    const userMsg = { role: 'user', content: text, ts: Date.now() };
    const updatedMsgs = [...msgsRef.current, userMsg];
    setMessages(updatedMsgs);
    setInput('');
    setIsLoading(true);

    // Build context: system + last MAX_CONTEXT_MSGS messages
    const contextMsgs = updatedMsgs
      .filter(m => m.role !== 'system')
      .slice(-MAX_CONTEXT_MSGS)
      .map(m => ({ role: m.role, content: m.content }));

    const payload = {
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...contextMsgs,
      ],
    };

    try {
      const res = await apiClient.post(`${API.AI}/chat`, payload);
      const assistantMsg = { role: 'assistant', content: res.data.reply, ts: Date.now() };
      setMessages(prev => [...prev, assistantMsg]);
      if (!isOpen) setUnreadCount(prev => prev + 1);
    } catch (err) {
      const errText = err.response?.data?.error
        || 'Could not reach the AI. Check your API key in Settings → AI Settings.';
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `⚠️ ${errText}`, ts: Date.now() },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, isOpen]);

  // ── Keyboard submit ───────────────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Clear chat history ────────────────────────────────────────────────────
  const clearHistory = () => {
    if (!user?.email) return;
    localStorage.removeItem(getStorageKey(user.email));
    const reset = [{ role: 'assistant', content: 'Chat cleared. How can I help you?', ts: Date.now() }];
    setMessages(reset);
    msgsRef.current = reset;
  };

  // ── Quick action click ────────────────────────────────────────────────────
  const handleQuickAction = (action) => {
    setInput(action.prompt);
    setShowQuickActions(false);
    setTimeout(() => {
      inputRef.current?.focus();
      // Move cursor to end
      const len = action.prompt.length;
      inputRef.current?.setSelectionRange(len, len);
    }, 60);
  };

  // ── Go to settings ────────────────────────────────────────────────────────
  const goToSettings = () => {
    setIsOpen(false);
    navigate('/settings/ai_helper');
  };

  if (!user) return null;

  const canChat = aiConfig?.hasKey === true;
  const configReady = aiConfig !== null;

  return (
    <>
      {/* ──────────────────────────────────────────────────────────────────
          Floating Action Button
      ────────────────────────────────────────────────────────────────── */}
      <button
        className={`ai-fab ${isOpen ? 'ai-fab--open' : ''}`}
        onClick={() => setIsOpen(v => !v)}
        title={isOpen ? 'Close AI Helper' : 'Open AI Helper'}
        aria-label={isOpen ? 'Close AI Helper' : 'Open AI Helper'}
      >
        {isOpen ? <X size={20} /> : <Bot size={20} />}
        {!isOpen && unreadCount > 0 && (
          <span className="ai-fab__badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
        {!isOpen && <span className="ai-fab__pulse" />}
      </button>

      {/* ──────────────────────────────────────────────────────────────────
          Chat Panel
      ────────────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div className={`ai-panel ${isMaximized ? 'ai-panel--max' : ''}`}>

          {/* Header */}
          <div className="ai-panel__header">
            <div className="ai-panel__header-left">
              <div className="ai-panel__bot-icon">
                {companyInfo.logo
                  ? <img src={companyInfo.logo} alt={companyInfo.name || 'Company'} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} />
                  : <Bot size={15} />}
              </div>
              <div>
                <div className="ai-panel__title">{companyInfo.name || 'AI Helper'}</div>
                <div className="ai-panel__subtitle">
                  {configReady ? (
                    <>
                      <span className={`ai-panel__status-dot ${canChat ? '' : 'ai-panel__status-dot--off'}`} />
                      {canChat
                        ? `${aiConfig.provider?.toUpperCase() || 'AI'} · ${aiConfig.model || 'default'}`
                        : 'Setup required'}
                    </>
                  ) : (
                    'Loading…'
                  )}
                </div>
              </div>
            </div>
            <div className="ai-panel__header-actions">
              <button onClick={goToSettings} title="AI Settings" className="ai-panel__action-btn">
                <Settings size={13} />
              </button>
              <button onClick={clearHistory} title="Clear chat" className="ai-panel__action-btn">
                <RotateCcw size={13} />
              </button>
              <button
                onClick={() => setIsMaximized(v => !v)}
                title={isMaximized ? 'Restore' : 'Expand'}
                className="ai-panel__action-btn"
              >
                {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="ai-panel__action-btn ai-panel__action-btn--close"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* No API key banner */}
          {configReady && !canChat && (
            <div className="ai-panel__key-banner">
              <AlertCircle size={13} />
              <span>No API key configured. </span>
              <button
                onClick={goToSettings}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  color: '#f97316', fontWeight: 600, fontSize: '12px',
                  display: 'inline-flex', alignItems: 'center', gap: '2px'
                }}
              >
                Add in Settings <ChevronRight size={10} />
              </button>
            </div>
          )}

          {/* Quick actions bar */}
          <div className="ai-panel__quick-bar">
            <button
              className={`ai-panel__fix-btn ${showQuickActions ? 'active' : ''}`}
              onClick={() => setShowQuickActions(v => !v)}
            >
              <Wrench size={11} />
              Fix &amp; Actions
            </button>
            <button
              className="ai-panel__fix-btn"
              onClick={() => {
                setShowQuickActions(false);
                sendMessage('What can you help me with in Namastute POS?');
              }}
              disabled={!canChat || isLoading}
            >
              <Sparkles size={11} />
              Capabilities
            </button>
          </div>

          {/* Quick actions dropdown */}
          {showQuickActions && (
            <div className="ai-panel__quick-actions">
              {QUICK_ACTIONS.map((action, i) => (
                <button
                  key={i}
                  className="ai-panel__quick-item"
                  onClick={() => handleQuickAction(action)}
                  disabled={!canChat}
                >
                  <span style={{ fontSize: '15px', lineHeight: 1 }}>{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Messages */}
          <div className="ai-panel__messages">
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="ai-panel__input-area">
            <textarea
              ref={inputRef}
              className="ai-panel__input"
              placeholder={
                !canChat
                  ? 'Setup API Key in Settings to chat...'
                  : isLoading
                    ? 'AI is typing...'
                    : 'Ask AI Helper...'
              }
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isLoading || !canChat}
            />
            <button
              className={`ai-panel__send-btn ${(!input.trim() || isLoading || !canChat) ? 'disabled' : ''}`}
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading || !canChat}
              title="Send (Enter)"
            >
              <Send size={15} />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
