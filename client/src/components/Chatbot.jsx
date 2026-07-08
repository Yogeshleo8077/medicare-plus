import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import api from '../services/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', parts: 'Hi there! 👋 I am MediBot. Tell me your symptoms and I will help you find the right doctor.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message to state
    const newMessages = [...messages, { role: 'user', parts: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Send chat history (excluding the first welcome message if we want to save tokens, but here we'll send it all)
      // Actually, let's just send the last 10 messages to keep it light
      const historyToSend = newMessages.slice(-10);
      
      const response = await api.post('/chat', {
        message: userMessage,
        history: historyToSend.slice(0, -1) // Exclude the very last message as it's sent in 'message' field
      });

      setMessages([...newMessages, { role: 'model', parts: response.data.reply }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([
        ...newMessages,
        { role: 'model', parts: 'Oops! I am having trouble connecting to my brain right now. Please try again later.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-medical-blue to-medical-teal text-white shadow-2xl hover:shadow-medical-blue/30 hover:-translate-y-1 transition-all duration-300 z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
        </span>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-medical-blue/20 dark:shadow-black/50 border border-gray-100 dark:border-slate-700 flex flex-col overflow-hidden z-50 transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-medical-blue to-medical-teal text-white flex justify-between items-center shadow-md">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">MediBot AI</h3>
              <p className="text-xs text-blue-100 font-medium">Symptom Checker</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50 dark:bg-slate-900 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-600">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end`}>
                
                {/* Avatar */}
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'ml-2 bg-medical-blue text-white' : 'mr-2 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div 
                  className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-medical-blue text-white rounded-br-sm' 
                      : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-slate-700 rounded-bl-sm'
                  }`}
                >
                  {msg.parts}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] flex-row items-end">
                <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-2 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-4 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-bl-sm shadow-sm flex space-x-1.5">
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your symptoms..."
              disabled={isLoading}
              className="w-full pl-5 pr-14 py-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-medical-teal dark:text-white transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2 bg-medical-blue hover:bg-medical-teal text-white rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-medical-blue shadow-sm"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
