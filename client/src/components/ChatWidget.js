import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiChat, BiSend } from 'react-icons/bi';
import { FiX } from 'react-icons/fi';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function ChatWidget() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Hi there! How can I help you find what you need today?',
      productId: null,
      productName: null,
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg = { role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      const { data } = await axios.post(`${API_URL}/api/chat`, {
        message: text,
      });

      const botMsg = {
        role: 'bot',
        text: data.message,
        productId: data.productId || null,
        productName: data.productName || null,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: 'Sorry, something went wrong. Please try again.',
          productId: null,
          productName: null,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[340px] sm:w-[380px] h-[480px] bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-white">
            <div className="flex items-center gap-2">
              <BiChat size={20} />
              <span className="font-semibold text-sm">FreshCart Assistant</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close chat"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.productId && (
                    <button
                      onClick={() => {
                        navigate(`/product/${msg.productId}`);
                        setOpen(false);
                      }}
                      className="mt-2 block text-xs font-semibold underline underline-offset-2"
                    >
                      View {msg.productName || 'Product'} &rarr;
                    </button>
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-dark-bg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="p-2.5 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <BiSend size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-4 sm:right-6 w-14 h-14 flex items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark hover:scale-105 active:scale-95 transition-all duration-200 z-50"
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? <FiX size={24} /> : <BiChat size={26} />}
      </button>
    </>
  );
}
