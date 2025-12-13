import React, { useEffect, useRef, useState } from 'react';
import { generateChatMessages } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send } from 'lucide-react';

interface ChatBoxProps {
  gameContext: string;
  messages: ChatMessage[];
  onAddMessage: (msg: ChatMessage) => void;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ gameContext, messages, onAddMessage }) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Periodic simulated chat
  useEffect(() => {
    const interval = setInterval(async () => {
      // 30% chance to fetch messages every 10 seconds to save API calls, or if chat is dead
      if (Math.random() > 0.7 || messages.length < 5) {
        setIsTyping(true);
        const newMessagesData = await generateChatMessages(gameContext);
        setIsTyping(false);
        
        newMessagesData.forEach((msg, idx) => {
            onAddMessage({
                id: Date.now() + '-' + idx,
                user: msg.user,
                text: msg.text,
                role: 'player'
            });
        });
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [gameContext, messages.length, onAddMessage]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      user: 'You', 
      text: inputText,
      role: 'player'
    };

    onAddMessage(userMsg);
    setInputText('');

    // Trigger immediate response if user asks something (simulated simple logic)
    if (inputText.toLowerCase().includes('code')) {
      setTimeout(() => {
        onAddMessage({
          id: Date.now() + 'sys',
          user: 'System',
          text: 'Try code "GEMINI" for a surprise!',
          isSystem: true
        });
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-md rounded-lg border border-white/10 overflow-hidden shadow-xl">
      <div className="bg-white/5 p-2 px-4 border-b border-white/10 flex justify-between items-center shrink-0">
        <span className="font-game font-bold text-sm tracking-wider uppercase text-gray-300">Server Chat</span>
        {isTyping && <span className="text-xs text-gray-500 animate-pulse">Players typing...</span>}
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2 font-game text-sm min-h-0">
        {messages.map((msg) => (
          <div key={msg.id} className={`${msg.isSystem ? 'text-red-400 font-bold italic' : 'text-white'}`}>
            {!msg.isSystem && (
              <span className={`font-bold mr-1 ${msg.user === 'You' ? 'text-green-400' : 'text-blue-400'} ${msg.role === 'admin' ? 'text-red-500' : ''}`}>
                [{msg.user}]:
              </span>
            )}
            <span className="break-words leading-snug">{msg.text}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-2 bg-white/5 border-t border-white/10 flex gap-2 shrink-0">
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type here..."
          className="flex-1 bg-black/50 border border-white/20 rounded px-3 py-1 text-sm text-white focus:outline-none focus:border-blue-500 font-game placeholder-gray-500"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded transition-colors">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};