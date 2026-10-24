import React, { useState } from 'react';
import { 
    Bot, Key, Eye, EyeOff, Save, Trash2, CheckCircle2, 
    AlertCircle, ExternalLink, Cpu, ClipboardPaste, Sparkles, 
    RotateCcw, MessageSquare, Send, Check, ShieldCheck, Zap,
    HelpCircle, Settings, ChevronRight
} from 'lucide-react';
import { useLandingPage } from '../../../../context/LandingPageContext';
import SectionVisibilityBanner from '../components/SectionVisibilityBanner';
import apiClient from '../../../../api/config';
import defaultSystemContext from '../../../../assets/namustutam-context.txt?raw';

const PROVIDERS = [
    {
        id: 'groq',
        name: 'Groq Cloud',
        badge: '100% FREE • FASTEST',
        badgeColor: '#10b981',
        color: '#f59e0b',
        icon: Zap,
        keyPrefix: 'gsk_',
        keyPlaceholder: 'gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        docsUrl: 'https://console.groq.com/keys',
        description: 'Ultra high-speed open-source models on Groq LPUs. Completely free without credit card.',
        defaultModel: 'openai/gpt-oss-120b',
        models: [
            'openai/gpt-oss-120b',
            'openai/gpt-oss-20b',
            'qwen/qwen3.8-27b',
            'llama-3.3-70b-versatile',
            'allam-2-7b'
        ]
    },
    {
        id: 'gemini',
        name: 'Google AI Studio',
        badge: 'FREE TIER (1,500/DAY)',
        badgeColor: '#3b82f6',
        color: '#4285f4',
        icon: Sparkles,
        keyPrefix: 'AIzaSy',
        keyPlaceholder: 'AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        docsUrl: 'https://aistudio.google.com/app/apikey',
        description: 'Official Google Gemini models. 1,500 free requests per day with high precision.',
        defaultModel: 'gemini-1.5-flash',
        models: [
            'gemini-1.5-flash',
            'gemini-2.0-flash',
            'gemini-1.5-pro'
        ]
    },
    {
        id: 'openai',
        name: 'OpenAI',
        badge: 'STANDARD',
        badgeColor: '#10b981',
        color: '#10a37f',
        icon: Bot,
        keyPrefix: 'sk-',
        keyPlaceholder: 'sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxx',
        docsUrl: 'https://platform.openai.com/api-keys',
        description: 'Industry-standard GPT-4o-mini & GPT-4o conversational models.',
        defaultModel: 'gpt-4o-mini',
        models: [
            'gpt-4o-mini',
            'gpt-4o',
            'gpt-3.5-turbo'
        ]
    },
    {
        id: 'openrouter',
        name: 'OpenRouter',
        badge: 'FREE MODELS',
        badgeColor: '#06b6d4',
        color: '#0ea5e9',
        icon: Sparkles,
        keyPrefix: 'sk-or-',
        keyPlaceholder: 'sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxx',
        docsUrl: 'https://openrouter.ai/keys',
        description: 'Unified gateway supporting Llama, Gemma, DeepSeek, and dozens of free models.',
        defaultModel: 'meta-llama/llama-3.3-70b-instruct:free',
        models: [
            'meta-llama/llama-3.3-70b-instruct:free',
            'google/gemma-3-27b-it:free',
            'deepseek/deepseek-r1:free'
        ]
    },
    {
        id: 'mistral',
        name: 'Mistral AI',
        badge: 'FREE TRIAL',
        badgeColor: '#8b5cf6',
        color: '#7c3aed',
        icon: Sparkles,
        keyPrefix: 'sk-',
        keyPlaceholder: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        docsUrl: 'https://console.mistral.ai/api-keys',
        description: 'French frontier AI with Mistral Small and Mixtral models.',
        defaultModel: 'mistral-small-latest',
        models: [
            'mistral-small-latest',
            'open-mistral-7b'
        ]
    },
    {
        id: 'claude',
        name: 'Anthropic Claude',
        badge: 'PREMIUM',
        badgeColor: '#f97316',
        color: '#d97706',
        icon: Cpu,
        keyPrefix: 'sk-ant-',
        keyPlaceholder: 'sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxx',
        docsUrl: 'https://console.anthropic.com/settings/keys',
        description: 'State of the art reasoning with Claude 3.5 Sonnet and Haiku.',
        defaultModel: 'claude-3-5-sonnet-20241022',
        models: [
            'claude-3-5-sonnet-20241022',
            'claude-3-haiku-20240307'
        ]
    }
];

export default function ChatbotTab() {
    const { landingData, updateSection, saveAndPublish, isSaving } = useLandingPage();
    const chatbot = landingData.chatbot || {};

    const [showKey, setShowKey] = useState(false);
    const [testState, setTestState] = useState({ testing: false, result: null });
    const [newPromptText, setNewPromptText] = useState('');
    const [customModelMode, setCustomModelMode] = useState(false);
    const [sandboxInput, setSandboxInput] = useState('');
    const [sandboxMessages, setSandboxMessages] = useState([
        { role: 'bot', text: chatbot.welcomeMessage || "Hello! 👋 I'm your Namustutam AI Assistant. How can I help you today?" }
    ]);
    const [sandboxLoading, setSandboxLoading] = useState(false);

    const currentProvider = PROVIDERS.find(p => p.id === (chatbot.provider || 'groq')) || PROVIDERS[0];
    const hasKey = Boolean(chatbot.apiKey && chatbot.apiKey.trim().length > 4);

    const handleFieldChange = (field, value) => {
        updateSection('chatbot', { [field]: value });
        setTestState({ testing: false, result: null });
    };

    const handleProviderSelect = (providerId) => {
        const prov = PROVIDERS.find(p => p.id === providerId) || PROVIDERS[0];
        updateSection('chatbot', {
            provider: providerId,
            model: prov.defaultModel
        });
        setCustomModelMode(false);
        setTestState({ testing: false, result: null });
    };

    const handlePasteKey = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                handleFieldChange('apiKey', text.trim());
            }
        } catch {
            alert('Clipboard permission denied. Please paste manually into the input box.');
        }
    };

    const handleTestConnection = async () => {
        setTestState({ testing: true, result: null });
        try {
            const payload = {
                provider: chatbot.provider || 'groq',
                model: chatbot.model || currentProvider.defaultModel,
                apiKey: chatbot.apiKey || ''
            };

            const res = await apiClient.post('/landing-page/test-ai', payload, { timeout: 25000 });
            setTestState({ testing: false, result: res.data });
        } catch (err) {
            let msg = err.message || 'Connection test failed';
            if (err.response?.data?.message) {
                msg = err.response.data.message;
            } else if (err.response?.data?.error) {
                msg = err.response.data.error;
            }
            setTestState({
                testing: false,
                result: {
                    ok: false,
                    provider: chatbot.provider,
                    message: msg
                }
            });
        }
    };

    const handleAddQuickPrompt = (e) => {
        e.preventDefault();
        const trimmed = newPromptText.trim();
        if (!trimmed) return;
        const currentPrompts = chatbot.quickPrompts || [];
        if (!currentPrompts.includes(trimmed)) {
            updateSection('chatbot', { quickPrompts: [...currentPrompts, trimmed] });
        }
        setNewPromptText('');
    };

    const handleRemoveQuickPrompt = (indexToRemove) => {
        const currentPrompts = chatbot.quickPrompts || [];
        updateSection('chatbot', {
            quickPrompts: currentPrompts.filter((_, i) => i !== indexToRemove)
        });
    };

    const handleLoadDefaultContext = () => {
        if (window.confirm('Reset the AI System Instructions back to the official Namustutam context knowledge base?')) {
            handleFieldChange('systemPrompt', defaultSystemContext);
        }
    };

    const handleSandboxSend = async (e) => {
        e?.preventDefault();
        if (!sandboxInput.trim() || sandboxLoading) return;

        const userMsg = { role: 'user', text: sandboxInput };
        setSandboxMessages(prev => [...prev, userMsg]);
        const q = sandboxInput;
        setSandboxInput('');
        setSandboxLoading(true);

        try {
            const payload = {
                messages: [
                    ...sandboxMessages.map(m => ({
                        role: m.role === 'bot' ? 'assistant' : 'user',
                        content: m.text
                    })),
                    { role: 'user', content: q }
                ],
                provider: chatbot.provider || 'groq',
                model: chatbot.model || currentProvider.defaultModel,
                apiKey: chatbot.apiKey || '',
                systemPrompt: chatbot.systemPrompt || defaultSystemContext
            };

            const res = await apiClient.post('/landing-page/chat', payload, { timeout: 35000 });
            setSandboxMessages(prev => [...prev, { role: 'bot', text: res.data.reply }]);
        } catch (err) {
            let errText = err.response?.data?.error || err.message || 'Error communicating with AI';
            setSandboxMessages(prev => [...prev, { role: 'bot', text: `⚠️ ${errText}`, isError: true }]);
        } finally {
            setSandboxLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Top Visibility Banner */}
            <SectionVisibilityBanner 
                sectionKey="chatbot" 
                sectionName="AI Chatbot Assistant" 
                description="Controls the floating AI assistant on the bottom-right of your public website. When enabled, visitors can interactively chat with your customized bot."
            />

            {/* Quick KPI Overview Card */}
            <div className="admin-card" style={{
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.12) 0%, rgba(245, 158, 11, 0.08) 100%)',
                borderColor: 'rgba(124, 58, 237, 0.3)',
                padding: '24px 28px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #7c3aed 0%, #f59e0b 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            boxShadow: '0 8px 24px rgba(124, 58, 237, 0.35)',
                            flexShrink: 0
                        }}>
                            <Bot size={28} />
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                                    {chatbot.botName || 'Namustutam AI'} Assistant
                                </h2>
                                <span style={{
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    padding: '3px 9px',
                                    borderRadius: '9999px',
                                    background: hasKey ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                    color: hasKey ? '#34d399' : '#fbbf24',
                                    border: `1px solid ${hasKey ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: hasKey ? '#34d399' : '#fbbf24' }} />
                                    {hasKey ? 'API KEY CONFIGURED' : 'API KEY REQUIRED'}
                                </span>
                            </div>
                            <p style={{ margin: 0, fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.5, maxWidth: '650px' }}>
                                Connect your own free API key from <strong>Groq</strong>, <strong>Google Gemini</strong>, or <strong>OpenAI</strong>.
                                Changes apply dynamically to the live floating chat widget across the website.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                            type="button"
                            className="admin-btn admin-btn-orange"
                            onClick={saveAndPublish}
                            disabled={isSaving}
                            style={{ minWidth: '160px' }}
                        >
                            {isSaving ? (
                                <>
                                    <span className="admin-spinner" style={{ width: '14px', height: '14px' }} />
                                    <span>Saving Changes...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={15} />
                                    <span>Save & Publish</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── STEP 1: Select AI Provider ── */}
            <div className="admin-card">
                <div className="admin-card-header" style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            background: 'rgba(99, 102, 241, 0.15)',
                            color: '#818cf8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '13px'
                        }}>1</div>
                        <h3 className="admin-card-title" style={{ margin: 0 }}>
                            Select AI Engine / Provider
                        </h3>
                    </div>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                        Active: <strong style={{ color: '#ffffff' }}>{currentProvider.name}</strong>
                    </span>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '16px'
                }}>
                    {PROVIDERS.map(p => {
                        const isSelected = (chatbot.provider || 'groq') === p.id;
                        const PIcon = p.icon;
                        return (
                            <div
                                key={p.id}
                                onClick={() => handleProviderSelect(p.id)}
                                style={{
                                    padding: '18px',
                                    borderRadius: '14px',
                                    background: isSelected 
                                        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)' 
                                        : 'rgba(15, 23, 42, 0.45)',
                                    border: `1.5px solid ${isSelected ? p.color : 'rgba(255, 255, 255, 0.08)'}`,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: isSelected ? `0 6px 20px ${p.color}25` : 'none',
                                    position: 'relative'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '10px',
                                            background: `${p.color}20`,
                                            color: p.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <PIcon size={20} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff' }}>
                                                {p.name}
                                            </div>
                                            <span style={{
                                                fontSize: '10px',
                                                fontWeight: '700',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                background: `${p.badgeColor}22`,
                                                color: p.badgeColor
                                            }}>
                                                {p.badge}
                                            </span>
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <div style={{
                                            width: '22px',
                                            height: '22px',
                                            borderRadius: '50%',
                                            background: p.color,
                                            color: '#000000',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: `0 0 10px ${p.color}`
                                        }}>
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                    )}
                                </div>

                                <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#94a3b8', lineHeight: 1.45 }}>
                                    {p.description}
                                </p>

                                <div style={{
                                    fontSize: '11px',
                                    color: '#64748b',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingTop: '8px',
                                    borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                                }}>
                                    <span>Key format: <code>{p.keyPrefix}</code></span>
                                    <a
                                        href={p.docsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ color: '#818cf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}
                                    >
                                        <span>Get Key</span>
                                        <ExternalLink size={11} />
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── STEP 2: Configure API Key & Model ── */}
            <div className="admin-card">
                <div className="admin-card-header" style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            background: 'rgba(245, 158, 11, 0.15)',
                            color: '#fbbf24',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '13px'
                        }}>2</div>
                        <h3 className="admin-card-title" style={{ margin: 0 }}>
                            {currentProvider.name} API Key & Model Configuration
                        </h3>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* API Key Input */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label className="admin-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Key size={15} style={{ color: '#f59e0b' }} />
                                <span>{currentProvider.name} API Key</span>
                            </label>

                            <a
                                href={currentProvider.docsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    fontSize: '12px',
                                    color: '#818cf8',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontWeight: '500'
                                }}
                            >
                                <span>Get free {currentProvider.name} key</span>
                                <ExternalLink size={12} />
                            </a>
                        </div>

                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input
                                type={showKey ? 'text' : 'password'}
                                className="admin-input"
                                value={chatbot.apiKey || ''}
                                onChange={(e) => handleFieldChange('apiKey', e.target.value)}
                                placeholder={currentProvider.keyPlaceholder}
                                style={{
                                    paddingRight: '120px',
                                    fontFamily: showKey ? 'monospace' : 'inherit',
                                    letterSpacing: showKey ? '0.04em' : 'normal',
                                    borderColor: (chatbot.apiKey && !chatbot.apiKey.startsWith(currentProvider.keyPrefix))
                                        ? 'rgba(245, 158, 11, 0.5)'
                                        : undefined
                                }}
                            />

                            <div style={{
                                position: 'absolute',
                                right: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <button
                                    type="button"
                                    onClick={handlePasteKey}
                                    className="admin-btn admin-btn-secondary"
                                    style={{ padding: '6px 10px', fontSize: '11px', height: '30px' }}
                                    title="Paste key from clipboard"
                                >
                                    <ClipboardPaste size={13} />
                                    <span>Paste</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowKey(!showKey)}
                                    className="admin-btn admin-btn-secondary"
                                    style={{ padding: '6px 8px', fontSize: '11px', height: '30px' }}
                                    title={showKey ? 'Hide key' : 'Show key'}
                                >
                                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>

                                {chatbot.apiKey && (
                                    <button
                                        type="button"
                                        onClick={() => handleFieldChange('apiKey', '')}
                                        className="admin-btn admin-btn-danger"
                                        style={{ padding: '6px 8px', fontSize: '11px', height: '30px' }}
                                        title="Clear key"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Hint / Warning if key prefix does not match */}
                        {chatbot.apiKey && !chatbot.apiKey.startsWith(currentProvider.keyPrefix) && (
                            <div style={{
                                marginTop: '6px',
                                fontSize: '12px',
                                color: '#fbbf24',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <AlertCircle size={14} />
                                <span>Note: {currentProvider.name} keys typically begin with <code>{currentProvider.keyPrefix}</code>. Please double check if you copied the full key.</span>
                            </div>
                        )}
                    </div>

                    {/* Model Selector */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label className="admin-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Cpu size={15} style={{ color: '#818cf8' }} />
                                <span>Inference Model</span>
                            </label>

                            <button
                                type="button"
                                onClick={() => setCustomModelMode(!customModelMode)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#818cf8',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    padding: 0,
                                    textDecoration: 'underline'
                                }}
                            >
                                {customModelMode ? 'Choose from recommended models' : 'Enter custom model name'}
                            </button>
                        </div>

                        {customModelMode ? (
                            <input
                                type="text"
                                className="admin-input"
                                value={chatbot.model || currentProvider.defaultModel}
                                onChange={(e) => handleFieldChange('model', e.target.value)}
                                placeholder="e.g. llama-3.3-70b-versatile"
                            />
                        ) : (
                            <select
                                className="admin-input"
                                value={chatbot.model || currentProvider.defaultModel}
                                onChange={(e) => handleFieldChange('model', e.target.value)}
                                style={{ cursor: 'pointer' }}
                            >
                                {currentProvider.models.map(m => (
                                    <option key={m} value={m} style={{ background: '#0f172a', color: '#ffffff' }}>
                                        {m} {m === currentProvider.defaultModel ? '(Recommended Default)' : ''}
                                    </option>
                                ))}
                            </select>
                        )}
                        <span className="admin-help-text">
                            The AI model responsible for answering visitor inquiries in the floating website chatbot.
                        </span>
                    </div>

                    {/* Test Connection Button & Live Feedback Banner */}
                    <div style={{
                        padding: '16px 20px',
                        borderRadius: '12px',
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', marginBottom: '2px' }}>
                                    Live Connection Diagnostics
                                </div>
                                <div style={{ fontSize: '12.5px', color: '#94a3b8' }}>
                                    Sends a 1-token test prompt to {currentProvider.name} to verify your API key and latency immediately.
                                </div>
                            </div>

                            <button
                                type="button"
                                className="admin-btn admin-btn-primary"
                                onClick={handleTestConnection}
                                disabled={testState.testing || !chatbot.apiKey}
                                style={{ minWidth: '180px' }}
                            >
                                {testState.testing ? (
                                    <>
                                        <span className="admin-spinner" style={{ width: '14px', height: '14px' }} />
                                        <span>Testing Key...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={15} />
                                        <span>Test Connection</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Result Output */}
                        {testState.result && (
                            <div style={{
                                padding: '12px 16px',
                                borderRadius: '10px',
                                background: testState.result.ok ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                                border: `1px solid ${testState.result.ok ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                                color: testState.result.ok ? '#34d399' : '#f87171',
                                fontSize: '13px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                {testState.result.ok ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '700' }}>
                                        {testState.result.ok ? 'Connection Successful!' : 'Connection Test Failed'}
                                    </div>
                                    <div style={{ fontSize: '12.5px', marginTop: '2px', opacity: 0.9 }}>
                                        {testState.result.message}
                                    </div>
                                    {testState.result.reply && (
                                        <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.75 }}>
                                            Model reply: "{testState.result.reply}"
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── STEP 3: Customize Chatbot Branding & Greeting ── */}
            <div className="admin-card">
                <div className="admin-card-header" style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#34d399',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '13px'
                        }}>3</div>
                        <h3 className="admin-card-title" style={{ margin: 0 }}>
                            Chatbot Personality & Header Display
                        </h3>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <label className="admin-label">Bot Display Name</label>
                        <input
                            type="text"
                            className="admin-input"
                            value={chatbot.botName || 'Namustutam AI'}
                            onChange={(e) => handleFieldChange('botName', e.target.value)}
                            placeholder="e.g. Namustutam AI"
                        />
                        <span className="admin-help-text">Displayed on top of the floating chat window.</span>
                    </div>

                    <div>
                        <label className="admin-label">Bot Subtitle / Status</label>
                        <input
                            type="text"
                            className="admin-input"
                            value={chatbot.botSubtitle || 'Online • AI Consultant'}
                            onChange={(e) => handleFieldChange('botSubtitle', e.target.value)}
                            placeholder="e.g. Online • AI Consultant"
                        />
                        <span className="admin-help-text">Shows underneath the bot's name (e.g. 'Online & ready to help').</span>
                    </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <label className="admin-label">Welcome Greeting Message</label>
                    <textarea
                        className="admin-textarea"
                        rows={3}
                        value={chatbot.welcomeMessage || ''}
                        onChange={(e) => handleFieldChange('welcomeMessage', e.target.value)}
                        placeholder="Hello! 👋 I'm the Namustutam AI Assistant. Ask me anything about our custom software engineering, SaaS applications, or portfolio!"
                    />
                    <span className="admin-help-text">The initial introductory message displayed whenever a visitor opens the chat widget.</span>
                </div>
            </div>

            {/* ── STEP 4: Quick Action Starter Questions ── */}
            <div className="admin-card">
                <div className="admin-card-header" style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            background: 'rgba(236, 72, 153, 0.15)',
                            color: '#f472b6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '13px'
                        }}>4</div>
                        <h3 className="admin-card-title" style={{ margin: 0 }}>
                            Quick Starter Questions (Clickable Chips)
                        </h3>
                    </div>
                </div>

                <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#94a3b8' }}>
                    These interactive suggestion bubbles appear below the welcome message. Visitors can click any bubble to ask the question instantly without typing.
                </p>

                {/* Chips Container */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                    {(chatbot.quickPrompts || []).map((prompt, idx) => (
                        <div
                            key={idx}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 14px',
                                borderRadius: '9999px',
                                background: 'rgba(99, 102, 241, 0.15)',
                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                color: '#cbd5e1',
                                fontSize: '13px'
                            }}
                        >
                            <span>💬 {prompt}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveQuickPrompt(idx)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#94a3b8',
                                    cursor: 'pointer',
                                    padding: '0 2px',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                                title="Remove question"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add new chip form */}
                <form onSubmit={handleAddQuickPrompt} style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        className="admin-input"
                        value={newPromptText}
                        onChange={(e) => setNewPromptText(e.target.value)}
                        placeholder="Add a new quick question, e.g. 'What is the pricing for a POS website?'"
                    />
                    <button
                        type="submit"
                        className="admin-btn admin-btn-secondary"
                        disabled={!newPromptText.trim()}
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        <span>Add Question</span>
                    </button>
                </form>
            </div>

            {/* ── STEP 5: AI System Instructions & Knowledge Base ── */}
            <div className="admin-card">
                <div className="admin-card-header" style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            background: 'rgba(6, 182, 212, 0.15)',
                            color: '#22d3ee',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '13px'
                        }}>5</div>
                        <h3 className="admin-card-title" style={{ margin: 0 }}>
                            AI System Instructions & Business Knowledge Base
                        </h3>
                    </div>

                    <button
                        type="button"
                        onClick={handleLoadDefaultContext}
                        className="admin-btn admin-btn-secondary"
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                        <RotateCcw size={13} />
                        <span>Reset to Official Namustutam Knowledge Base</span>
                    </button>
                </div>

                <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#94a3b8' }}>
                    Define the rules, identity, services, portfolio, and contact details your AI assistant uses when responding to visitors.
                </p>

                <textarea
                    className="admin-textarea"
                    rows={12}
                    value={chatbot.systemPrompt !== undefined ? chatbot.systemPrompt : defaultSystemContext}
                    onChange={(e) => handleFieldChange('systemPrompt', e.target.value)}
                    placeholder="Enter custom markdown instructions for your AI assistant..."
                    style={{ fontFamily: 'monospace', fontSize: '12.5px', lineHeight: 1.5 }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11.5px', color: '#64748b' }}>
                    <span>Leave blank to use the built-in Namustutam IT consultant system prompt.</span>
                    <span>Length: {(chatbot.systemPrompt || defaultSystemContext).length} characters</span>
                </div>
            </div>

            {/* ── STEP 6: Live Interactive Test Sandbox ── */}
            <div className="admin-card" style={{
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.7) 0%, rgba(9, 13, 22, 0.95) 100%)',
                borderColor: 'rgba(99, 102, 241, 0.3)'
            }}>
                <div className="admin-card-header" style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            background: 'rgba(168, 85, 247, 0.15)',
                            color: '#c084fc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '13px'
                        }}>6</div>
                        <h3 className="admin-card-title" style={{ margin: 0 }}>
                            Live Chatbot Simulator / Test Sandbox
                        </h3>
                    </div>

                    <button
                        type="button"
                        onClick={() => setSandboxMessages([{ role: 'bot', text: chatbot.welcomeMessage || "Hello! How can I help you today?" }])}
                        className="admin-btn admin-btn-secondary"
                        style={{ fontSize: '11px', padding: '4px 10px' }}
                    >
                        <RotateCcw size={12} />
                        <span>Clear Chat</span>
                    </button>
                </div>

                <div style={{
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    background: '#090d16',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: '420px'
                }}>
                    {/* Simulator Header */}
                    <div style={{
                        padding: '12px 18px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '8px',
                                background: '#7c3aed',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Bot size={16} />
                            </div>
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>
                                    {chatbot.botName || 'Namustutam AI'} (Simulator)
                                </div>
                                <div style={{ fontSize: '11px', color: '#34d399' }}>
                                    Engine: {currentProvider.name} • {chatbot.model || currentProvider.defaultModel}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div style={{
                        padding: '18px',
                        overflowY: 'auto',
                        minHeight: '200px',
                        maxHeight: '300px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}>
                        {sandboxMessages.map((m, idx) => (
                            <div
                                key={idx}
                                style={{
                                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '85%',
                                    padding: '10px 14px',
                                    borderRadius: '12px',
                                    background: m.role === 'user' 
                                        ? 'linear-gradient(135deg, #ff620b 0%, #ea580c 100%)' 
                                        : m.isError 
                                            ? 'rgba(239, 68, 68, 0.15)' 
                                            : 'rgba(255, 255, 255, 0.06)',
                                    color: '#ffffff',
                                    fontSize: '13px',
                                    lineHeight: 1.5,
                                    border: m.isError ? '1px solid rgba(239, 68, 68, 0.4)' : 'none'
                                }}
                            >
                                {m.text}
                            </div>
                        ))}
                        {sandboxLoading && (
                            <div style={{
                                alignSelf: 'flex-start',
                                padding: '8px 14px',
                                borderRadius: '12px',
                                background: 'rgba(255, 255, 255, 0.06)',
                                color: '#94a3b8',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span className="admin-spinner" style={{ width: '12px', height: '12px' }} />
                                <span>Thinking...</span>
                            </div>
                        )}
                    </div>

                    {/* Simulator Input */}
                    <form onSubmit={handleSandboxSend} style={{
                        padding: '12px 14px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        gap: '8px',
                        background: 'rgba(255, 255, 255, 0.02)'
                    }}>
                        <input
                            type="text"
                            value={sandboxInput}
                            onChange={(e) => setSandboxInput(e.target.value)}
                            placeholder="Type a test message to preview bot behavior..."
                            className="admin-input"
                            style={{ height: '38px', fontSize: '13px' }}
                            disabled={sandboxLoading}
                        />
                        <button
                            type="submit"
                            disabled={!sandboxInput.trim() || sandboxLoading}
                            className="admin-btn admin-btn-orange"
                            style={{ height: '38px', padding: '0 16px' }}
                        >
                            <Send size={15} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Bottom Save Bar */}
            <div style={{
                position: 'sticky',
                bottom: '20px',
                padding: '16px 24px',
                borderRadius: '16px',
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(20px)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 40
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheck size={20} style={{ color: '#10b981' }} />
                    <span style={{ fontSize: '13.5px', color: '#cbd5e1' }}>
                        Ready to publish your AI Chatbot settings to the live website?
                    </span>
                </div>

                <button
                    type="button"
                    className="admin-btn admin-btn-orange"
                    onClick={saveAndPublish}
                    disabled={isSaving}
                    style={{ padding: '10px 24px', fontSize: '14px', fontWeight: '700' }}
                >
                    {isSaving ? (
                        <>
                            <span className="admin-spinner" style={{ width: '15px', height: '15px' }} />
                            <span>Publishing to Website...</span>
                        </>
                    ) : (
                        <>
                            <Save size={16} />
                            <span>Save & Publish Live</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
