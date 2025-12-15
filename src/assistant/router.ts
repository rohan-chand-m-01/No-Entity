import { assistantService } from './assistant';

export interface AssistantResponse {
    text: string;
    lang: 'en' | 'kn' | 'hi';
    isVoice?: boolean;
}

// 3. Cache for context-aware questions
let lastSearchResults: any[] = [];

export const assistantRouter = {
    async processMessage(userText: string): Promise<AssistantResponse> {
        // 1. Send to Assistant (Gemini/RapidAPI/Offline)
        const aiResponse = await assistantService.sendMessage(userText);

        // 2. Check if Command
        if (aiResponse.command) {
            const cmd = aiResponse.command;

            if (cmd.type === 'SEARCH') {
                return await handleSearch(cmd.source, cmd.destination, aiResponse.lang);
            }

            if (cmd.type === 'GET_FASTEST') {
                return handleFastestQuery(aiResponse.lang);
            }

            if (cmd.type === 'BUS_INFO') {
                return { text: "Tracking specific bus functionality coming soon!", lang: 'en' };
            }
        }

        // 3. If no command, return conversation
        return {
            text: aiResponse.text,
            lang: aiResponse.lang || 'en'
        };
    }
};

async function handleSearch(source: string, destination?: string, lang: 'en' | 'kn' | 'hi' = 'en'): Promise<AssistantResponse> {
    try {
        const url = new URL(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/search`);
        url.searchParams.append('source', source);
        if (destination) url.searchParams.append('destination', destination);

        const res = await fetch(url.toString());
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
            // CACHE RESULTS
            lastSearchResults = data;


            // Helper for city localization
            const CITY_NAMES: any = {
                "Ramanagara": { kn: "ರಾಮನಗರ", hi: "रामनागरा" },
                "Bangalore": { kn: "ಬೆಂಗಳೂರು", hi: "बंगलौर" },
                "Bidadi": { kn: "ಬಿಡದಿ", hi: "बिदादी" },
                "Kengeri": { kn: "ಕೆಂಗೇರಿ", hi: "केंगेरी" },
                "Channapatna": { kn: "ಚನ್ನಪಟ್ಟಣ", hi: "चन्नपटना" },
                "Mysore": { kn: "ಮೈಸೂರು", hi: "मैसूर" }
            };

            const loc = (name: string, lang: string) => {
                if (CITY_NAMES[name] && CITY_NAMES[name][lang]) {
                    return CITY_NAMES[name][lang];
                }
                return name;
            };

            // Helper for Number/Text localization
            const toNative = (text: string, lang: 'en' | 'kn' | 'hi') => {
                if (lang === 'en') return text;

                let out = text;
                // 1. Digits
                const knDigits = ['೦', '೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯'];
                const hiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
                const digits = lang === 'kn' ? knDigits : hiDigits;

                out = out.replace(/[0-9]/g, (d) => digits[parseInt(d)]);

                // 2. Common Prefixes (KA)
                if (lang === 'kn') {
                    out = out.replace(/KA/g, "ಕೆಎ"); // Phonetic
                    out = out.replace(/F/g, "ಎಫ್");
                } else if (lang === 'hi') {
                    out = out.replace(/KA/g, "केए");
                }

                return out;
            };

            // Format response
            const busList = data.slice(0, 3).map((b: any) => {
                const busNo = toNative(b.busNo, lang);
                const etaVal = b.eta ? b.eta : 'Live';
                const etaStr = toNative(etaVal.toString(), lang);
                const minStr = lang === 'kn' ? 'ನಿ' : (lang === 'hi' ? 'मिन' : 'm');

                return `${busNo} (${etaStr}${minStr})`;
            }).join(', ');

            // Localized Success Message
            let text = `Found ${data.length} buses from ${source}${destination ? ' to ' + destination : ''}. Next: ${busList}.`;
            if (lang === 'kn') {
                const srcKn = loc(source, 'kn');
                const dstKn = destination ? loc(destination, 'kn') : '';
                // "busgalu" -> "ಬಸ್‌ಗಳು"
                text = `${srcKn} ಇಂದ ${dstKn} ಗೆ ${toNative(data.length.toString(), 'kn')} ಬಸ್‌ಗಳಿವೆ. ಮುಂದಿನ ಬಸ್‌ಗಳು: ${busList}.`;
            } else if (lang === 'hi') {
                const srcHi = loc(source, 'hi');
                const dstHi = destination ? loc(destination, 'hi') : '';
                text = `${srcHi} से ${dstHi} तक ${toNative(data.length.toString(), 'hi')} बसें उपलब्ध हैं। अगली बसें: ${busList}.`;
            }

            return { text, lang };
        } else {
            lastSearchResults = [];

            // Localized Empty Message
            let text = `Sorry, I couldn't find any buses from ${source} at the moment.`;
            if (lang === 'kn') {
                text = `Kshamisi, ${source} inda yavude bus sigalilla.`;
            } else if (lang === 'hi') {
                text = `Maaf karein, ${source} se koi bus nahi mili.`;
            }

            return { text, lang };
        }
    } catch (e) {
        console.error("Search failed", e);
        return { text: "I had trouble checking the bus schedule.", lang: 'en' };
    }
}

function handleFastestQuery(lang: 'en' | 'kn' | 'hi' = 'en'): AssistantResponse {
    if (!lastSearchResults || lastSearchResults.length === 0) {
        let text = "I don't have any recent bus search results to check. Please search for a route first!";
        if (lang === 'kn') text = "Nanage yavude hosa bus mahiti illa. Daya madi modalu route huduki.";
        if (lang === 'hi') text = "Mere paas koi haal ki bus jankari nahi hai. Kripya pehle route search karein.";
        return { text, lang };
    }

    // Sort by ETA
    const sorted = [...lastSearchResults].sort((a, b) => (a.eta || 999) - (b.eta || 999));
    const best = sorted[0];

    let text = `The bus coming first is ${best.busNo} (${best.routeName}). It will arrive in about ${best.eta} minutes!`;
    if (lang === 'kn') {
        text = `Modala bus ${best.busNo} (${best.routeName}). Idu sumaru ${best.eta} nishadalli barutthade!`;
    } else if (lang === 'hi') {
        text = `Sabse pehli bus ${best.busNo} (${best.routeName}) hai. Yeh lagbhag ${best.eta} minute mein aayegi!`;
    }

    return { text, lang };
}
