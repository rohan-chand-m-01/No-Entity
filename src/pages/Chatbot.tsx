import React, { useState } from 'react';
import ChatbotUI from '../components/ChatbotUI';
import { useLanguage } from '../hooks/useAppLanguage';
import buses from '../data/buses.json';

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
            text: "Hello! I help you track buses. Ask me 'Where is bus 189?'",
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

        // Simulate thinking
        setTimeout(() => {
            let responseText = "I'm sorry, I didn't understand. Try asking for a bus location.";
            const busMatch = text.match(/bus\s*(\S+)/i); // Matches "bus 189", "bus 335E"

            if (busMatch) {
                const busNo = busMatch[1];
                const bus = buses.find(b => b.busNo.toLowerCase() === busNo.toLowerCase());

                if (bus) {
                    if (text.toLowerCase().includes('where')) {
                        responseText = `Bus ${bus.busNo} is currently at ${bus.area}.`;
                    } else if (text.toLowerCase().includes('when') || text.toLowerCase().includes('time')) {
                        responseText = `Bus ${bus.busNo} will arrive in approximately ${bus.eta} minutes.`;
                    } else {
                        responseText = `Bus ${bus.busNo} is at ${bus.area} and arriving in ${bus.eta} mins.`;
                    }
                } else {
                    responseText = `I couldn't find information for bus ${busNo}. Please check the number.`;
                }
            }

            const newBotMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, newBotMsg]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <div className="page-container max-w-2xl mx-auto">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-slate-900">{t.chat.title}</h1>
                <p className="text-slate-500 mt-2">Ask questions about bus routes, timings, and locations.</p>
            </div>
            <ChatbotUI messages={messages} onSendMessage={handleSendMessage} isTyping={isTyping} />
        </div>
    );
};

export default Chatbot;
