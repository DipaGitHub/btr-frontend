import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Bot, ChevronRight } from 'lucide-react';
import './ChatAssistant.css';
import { API_BASE_URL } from '../../utils/apiConfig';

const STEPS = {
  LOADING: 'loading',
  TOPIC_SELECTION: 'topic_selection',
  ASKING_QUESTIONS: 'asking_questions',
  COLLECTING_NAME: 'collecting_name',
  COLLECTING_EMAIL: 'collecting_email',
  COLLECTING_PHONE: 'collecting_phone',
  SUBMITTED: 'submitted',
};

export function ChatAssistant({ onClose }) {
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(STEPS.LOADING);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [chatLog, setChatLog] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const hasInitialized = useRef(false); // Prevent double-init in React strict mode

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    fetch(`${API_BASE_URL}/api/chat/config`)
      .then(res => res.json())
      .then(data => {
        setTopics(data.topics || []);
        setQuestions(data.questions || []);
        startGreeting();
      })
      .catch(() => {
        startGreeting();
      });
  }, []);

  const startGreeting = () => {
    addBotMessage("👋 Welcome to BTR Bot! I'm here to help you find the right service for your needs.");
    setTimeout(() => {
      addBotMessage("How can I assist you today? Please select a topic below, or type your query.");
      setStep(STEPS.TOPIC_SELECTION);
    }, 1200);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addBotMessage = (text) => {
    const msg = { from: 'bot', text };
    setMessages(prev => [...prev, msg]);
    setChatLog(prev => [...prev, msg]);
  };

  const addUserMessage = (text) => {
    const msg = { from: 'user', text };
    setMessages(prev => [...prev, msg]);
    setChatLog(prev => [...prev, msg]);
  };

  const botSayDelayed = (text, delay = 900) => {
    setIsTyping(true);
    return new Promise(resolve => {
      setTimeout(() => {
        setIsTyping(false);
        addBotMessage(text);
        resolve();
      }, delay);
    });
  };

  const handleTopicSelect = async (topic) => {
    const label = topic.chat_label || topic.service_name;
    addUserMessage(label);
    setSelectedTopic(topic);

    const topicQuestions = questions.filter(q => q.topic_id === topic.id);
    topic.topicQuestions = topicQuestions;

    if (topicQuestions.length > 0) {
      await botSayDelayed(`Great! I have a few quick questions to better understand your needs. 🧐`);
      await botSayDelayed(topicQuestions[0].question_text, 700);
      setCurrentQIndex(0);
      setStep(STEPS.ASKING_QUESTIONS);
    } else {
      await botSayDelayed(`To connect you with our ${topic.service_name} experts, I'll need your contact details.`);
      await botSayDelayed("What's your full name?", 600);
      setStep(STEPS.COLLECTING_NAME);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    const value = input.trim();
    setInput('');
    addUserMessage(value);

    if (step === STEPS.ASKING_QUESTIONS) {
      const qs = selectedTopic?.topicQuestions || [];
      const nextIndex = currentQIndex + 1;

      if (nextIndex < qs.length) {
        setCurrentQIndex(nextIndex);
        await botSayDelayed(qs[nextIndex].question_text);
      } else {
        setCurrentQIndex(nextIndex);
        await botSayDelayed("Thanks for sharing! 🙏 To get you connected with the right team, I just need a few contact details.");
        await botSayDelayed("What's your full name?", 600);
        setStep(STEPS.COLLECTING_NAME);
      }

    } else if (step === STEPS.COLLECTING_NAME) {
      setUserData(prev => ({ ...prev, name: value }));
      await botSayDelayed(`Nice to meet you, ${value}! 😊 What's your email address?`);
      setStep(STEPS.COLLECTING_EMAIL);

    } else if (step === STEPS.COLLECTING_EMAIL) {
      setUserData(prev => ({ ...prev, email: value }));
      await botSayDelayed("Perfect! And lastly, your phone number?");
      setStep(STEPS.COLLECTING_PHONE);

    } else if (step === STEPS.COLLECTING_PHONE) {
      const finalData = { ...userData, phone: value };
      setUserData(finalData);
      setStep(STEPS.SUBMITTED);

      fetch(`${API_BASE_URL}/api/leads/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: finalData.name,
          email: finalData.email,
          phone: value,
          service: selectedTopic?.service_name || 'General Inquiry',
          source: 'Chat Assistant',
          chat_transcript: JSON.stringify([...chatLog, { from: 'user', text: value }])
        })
      }).catch(err => console.error("Lead submit error:", err));

      await botSayDelayed("All done! ✅ We've received your details. One of our experts will reach out to you very soon. Thank you!");
    }

    inputRef.current?.focus();
  };

  const getPlaceholder = () => {
    if (step === STEPS.COLLECTING_NAME) return "Enter your full name...";
    if (step === STEPS.COLLECTING_EMAIL) return "Enter your email address...";
    if (step === STEPS.COLLECTING_PHONE) return "Enter your phone number...";
    if (step === STEPS.ASKING_QUESTIONS) return "Type your answer...";
    return "Type a message...";
  };

  const showInput = [
    STEPS.ASKING_QUESTIONS,
    STEPS.COLLECTING_NAME,
    STEPS.COLLECTING_EMAIL,
    STEPS.COLLECTING_PHONE,
  ].includes(step);

  const showTopics = step === STEPS.TOPIC_SELECTION && !isTyping && topics.length > 0;

  return (
    <div className="chat-assistant-panel">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="bot-avatar">
            <Bot size={16} />
          </div>
          <div>
            <h3>BTR Bot</h3>
            <span className="online-status">● Online</span>
          </div>
        </div>
        <button className="close-btn" onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="chat-body">
        {messages.map((m, i) => (
          <div key={i} className={`message-row ${m.from}`}>
            {m.from === 'bot' && (
              <div className="msg-avatar"><Bot size={12} /></div>
            )}
            <div className="msg-bubble">{m.text}</div>
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

        {/* Topic chips — shown AFTER greeting, using chat_label */}
        {showTopics && (
          <div className="topic-chips">
            {topics.map(t => (
              <button
                key={t.id}
                className="topic-chip"
                onClick={() => handleTopicSelect(t)}
              >
                {/* Show the custom chat_label if set, otherwise fall back to service_name */}
                {t.chat_label || t.service_name}
                <ChevronRight size={14} />
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {showInput && (
        <form className="chat-footer" onSubmit={handleSend}>
          <input
            ref={inputRef}
            type={step === STEPS.COLLECTING_EMAIL ? 'email' : step === STEPS.COLLECTING_PHONE ? 'tel' : 'text'}
            placeholder={getPlaceholder()}
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
          />
          <button type="submit" disabled={isTyping}>
            <Send size={16} />
          </button>
        </form>
      )}
    </div>
  );
}
