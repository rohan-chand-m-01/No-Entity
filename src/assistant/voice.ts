// Basic types for Web Speech API
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    length: number;
}

interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: any) => void;
    onend: () => void;
}

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export class VoiceHandler {
    private recognition: SpeechRecognition | null = null;
    private synthesis: SpeechSynthesis;
    private isListening: boolean = false;

    constructor() {
        this.synthesis = window.speechSynthesis;

        // Initialize Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            if (this.recognition) {
                this.recognition.continuous = false;
                this.recognition.interimResults = false;
                this.recognition.lang = 'en-IN'; // Default
            }
        }
    }

    public speak(text: string, lang: 'en' | 'kn' | 'hi' = 'en') {
        this.synthesis.cancel(); // Stop previous
        const utterance = new SpeechSynthesisUtterance(text);

        // Map simplified lang code to BCP 47
        let voiceLang = 'en-IN';
        if (lang === 'kn') voiceLang = 'kn-IN';
        if (lang === 'hi') voiceLang = 'hi-IN';

        utterance.lang = voiceLang;

        // Try to find a specific voice for the language
        // Try to find a specific voice for the language
        const voices = this.synthesis.getVoices();

        // precise match -> loose match -> default
        let preferredVoice = voices.find(v => v.lang === voiceLang) ||
            voices.find(v => v.lang.startsWith(voiceLang.split('-')[0])) ||
            voices.find(v => v.name.includes('Google') && v.lang.includes(voiceLang.split('-')[0]));

        // FALLBACK CHAIN for Indian Languages
        if (!preferredVoice && (voiceLang === 'kn-IN' || voiceLang === 'hi-IN')) {
            console.warn(`Missing voice for ${voiceLang}, trying fallbacks...`);
            // 1. Try Hindi (often available and reads Kannada script okay)
            preferredVoice = voices.find(v => v.lang === 'hi-IN');

            // 2. Try Indian English (common baseline)
            if (!preferredVoice) {
                preferredVoice = voices.find(v => v.lang === 'en-IN');
            }

            // If we fell back, we might need to adjust the utterance lang so the browser doesn't reject it
            if (preferredVoice) {
                utterance.lang = preferredVoice.lang;
            }
        }

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        } else {
            console.warn(`No specific voice found for ${voiceLang}, relying on browser default.`);
            // Ensure we don't send a lang code the browser creates silence for
            utterance.lang = 'en-US';
        }

        this.synthesis.speak(utterance);
    }

    public startListening(
        onResult: (text: string) => void,
        onError: (err: any) => void,
        lang: 'en' | 'kn' | 'hi' = 'en'
    ) {
        if (!this.recognition) {
            onError("Speech recognition not supported");
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
        }

        // Map lang
        let voiceLang = 'en-IN';
        if (lang === 'kn') voiceLang = 'kn-IN';
        if (lang === 'hi') voiceLang = 'hi-IN';

        this.recognition.lang = voiceLang;

        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
            const text = event.results[0][0].transcript;
            onResult(text);
            this.isListening = false;
        };

        this.recognition.onerror = (event: any) => {
            onError(event.error);
            this.isListening = false;
        };

        this.recognition.onend = () => {
            this.isListening = false;
        };

        try {
            this.recognition.start();
            this.isListening = true;
        } catch (e) {
            console.error("Failed to start recognition", e);
            this.isListening = false;
        }
    }

    public stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    }
}

export const voiceHandler = new VoiceHandler();
