import React, { useState } from 'react';
import ChatbotUI from '../components/ChatbotUI';
import { useLanguage } from '../hooks/useAppLanguage';
import { assistantRouter } from '../assistant/router';
import { voiceHandler } from '../assistant/voice';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const Chatbot: React.FC = () => {
    const { t } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hello! I'm Gati Sahayak. How can I help you today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = async (text: string) => {
        const newUserMsg: Message = {
            id: Date.now().toString(),
            text,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMsg]);
        setIsTyping(true);

        try {
            // Use the unified Assistant Router
            const response = await assistantRouter.processMessage(text);

            const newBotMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: response.text,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, newBotMsg]);

            // Auto-speak the response using shared handler
            voiceHandler.speak(response.text, response.lang);

        } catch (error) {
            console.error("Assistant Error:", error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "I'm having trouble connecting. Please try again.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="page-container max-w-2xl mx-auto">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-primary">{t.chat.title}</h1>
                <p className="text-secondary mt-2">{t.chat.description}</p>
            </div>
            <ChatbotUI messages={messages} onSendMessage={handleSendMessage} isTyping={isTyping} />
        </div>
    );
};

export default Chatbot;
