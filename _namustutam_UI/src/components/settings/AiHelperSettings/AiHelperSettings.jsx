import React, { useState, useEffect } from 'react';
import {
  Bot, Key, Eye, EyeOff, Save, Trash2,
  CheckCircle2, AlertCircle, ExternalLink,
  Cpu, ClipboardPaste, Sparkles, Info
} from 'lucide-react';
import apiClient, { API } from '../../../api/config';

/**
 * Strip ALL whitespace, newlines, zero-width spaces, BOM, and other
 * invisible Unicode characters from an API key string.
 * Keeps only printable ASCII (0x21–0x7E) — the only characters valid in API keys.
 */
const sanitizeKey = (raw = '') =>
  raw.split('').filter(c => {
    const code = c.charCodeAt(0);
    return code >= 0x21 && code <= 0x7E;
  }).join('');

const PROVIDERS = [
  // ── Free / No credit card required ────────────────────────────────
  {
    id: 'groq',
    name: 'Groq',
    badge: '100% FREE',
    badgeColor: '#16a34a',
    models: [
      'llama-3.3-70b-versatile',   // Best all-round
      'llama-3.1-8b-instant',      // Fastest
      'mixtral-8x7b-32768',        // Long context
      'gemma2-9b-it',              // Lightweight
    ],
    keyPrefix: 'gsk_…',
    docsUrl: 'https://console.groq.com/keys',
    description: 'Llama 3.3 & Mixtral · No credit card',
    emoji: '⚡',
    color: '#f59e0b',
    isFree: true,
  },
  {
    id: 'gemini',
    name: 'Google AI Studio',
    badge: 'FREE TIER',
    badgeColor: '#16a34a',
    models: [
      'gemini-1.5-flash',
      'gemini-1.5-flash-8b',
      'gemini-1.5-pro',
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite',
    ],
    keyPrefix: 'AIzaSy…',
    docsUrl: 'https://aistudio.google.com/app/apikey',
    description: 'Gemini 1.5 Flash · 1,500 free req/day',
    emoji: '✦',
    color: '#4285f4',
    isFree: true,
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    badge: 'FREE TIER',
    badgeColor: '#16a34a',
    models: [
      'mistral-small-latest',
      'open-mistral-7b',
      'open-mixtral-8x7b',
      'mistral-medium-latest',
    ],
    keyPrefix: 'sk-…',
    docsUrl: 'https://console.mistral.ai/api-keys',
    description: 'Mistral Small & Mixtral · Free trial',
    emoji: '🌊',
    color: '#7c3aed',
    isFree: true,
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    badge: 'FREE MODELS',
    badgeColor: '#16a34a',
    models: [
      'meta-llama/llama-3.3-70b-instruct:free',
      'google/gemma-3-27b-it:free',
      'deepseek/deepseek-r1:free',
      'mistralai/mistral-7b-instruct:free',
      'qwen/qwen-2.5-72b-instruct:free',
    ],
    keyPrefix: 'sk-or-…',
    docsUrl: 'https://openrouter.ai/keys',
    description: 'Llama, Gemma, Mistral · Many free models',
    emoji: '🔀',
    color: '#0ea5e9',
    isFree: true,
  },
  // ── Paid providers ─────────────────────────────────────────────────
  {
    id: 'openai',
    name: 'OpenAI',
    badge: 'ChatGPT',
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo', 'gpt-4-turbo'],
    keyPrefix: 'sk-…',
    docsUrl: 'https://platform.openai.com/api-keys',
    description: 'GPT-4o, GPT-3.5 & GPT-4 Turbo',
    emoji: '🤖',
    color: '#10a37f',
  },
  {
    id: 'claude',
    name: 'Anthropic',
    badge: 'Claude',
    models: [
      'claude-3-5-sonnet-20241022',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307',
    ],
    keyPrefix: 'sk-ant-…',
    docsUrl: 'https://console.anthropic.com/settings/keys',
    description: 'Claude 3.5 Sonnet, Sonnet & Haiku',
    emoji: '◆',
    color: '#cc785c',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    badge: 'R1 / V3',
    models: [
      'deepseek-chat',       // DeepSeek-V3 — fast, smart
      'deepseek-reasoner',   // DeepSeek-R1 — reasoning model
    ],
    keyPrefix: 'sk-…',
    docsUrl: 'https://platform.deepseek.com/api_keys',
    description: 'DeepSeek-V3 & R1 · Very affordable',
    emoji: '🔵',
    color: '#4f6ef7',
  },
];

export const AiHelperSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // { ok, message }

  const [provider, setProvider] = useState('openai');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [maskedKey, setMaskedKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const selectedProvider = PROVIDERS.find(p => p.id === provider) || PROVIDERS[0];

  // ── Fetch settings ──────────────────────────────────────────────────────
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`${API.AI}/settings`);
      setProvider(res.data.provider || 'openai');
      setModel(res.data.model || 'gpt-3.5-turbo');
      setHasKey(res.data.hasKey || false);
      setMaskedKey(res.data.maskedKey || '');
    } catch (e) {
      console.error('Failed to fetch AI settings', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  // ── Save ────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!apiKey.trim() && !hasKey) {
      setErrorMsg('Please enter your API key before saving.');
      return;
    }
    setSaving(true);
    try {
      const payload = { provider, model };
      // Always sanitize before sending — strips any invisible copy-paste artifacts
      const cleanKey = sanitizeKey(apiKey);
      if (cleanKey) payload.apiKey = cleanKey;
      await apiClient.post(`${API.AI}/settings`, payload);
      await fetchSettings();
      setApiKey('');
      setSuccessMsg('AI Helper settings saved successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (e) {
      setErrorMsg(e.response?.data?.error || 'Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Remove Key ──────────────────────────────────────────────────────────
  const handleRemoveKey = async () => {
    if (!window.confirm('Remove your stored API key? The AI Helper will be disabled until you add a new key.')) return;
    setRemoving(true);
    setErrorMsg('');
    try {
      await apiClient.delete(`${API.AI}/settings/key`);
      setHasKey(false);
      setMaskedKey('');
      setApiKey('');
      setSuccessMsg('API key removed successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (_e) {
      setErrorMsg('Failed to remove API key.');
    } finally {
      setRemoving(false);
    }
  };

  // ── Paste ───────────────────────────────────────────────────────────────
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      // Sanitize immediately on paste: strip spaces, newlines, invisible chars
      const clean = sanitizeKey(text);
      setApiKey(clean);
      if (!clean) setErrorMsg('Clipboard content appears empty or invalid.');
    } catch {
      setErrorMsg('Clipboard access denied. Please paste manually.');
    }
  };

  // ── Test Connection ───────────────────────────────────────────────────────
  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    setErrorMsg('');
    try {
      const res = await apiClient.get(`${API.AI}/test`);
      setTestResult(res.data);
    } catch (e) {
      setTestResult({
        ok: false,
        message: e.response?.data?.error || 'Test failed. Please check your network and try again.',
      });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '32px 24px', color: '#64748b', fontSize: '14px' }}>
        Loading AI settings…
      </div>
    );
  }

  return (
    <>
      {/* ── Header ── */}
      <div className="settings-content-header">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#1e293b' }}>
          <Bot size={19} style={{ color: '#f97316' }} />
          AI Helper
        </h3>
      </div>

      <div className="settings-content-body">

        {/* ── Status Card ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 18px',
          borderRadius: '10px',
          marginBottom: '24px',
          background: hasKey ? '#f0fdf4' : '#fffbeb',
          border: `1px solid ${hasKey ? '#bbf7d0' : '#fde68a'}`,
        }}>
          {hasKey
            ? <CheckCircle2 size={19} style={{ color: '#10b981', flexShrink: 0 }} />
            : <AlertCircle  size={19} style={{ color: '#f59e0b', flexShrink: 0 }} />
          }
          <div>
            <div style={{ fontWeight: 600, fontSize: '13.5px', color: hasKey ? '#065f46' : '#92400e' }}>
              {hasKey ? 'AI Helper is Active' : 'Setup Required'}
            </div>
            <div style={{ fontSize: '12px', color: hasKey ? '#059669' : '#b45309', marginTop: '2px' }}>
              {hasKey
                ? `Key: ${maskedKey} · ${selectedProvider.badge || selectedProvider.name} (${selectedProvider.name}) · ${model}`
                : 'Add your API key below to enable the floating AI chatbot.'}
            </div>
          </div>
        </div>

        {/* ── Provider Selection ── */}
        <div className="settings-section-title" style={{ marginBottom: '14px' }}>
          <Cpu size={17} />
          <span>AI Provider</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '9px', marginBottom: '24px' }}>
          {PROVIDERS.map(p => (
            <div
              key={p.id}
              onClick={() => { setProvider(p.id); setModel(p.models[0].split('//')[0].trim()); }}
              style={{
                padding: '11px 12px',
                borderRadius: '10px',
                border: `2px solid ${provider === p.id ? (p.color || '#f97316') : '#e2e8f0'}`,
                background: provider === p.id ? (p.color ? `${p.color}12` : '#fff7ed') : '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                boxShadow: provider === p.id ? `0 4px 12px ${p.color || '#f97316'}22` : 'none',
                position: 'relative',
              }}
            >
              {/* Badge */}
              {p.badge && (
                <span style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  fontSize: '8px',
                  fontWeight: 700,
                  background: provider === p.id
                    ? (p.badgeColor || p.color || '#f97316')
                    : (p.isFree ? '#dcfce7' : '#e2e8f0'),
                  color: provider === p.id
                    ? '#fff'
                    : (p.isFree ? '#15803d' : '#64748b'),
                  borderRadius: '4px',
                  padding: '1px 4px',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>
                  {p.badge}
                </span>
              )}
              <div style={{ fontSize: '18px', marginBottom: '5px', lineHeight: 1 }}>
                {p.emoji}
              </div>
              <div style={{
                fontWeight: 700,
                fontSize: '12px',
                color: provider === p.id ? (p.color || '#c2410c') : '#334155',
                marginBottom: '2px',
              }}>
                {p.name}
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8', lineHeight: 1.3 }}>
                {p.description}
              </div>
            </div>
          ))}
        </div>

        {/* ── Model Selection ── */}
        <div className="settings-form-row" style={{ marginBottom: '10px' }}>
          <div className="settings-form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={13} style={{ color: '#f97316' }} />
              Model
            </label>
            <select value={model} onChange={e => setModel(e.target.value)}>
              {selectedProvider.models.map(m => {
                const cleanName = m.split('//')[0].trim();
                const isFree    = cleanName.includes('1.5') || cleanName.endsWith(':free');
                const isBilling = cleanName.includes('2.0') && provider === 'gemini';
                const label = provider === 'gemini'
                  ? `${cleanName}${isFree ? '  ✅ Free tier' : isBilling ? '  ⚠️ Billing required' : ''}`
                  : cleanName;
                return <option key={cleanName} value={cleanName}>{label}</option>;
              })}
            </select>
          </div>
        </div>

        {/* Gemini quota tip */}
        {provider === 'gemini' && (model.includes('2.0') || model === 'gemini-2.0-flash' || model === 'gemini-2.0-flash-lite') && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '7px',
            padding: '10px 13px', borderRadius: '8px', marginBottom: '16px',
            background: '#fffbeb', border: '1px solid #fde68a',
            fontSize: '12px', color: '#92400e', lineHeight: 1.5,
          }}>
            <span style={{ fontSize: '14px', flexShrink: 0 }}>⚠️</span>
            <span>
              <strong>gemini-2.0-flash</strong> has a free-tier limit of <strong>0 req/day</strong> — it requires billing.
              Switch to <strong>gemini-1.5-flash</strong> for 1,500 free requests/day, or{' '}
              <a href="https://console.cloud.google.com/billing" target="_blank" rel="noopener noreferrer"
                style={{ color: '#d97706', fontWeight: 600 }}>enable billing</a> on your Google Cloud project.
            </span>
          </div>
        )}

        {provider === 'gemini' && model.includes('1.5') && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '8px 13px', borderRadius: '8px', marginBottom: '16px',
            background: '#f0fdf4', border: '1px solid #bbf7d0',
            fontSize: '12px', color: '#065f46',
          }}>
            <span style={{ fontSize: '13px' }}>✅</span>
            <span>
              <strong>{model}</strong> — free tier:&nbsp;
              {model.includes('pro') ? '50 requests/day, 2 RPM' : '1,500 requests/day, 15 RPM'}
            </span>
          </div>
        )}

        {/* ── API Key Section ── */}
        <div className="settings-section-title" style={{ marginBottom: '12px' }}>
          <Key size={17} />
          <span>API Key</span>
          <a
            href={selectedProvider.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginLeft: 'auto',
              fontSize: '11.5px',
              color: '#f97316',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Get {selectedProvider.name} key <ExternalLink size={11} />
          </a>
        </div>

        {/* Current key display */}
        {hasKey && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: '8px',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            fontSize: '13px',
            color: '#065f46',
            marginBottom: '12px',
          }}>
            <CheckCircle2 size={14} style={{ color: '#10b981', flexShrink: 0 }} />
            <span>Current stored key:</span>
            <code style={{
              fontFamily: 'monospace',
              fontSize: '12px',
              background: 'rgba(0,0,0,0.06)',
              padding: '1px 7px',
              borderRadius: '4px',
              letterSpacing: '0.05em',
              color: '#047857',
            }}>
              {maskedKey}
            </code>
          </div>
        )}

        {/* Key input */}
        <div className="settings-form-group" style={{ marginBottom: '6px' }}>
          <label>{hasKey ? 'Replace API Key' : `Enter ${selectedProvider.name} API Key`}</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showKey ? 'text' : 'password'}
              placeholder={hasKey
                ? `Enter new key to replace current (${selectedProvider.keyPrefix})`
                : `Paste your API key here (${selectedProvider.keyPrefix})`}
              value={apiKey}
              onChange={e => setApiKey(sanitizeKey(e.target.value))}
              style={{
                paddingRight: '80px',
                fontFamily: apiKey ? 'monospace' : 'inherit',
                letterSpacing: apiKey && !showKey ? '0.15em' : 'normal',
              }}
            />
            <div style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              gap: '2px',
              alignItems: 'center',
            }}>
              <button
                type="button"
                onClick={handlePaste}
                title="Paste from clipboard"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: '4px',
                  display: 'flex',
                  borderRadius: '4px',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#f97316'}
                onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
              >
                <ClipboardPaste size={15} />
              </button>
              <button
                type="button"
                onClick={() => setShowKey(v => !v)}
                title={showKey ? 'Hide key' : 'Show key'}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: '4px',
                  display: 'flex',
                  borderRadius: '4px',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#f97316'}
                onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
              >
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        </div>

        {/* Security note */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '6px',
          padding: '9px 12px',
          borderRadius: '7px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          fontSize: '11.5px',
          color: '#64748b',
          marginBottom: '20px',
          lineHeight: 1.5,
        }}>
          <Info size={13} style={{ color: '#94a3b8', flexShrink: 0, marginTop: '1px' }} />
          <span>
            Your API key is stored securely as bytes in the database and is never shared with other users.
            All AI requests are proxied through the server — your key never appears in browser network logs.
          </span>
        </div>

        {/* ── Success / Error messages ── */}
        {successMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '11px 14px',
            borderRadius: '8px',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            fontSize: '13px',
            color: '#065f46',
            marginBottom: '16px',
            fontWeight: 500,
          }}>
            <CheckCircle2 size={14} style={{ color: '#10b981' }} /> {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '11px 14px',
            borderRadius: '8px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            fontSize: '13px',
            color: '#991b1b',
            marginBottom: '16px',
            fontWeight: 500,
          }}>
            <AlertCircle size={14} style={{ color: '#ef4444' }} /> {errorMsg}
          </div>
        )}

        {/* ── Test result ── */}
        {testResult && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '8px',
            padding: '11px 14px', borderRadius: '8px', marginBottom: '14px',
            background: testResult.ok ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${testResult.ok ? '#bbf7d0' : '#fecaca'}`,
            fontSize: '13px',
            color: testResult.ok ? '#065f46' : '#991b1b',
            fontWeight: 500,
            whiteSpace: 'pre-line',
          }}>
            {testResult.ok
              ? <CheckCircle2 size={15} style={{ color: '#10b981', flexShrink: 0, marginTop: '1px' }} />
              : <AlertCircle  size={15} style={{ color: '#ef4444', flexShrink: 0, marginTop: '1px' }} />}
            <span>{testResult.message}</span>
          </div>
        )}

        {/* ── Action Buttons ── */}
        <div className="settings-actions">
          {hasKey && (
            <button
              className="btn-action red"
              onClick={handleRemoveKey}
              disabled={removing}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Trash2 size={13} />
              {removing ? 'Removing…' : 'Remove Key'}
            </button>
          )}
          {hasKey && (
            <button
              onClick={handleTest}
              disabled={testing}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '7px', fontSize: '13px',
                fontWeight: 600, cursor: testing ? 'not-allowed' : 'pointer',
                border: '1.5px solid #e2e8f0',
                background: testing ? '#f1f5f9' : '#fff',
                color: '#475569',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!testing) { e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.color = '#f97316'; }}}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}
            >
              {testing
                ? <><span style={{ width: '13px', height: '13px', border: '2px solid #cbd5e1', borderTopColor: '#f97316', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Testing…</>
                : <><CheckCircle2 size={13} /> Test Connection</>}
            </button>
          )}
          <button
            className="btn-cancel"
            onClick={() => { setApiKey(''); setErrorMsg(''); setSuccessMsg(''); setTestResult(null); }}
          >
            Cancel
          </button>
          <button
            className="btn-save"
            onClick={handleSave}
            disabled={saving}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Save size={13} />
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>

        <div className="settings-divider" />

        {/* ── How to Use ── */}
        <div className="settings-section-title" style={{ marginBottom: '14px' }}>
          <Bot size={17} />
          <span>How to Use AI Helper</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { step: '1', title: 'Save your API key', desc: 'Choose a provider, select a model, paste your API key, and click Save Settings above.' },
            { step: '2', title: 'Open the chatbot', desc: 'A floating orange bot button appears at the bottom-right of every page. Click it to open the chat panel.' },
            { step: '3', title: 'Use Quick Actions', desc: 'Click "Fix / Quick Actions" for one-click prompts — Fix Error, Explain Feature, Best Practice, and more.' },
            { step: '4', title: 'Private & isolated', desc: 'Your chat history is private to your account. Other users cannot see your messages or access your API key.' },
          ].map(item => (
            <div
              key={item.step}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '9px',
                border: '1px solid #f1f5f9',
                background: '#f8fafc',
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '7px',
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {item.step}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '13px', color: '#334155', marginBottom: '2px' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
};
