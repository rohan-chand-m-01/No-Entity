// Replaces GoogleGenerativeAI with generic OpenAI-compatible fetch for RapidAPI
const API_URL = "https://cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com/v1/chat/completions";
const API_HOST = "cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com";
const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY || "acf9f5f069mshdc0a762bd431e93p1cef3cjsn4c2f9ee3e0fc"; // Fallback or env

interface ChatMessage {
    role: "user" | "system" | "assistant";
    content: string;
}

// Dictionary for offline translation (Demo Routes)
const CITY_MAP: { [key: string]: string } = {
    "ರಾಮನಗರ": "Ramanagara",
    "ಬೆಂಗಳೂರು": "Bangalore",
    "ಬಿಡದಿ": "Bidadi",
    "ಕೆಂಗೇರಿ": "Kengeri",
    "ಚನ್ನಪಟ್ಟಣ": "Channapatna",
    "ಮೈಸೂರು": "Mysore",
    "रामनागरा": "Ramanagara",
    "बंगलौर": "Bangalore",
    "बिदादी": "Bidadi",
    "केंगेरी": "Kengeri",
    "चन्नपटना": "Channapatna",
    "मैसूर": "Mysore"
};

const translateCity = (city: string) => {
    const trimmed = city.trim();
    return CITY_MAP[trimmed] || trimmed; // Return mapped English or original
};

export class AssistantService {
    private history: ChatMessage[] = [];

    private systemPrompt = `You are a friendly, helpful AI bus conductor for 'LocalGati', a transport app in Karnataka. 
    Your name is 'Gati Sahayak'.
    
    Capabilities:
    1. Greeting: Detect time and tone. Be empathetic.
    2. Bus Search: If user asks for buses (e.g., 'From Bidadi to Kengeri'), output a structured SEARCH_COMMAND.
    3. Context: If user asks 'which is first', output GET_FASTEST.
    4. Language: If user speaks Kannada/Hindi, reply in that language.
    
    CRITICAL INSTRUCTION:
    If the user asks about bus routes, timing, or search, DO NOT try to answer based on your internal knowledge. 
    Instead, output ONLY a JSON command like this:
    { "type": "SEARCH", "source": "CityA", "destination": "CityB" }
    or
    { "type": "GET_FASTEST" }
    
    For normal conversation, just reply as text.
    Keep replies short and helpful. 
    `;

    constructor() {
        this.startNewChat();
    }

    startNewChat() {
        this.history = [
            { role: "system", content: this.systemPrompt }
        ];
    }

    async sendMessage(message: string): Promise<{ text: string, command?: any, lang?: 'en' | 'kn' | 'hi' }> {
        // Add user message to history
        this.history.push({ role: "user", content: message });

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-rapidapi-host": API_HOST,
                    "x-rapidapi-key": API_KEY
                },
                body: JSON.stringify({
                    messages: this.history, // Send full history or just recent? Full context is better but check token limits. 
                    // Let's send last 6 messages to save usage/tokens if needed, or all.
                    // For this 'cheapest' API, let's try sending all.
                    model: "gpt-4o",
                    max_tokens: 150,
                    temperature: 0.9
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`API Error ${response.status}: ${errText}`);
            }

            const data = await response.json();
            const replyContent = data.choices?.[0]?.message?.content || "";

            // Add bot reply to history
            this.history.push({ role: "assistant", content: replyContent });

            // Check for JSON command
            let command;
            try {
                const match = replyContent.match(/\{.*"type":.*\}/s);
                if (match) {
                    command = JSON.parse(match[0]);
                }
            } catch (e) { /* ignore */ }

            // Detect language
            let lang: 'en' | 'kn' | 'hi' = 'en';
            if (/[\u0900-\u097F]/.test(replyContent)) lang = 'hi';
            if (/[\u0C80-\u0CFF]/.test(replyContent)) lang = 'kn';

            return { text: replyContent, command, lang };

        } catch (error: any) {
            console.error("RapidAPI Error:", error);

            // FALLBACK LOGIC (Offline Mode)
            // If API fails, try to understand basic commands via Regex
            const lowerMsg = message.toLowerCase();

            // 1b. Kannada Search Pattern: "[City] inda [City]" ("ಇಂದ" = from)
            // Example: "ಚನ್ನಪಟ್ಟಣ ಇಂದ ರಾಮನಗರ"
            const kannadaMatch = message.match(/([^\s]+)\s+ಇಂದ\s+([^\s]+)/);
            if (kannadaMatch) {
                const source = translateCity(kannadaMatch[1]);
                const destination = translateCity(kannadaMatch[2]);
                console.log(`[Offline-KN] Translating: ${kannadaMatch[1]}->${source}, ${kannadaMatch[2]}->${destination}`);
                return {
                    text: `(Offline Mode) Searching for buses from ${source} to ${destination}...`,
                    command: { type: 'SEARCH', source: source, destination: destination },
                    lang: 'kn'
                };
            }

            // 1c. Hindi Search Pattern: "[City] se [City]" ("से" = from)
            const hindiMatch = message.match(/([^\s]+)\s+से\s+([^\s]+)/);
            if (hindiMatch) {
                const source = translateCity(hindiMatch[1]);
                const destination = translateCity(hindiMatch[2]);
                console.log(`[Offline-HI] Translating: ${hindiMatch[1]}->${source}, ${hindiMatch[2]}->${destination}`);
                return {
                    text: `(Offline Mode) Searching for buses from ${source} to ${destination}...`,
                    command: { type: 'SEARCH', source: source, destination: destination },
                    lang: 'hi'
                };
            }

            // 1a. English Search Pattern: "from [City A] to [City B]"
            // Updated regex to handle spaces in city names (e.g., "Kengeri TTMC")
            const searchMatch = lowerMsg.match(/from\s+([a-z\s]+?)\s+(?:to|and|-)\s+([a-z\s]+)/);

            if (searchMatch) {
                const source = searchMatch[1].trim();
                const destination = searchMatch[2].trim();

                // Capitalize words for display using a reliable method
                const toTitleCase = (str: string) => str.replace(/\b\w/g, c => c.toUpperCase());

                return {
                    text: `(Offline Mode) Searching for buses from ${toTitleCase(source)} to ${toTitleCase(destination)}...`,
                    command: { type: 'SEARCH', source: toTitleCase(source), destination: toTitleCase(destination) },
                    lang: 'en'
                };
            }

            // 2. Context Question Pattern: "which bus will come first", "fastest bus", "next bus"
            if (lowerMsg.match(/(which|what).*(first|fastest|early|earliest|start)|next bus/)) {
                return {
                    text: `(Offline Mode) Checking which bus is first...`,
                    command: { type: 'GET_FASTEST' },
                    lang: 'en'
                };
            }

            // 3. Greeting match
            if (lowerMsg.match(/\b(namaskara)\b/) || message.includes("ನಮಸ್ಕಾರ")) {
                return {
                    text: "ನಮಸ್ಕಾರ! ನಾನು ಗತಿ ಸಹಾಯಕ. ಬಸ್ ಮಾರ್ಗಗಳನ್ನು ಹುಡುಕಲು 'ಚನ್ನಪಟ್ಟಣ ಇಂದ ರಾಮನಗರ' ಎಂದು ಕೇಳಿ.",
                    lang: 'kn'
                };
            }
            if (lowerMsg.match(/\b(namaste)\b/) || message.includes("नमस्ते")) {
                return {
                    text: "नमस्ते! मैं गति सहायक हूँ। बस मार्ग खोजने के लिए 'बिदादी से केंगेरी' कहें।",
                    lang: 'hi'
                };
            }
            if (lowerMsg.match(/\b(hi|hello|hey|greetings|start)\b/)) {
                return { text: "Hello! I am Gati Sahayak. I can search buses for you. Just say 'From Kengeri to Bidadi'.", lang: 'en' };
            }

            // 4. Language Detection for Fallback
            // If user speaks Kannada (Unicode range \u0C80-\u0CFF)
            if (/[\u0C80-\u0CFF]/.test(message)) {
                return {
                    text: "ನಮಸ್ಕಾರ! ಬಸ್ ಹುಡುಕಲು, ದಯವಿಟ್ಟು '[ಊರು] ಇಂದ [ಊರು] ಗೆ' ಎಂದು ಕೇಳಿ. (ಉದಾಹರಣೆಗೆ: 'ಚನ್ನಪಟ್ಟಣ ಇಂದ ರಾಮನಗರ')",
                    lang: 'kn'
                };
            }
            // If user speaks Hindi (Unicode range \u0900-\u097F)
            if (/[\u0900-\u097F]/.test(message)) {
                return {
                    text: "नमस्ते! बस खोजने के लिए, कृपया '[स्थान] से [स्थान]' कहें। (उदाहरण: 'बिदादी से केंगेरी')",
                    lang: 'hi'
                };
            }

            // 5. Clean Failover Message (Default English)
            const reason = API_KEY ? "Connection Error" : "Missing API Key";
            return { text: `I'm currently Offline (${reason}). But I can still track buses! \n\nPlease tell me your route like this: \n'From [Source] to [Destination]'`, lang: 'en' };
        }
    }
}

export const assistantService = new AssistantService();

