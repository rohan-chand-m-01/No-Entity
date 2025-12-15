import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../hooks/useAppLanguage';
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
    const { t } = useLanguage();
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
        <div className="flex flex-col h-[600px] bg-white dark:bg-surface border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-clean-lg">
            {/* Header */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-primary">{t.chat.headerTitle}</h3>
                    <p className="text-xs text-secondary">{t.chat.headerSubtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900/50">
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
                                className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm text-sm leading-relaxed flex flex-col ${msg.sender === 'user'
                                    ? 'bg-primary text-white rounded-br-none'
                                    : 'bg-white dark:bg-surface text-primary border border-slate-200 dark:border-slate-700 rounded-bl-none'
                                    }`}
                            >
                                <p>{msg.text}</p>
                                {msg.sender === 'bot' && (
                                    <button
                                        onClick={() => handleSpeak(msg.text)}
                                        className="self-end mt-2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                        aria-label="Read aloud"
                                    >
                                        <Volume2 className="w-3.5 h-3.5 text-secondary hover:text-accent" />
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
                        <div className="bg-white dark:bg-surface text-primary border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                            <span className="flex space-x-1">
                                <span className="animate-bounce delay-75 w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                                <span className="animate-bounce delay-150 w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                                <span className="animate-bounce delay-300 w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                            </span>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-surface border-t border-slate-200 dark:border-slate-800">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t.chat.placeholder}
                        className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent bg-slate-50 dark:bg-slate-900 text-sm text-primary placeholder:text-secondary"
                    />
                    <button
                        type="button"
                        className="p-3 text-secondary hover:text-accent hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                        <Mic className="w-5 h-5" />
                    </button>
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="p-3 bg-primary text-white dark:text-background rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatbotUI;
