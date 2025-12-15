import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

interface ChatbotUIProps {
    messages: Message[];
    onSendMessage: (text: string) => void;
    isTyping?: boolean;
}

const ChatbotUI: React.FC<ChatbotUIProps> = ({ messages, onSendMessage, isTyping }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    const handleSpeak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="flex flex-col h-[600px] glass-card overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-white/50 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Support Assistant</h3>
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm flex flex-col ${msg.sender === 'user'
                                        ? 'bg-violet-600 text-white rounded-br-none'
                                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                                    }`}
                            >
                                <p className="text-sm">{msg.text}</p>
                                {msg.sender === 'bot' && (
                                    <button
                                        onClick={() => handleSpeak(msg.text)}
                                        className="self-end mt-2 p-1 hover:bg-slate-100 rounded-full transition-colors"
                                        aria-label="Read aloud"
                                    >
                                        <Volume2 className="w-3 h-3 text-slate-400 hover:text-violet-600" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                            <span className="flex space-x-1">
                                <span className="animate-bounce delay-75 w-1 h-1 bg-slate-400 rounded-full"></span>
                                <span className="animate-bounce delay-150 w-1 h-1 bg-slate-400 rounded-full"></span>
                                <span className="animate-bounce delay-300 w-1 h-1 bg-slate-400 rounded-full"></span>
                            </span>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 bg-white/50 border-t border-slate-100">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-white/50"
                    />
                    <button
                        type="button"
                        className="p-2 text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors"
                    >
                        <Mic className="w-5 h-5" />
                    </button>
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="p-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-violet-200"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatbotUI;
