import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Bot, RefreshCw, Sparkles } from 'lucide-react';
import './ChatAssistant.css';
import { API_BASE_URL } from '../../utils/apiConfig';

const DEFAULT_WELCOME = "👋 Welcome to BTR Communication! I'm your AI Sales & Support Assistant. How can I help you with your project today?";

const STARTER_PROMPTS = [
  "What services do you offer?",
  "How much does a website cost?",
  "Can I see your previous work / portfolio?",
  "I want to discuss an upcoming project"
];

// Helper to generate or get existing unique session ID
function getSessionId() {
  let sid = sessionStorage.getItem('btr_ai_session_id');
  if (!sid) {
    sid = 'btr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    sessionStorage.setItem('btr_ai_session_id', sid);
  }
  return sid;
}

// Simple text formatter for AI responses (handles basic bold, linebreaks, and bullet points)
function FormattedMessage({ text }) {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className="formatted-msg">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="msg-spacer" />;
        }

        // Bullet point detection
        const isBullet = trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ');
        const cleanLine = isBullet ? trimmed.replace(/^[\*\•\-]\s*/, '') : trimmed;

        // Parse bold text **text**
        const parts = cleanLine.split(/(\*\*.*?\*\*)/g);

        const renderedLine = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={idx} className="msg-bullet">
              <span className="bullet-dot">•</span>
              <span className="bullet-text">{renderedLine}</span>
            </div>
          );
        }

        return <div key={idx} className="msg-line">{renderedLine}</div>;
      })}
    </div>
  );
}

export function ChatAssistant({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [botName, setBotName] = useState('BTR Bot');
  const [errorMsg, setErrorMsg] = useState(null);
  const [showStarters, setShowStarters] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const sessionIdRef = useRef(getSessionId());
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const sessionId = sessionIdRef.current;

    // 1. Fetch AI config and history
    Promise.all([
      fetch(`${API_BASE_URL}/api/ai/config`).then(res => res.json()).catch(() => null),
      fetch(`${API_BASE_URL}/api/ai/history/${sessionId}`).then(res => res.json()).catch(() => null)
    ]).then(([configData, historyData]) => {
      const welcome = configData?.welcomeMessage || DEFAULT_WELCOME;
      if (configData?.botName) {
        setBotName(configData.botName);
      }

      if (historyData?.messages && historyData.messages.length > 0) {
        setMessages(historyData.messages);
        setShowStarters(false);
      } else {
        setMessages([{ from: 'bot', text: welcome }]);
        setShowStarters(true);
      }
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (textToSend) => {
    const message = (textToSend || input).trim();
    if (!message || isTyping) return;

    setInput('');
    setErrorMsg(null);
    setShowStarters(false);

    // Add user message to UI immediately
    const userMsg = { from: 'user', text: message };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          message: message
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const reply = data.message || "I've received your request. How else can I assist you with BTR services?";

      setMessages(prev => [...prev, { from: 'bot', text: reply }]);
    } catch (err) {
      console.error("AI Chat error:", err);
      setErrorMsg("Failed to connect to AI Assistant. Please try again.");
      setMessages(prev => [
        ...prev,
        {
          from: 'bot',
          text: "I'm having a brief issue connecting to our servers. Please try again or reach out to us at info@btrcommunication.com."
        }
      ]);
    } finally {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleStarterClick = (prompt) => {
    sendMessage(prompt);
  };

  const handleResetSession = () => {
    const newSid = 'btr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    sessionStorage.setItem('btr_ai_session_id', newSid);
    sessionIdRef.current = newSid;
    setMessages([{ from: 'bot', text: DEFAULT_WELCOME }]);
    setShowStarters(true);
    setErrorMsg(null);
  };

  return (
    <div className="chat-assistant-panel">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="bot-avatar">
            <Bot size={16} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3>{botName}</h3>
              <Sparkles size={12} className="text-amber-400" />
            </div>
            <span className="online-status">● AI Online</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="close-btn"
            onClick={handleResetSession}
            title="Start new conversation"
          >
            <RefreshCw size={14} />
          </button>
          <button className="close-btn" onClick={onClose} title="Close Chat">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-body">
        {messages.map((m, i) => (
          <div key={i} className={`message-row ${m.from}`}>
            {m.from === 'bot' && (
              <div className="msg-avatar"><Bot size={12} /></div>
            )}
            <div className="msg-bubble">
              {m.from === 'bot' ? <FormattedMessage text={m.text} /> : m.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="message-row bot">
            <div className="msg-avatar"><Bot size={12} /></div>
            <div className="msg-bubble typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}

        {/* Quick starter chips */}
        {showStarters && !isTyping && (
          <div className="topic-chips">
            <span className="starter-hint">💡 Suggested topics:</span>
            {STARTER_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                className="topic-chip"
                onClick={() => handleStarterClick(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form className="chat-footer" onSubmit={handleSend}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Ask anything about BTR services, pricing, projects..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={isTyping}
          autoFocus
        />
        <button type="submit" disabled={isTyping || !input.trim()}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
