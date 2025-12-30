
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiChat } from '../services/aiService';
import { Message } from '../types';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Good day. I am Professor Gong. How may I assist you with your English grammar today?\n\n您好。我是龚教授。今天我能在英语语法方面为您提供什么帮助？', 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatInstance = useRef<any>(null);

  // 初始化聊天会话
  useEffect(() => {
    try {
      chatInstance.current = getGeminiChat();
    } catch (e) {
      console.error("Failed to initialize chat:", e);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // 如果实例失效，尝试重新初始化
      if (!chatInstance.current) {
        chatInstance.current = getGeminiChat();
      }

      const result = await chatInstance.current.sendMessage({ message: currentInput });
      const aiResponse = result.text;
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: aiResponse || 'My apologies, I seem to have encountered a temporary silence.', 
        timestamp: Date.now() 
      }]);
    } catch (error: any) {
      console.error("Chat Error:", error);
      // 针对常见的权限或网络错误提供友好提示
      let errorMsg = 'I am terribly sorry, but an error has occurred. Please check your connection or try again later.';
      if (error.message?.includes('API_KEY')) {
        errorMsg = 'My AI core is missing its authorization key. Please ensure your API setup is correct.';
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMsg, 
        timestamp: Date.now() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white shadow-2xl md:rounded-2xl overflow-hidden border border-slate-100">
      <div className="bg-slate-900 p-5 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-2xl shadow-inner border-2 border-indigo-400/30">G</div>
          <div>
            <h2 className="font-bold text-lg serif tracking-wide">Professor Gong</h2>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Active • Gemini 3 Pro</p>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] p-5 rounded-2xl shadow-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-100' 
                : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
            }`}>
              <div className="whitespace-pre-wrap text-[15px]">{msg.content}</div>
              <div className={`text-[10px] mt-3 font-medium opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100 flex items-center space-x-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Compose your inquiry in English or Chinese..."
          className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-700"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-indigo-600 text-white p-4 rounded-2xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg active:scale-95"
        >
          <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
