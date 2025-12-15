import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Mic, Send } from 'lucide-react';
import { assistantRouter } from '../assistant/router';
import { voiceHandler } from '../assistant/voice';

const AssistantWidget: React.FC = () => {
    // 1. State Definitions
    const [isOpen, setIsOpen] = useState(false);
    const [inputLang, setInputLang] = useState<'en' | 'kn' | 'hi'>('en');
    const [messages, setMessages] = useState<{ text: string, sender: 'user' | 'bot' }[]>([]);
    const [inputText, setInputText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 3. Effects
    // Initial Greeting
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const hour = new Date().getHours();
            let greeting = "Hello! I'm Gati Sahayak. How can I help you today?";
            if (hour < 12) greeting = "Good Morning! ☀️ I'm here to help with your bus queries.";
            else if (hour < 18) greeting = "Good Afternoon! 🌤️ Need a bus?";
            else greeting = "Good Evening! 🌙 Traveling late?";

            setMessages([{ text: greeting, sender: 'bot' }]);
            voiceHandler.speak(greeting, 'en');
        }
    }, [isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isThinking]);

    // 4. Handle Text Send
    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMsg = inputText.trim();
        setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
        setInputText('');
        setIsThinking(true);

        try {
            const response = await assistantRouter.processMessage(userMsg);
            setMessages(prev => [...prev, { text: response.text, sender: 'bot' }]);

            // TTS
            voiceHandler.speak(response.text, response.lang);
        } catch (e) {
            setMessages(prev => [...prev, { text: "Sorry, I encountered an error.", sender: 'bot' }]);
        } finally {
            setIsThinking(false);
        }
    };

    // 5. Helper to send directly from voice
    const handleSend2 = async (text: string) => {
        setMessages(prev => [...prev, { text: text, sender: 'user' }]);
        setIsThinking(true);
        try {
            const response = await assistantRouter.processMessage(text);
            setMessages(prev => [...prev, { text: response.text, sender: 'bot' }]);
            voiceHandler.speak(response.text, response.lang);
        } finally {
            setIsThinking(false);
        }
    };

    // 3. Toggle Mic
    const toggleMic = () => {
        if (isListening) {
            voiceHandler.stopListening();
            setIsListening(false);
        } else {
            setIsListening(true);
            voiceHandler.startListening(
                (text) => {
                    setInputText(text);
                    setIsListening(false);
                    // Auto-send
                    setTimeout(() => handleSend2(text), 500);
                },
                (err) => {
                    console.error(err);
                    setIsListening(false);
                },
                inputLang
            );
        }
    };

    const handleInputKey = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                layout
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 p-4 bg-violet-600 hover:bg-violet-700 text-white rounded-full shadow-lg z-50 flex items-center justify-center transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
                    >
                        {/* Header */}
                        <div className="p-4 bg-violet-600 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <span className="text-xl">🤖</span>
                                </div>
                                <div>
                                    <h3 className="font-bold">Gati Sahayak</h3>
                                    <p className="text-xs text-violet-200">AI Assistant</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${msg.sender === 'user'
                                            ? 'bg-violet-600 text-white rounded-br-none'
                                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-sm'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isThinking && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl rounded-bl-none border border-slate-200 dark:border-slate-700">
                                        <span className="animate-pulse text-slate-400">Thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                            <select
                                value={inputLang}
                                onChange={(e) => setInputLang(e.target.value as 'en' | 'kn' | 'hi')}
                                className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-2 py-1 text-xs text-slate-600 dark:text-slate-300 focus:ring-1 focus:ring-violet-500 outline-none cursor-pointer"
                            >
                                <option value="en">EN</option>
                                <option value="kn">KN</option>
                                <option value="hi">HI</option>
                            </select>
                            <button
                                onClick={toggleMic}
                                className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                                    }`}
                            >
                                <Mic className="w-5 h-5" />
                            </button>
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleInputKey}
                                placeholder="Ask about buses..."
                                className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-full px-4 py-2 text-sm focus:ring-1 focus:ring-violet-500 outline-none text-slate-800 dark:text-slate-100"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputText.trim()}
                                className="p-2 bg-violet-600 text-white rounded-full hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AssistantWidget;
