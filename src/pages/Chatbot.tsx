import React, { useState } from 'react';
import ChatbotUI from '../components/ChatbotUI';
import { useLanguage } from '../hooks/useAppLanguage';
import buses from '../data/buses.json';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
            text: t.chatbotResponses.greeting,
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const getMockResponse = (text: string): string => {
        const lowerText = text.toLowerCase();

        // 1. Check for specific bus numbers first
        const foundBus = buses.find(b => lowerText.includes(b.busNo.toLowerCase()));

        if (foundBus) {
            const area = (t.locations as any)[foundBus.area] || foundBus.area;
            if (lowerText.includes('where') || lowerText.includes('location')) {
                return t.chatbotResponses.location.replace('{busNo}', foundBus.busNo).replace('{area}', area);
            } else if (lowerText.includes('when') || lowerText.includes('time') || lowerText.includes('eta')) {
                return t.chatbotResponses.eta.replace('{busNo}', foundBus.busNo).replace('{eta}', foundBus.eta);
            } else {
                return t.chatbotResponses.fullStatus.replace('{busNo}', foundBus.busNo).replace('{area}', area).replace('{eta}', foundBus.eta);
            }
        }

        // 2. Check for greetings
        if (lowerText.match(/hello|hi|hey|greetings|namaste|vanakkam/)) {
            return t.chatbotResponses.greetingHelper;
        }

        // 3. Check if they asked about "bus" but didn't specify a valid one
        if (lowerText.includes('bus')) {
            const availableBuses = buses.map(b => b.busNo).join(', ');
            return t.chatbotResponses.unknownBus.replace('{available}', availableBuses);
        }

        // 4. Default fallback
        return t.chatbotResponses.fallback;
    };

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
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            // Only try API if key exists and looks plausible (basic length check)
            if (!apiKey || apiKey.length < 10) {
                throw new Error("No valid API key");
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            // Try flash first, then pro? No, keep it simple.
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
            You are a helpful assistant for a public transport tracking system called 'LocalGati'.
            You have access to the following real-time bus data:
            ${JSON.stringify(buses)}

            User Question: ${text}

            Please answer the user's question based on the bus data provided. 
            If the answer is not in the data, say you don't have that information.
            Keep your response concise and helpful.
            If the user asks about something unrelated to buses or the transport system, politely guide them back to the topic.
            `;

            const result = await model.generateContent(prompt);
            const response = result.response;
            const responseText = response.text();

            const newBotMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, newBotMsg]);
            setIsTyping(false);
        } catch (error) {
            console.warn("Gemini API failed or not configured, utilizing fallback logic.", error);

            // Fallback to mock logic
            // Simulate a small delay for "thinking" feel
            setTimeout(() => {
                const responseText = getMockResponse(text);
                const newBotMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    text: responseText,
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, newBotMsg]);
                setIsTyping(false);
            }, 500);
        }
    };

    // Correction: setIsTyping(false) in finally will act immediately after await throws.
    // But the setTimeout is async. So typing indicator will vanish, then message appears 500ms later.
    // That is acceptable, or I can refine it.
    // Refinement: Move setIsTyping(false) to inside success block and inside setTimeout.

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
