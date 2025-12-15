import React, { useState } from 'react';
import { useLanguage } from '../hooks/useAppLanguage';
import { Phone, MessageSquare, Smartphone, ChevronRight, RefreshCw, Grip } from 'lucide-react';
import { busService } from '../api/busService';
import { motion, AnimatePresence } from 'framer-motion';

const IvrDemo: React.FC = () => {
    const { t, language } = useLanguage();

    // State Machine
    const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0); // 0:Phone, 1:Lang, 2:Bus, 3:Process, 4:Result
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedLang, setSelectedLang] = useState<'en' | 'kn' | 'hi'>('en');
    const [busNo, setBusNo] = useState('');
    const [resultMessage, setResultMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Number translation helper
    const toNativeDigits = (num: string | number) => {
        const str = num.toString();
        if (language === 'kn') {
            const knDigits = ['೦', '೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯'];
            return str.replace(/[0-9]/g, (d) => knDigits[parseInt(d)]);
        }
        if (language === 'hi') {
            const hiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
            return str.replace(/[0-9]/g, (d) => hiDigits[parseInt(d)]);
        }
        return str;
    };

    const parseNativeDigits = (str: string) => {
        return str
            .replace(/[೦-೯]/g, d => String('೦೧೨೩೪೫೬೭೮೯'.indexOf(d)))
            .replace(/[०-९]/g, d => String('०१२३४५६७८९'.indexOf(d)))
            .replace(/\D/g, '');
    };

    // Reset Flow
    const reset = () => {
        setStep(0);
        setPhoneNumber('');
        setBusNo('');
        setResultMessage(null);
        setError(null);
    };

    // Step 0: Phone Input
    const submitPhone = () => {
        if (phoneNumber.length === 10) {
            playSound('beep');
            setStep(1);
        }
    };

    // Step 1: Language Selection
    const selectLanguage = (lang: 'en' | 'kn' | 'hi') => {
        setSelectedLang(lang);
        playSound('beep');
        setStep(2);
    };

    // Step 2: Bus Input
    const handleBusInput = (val: string) => {
        if (busNo.length < 5) {
            setBusNo(prev => prev + val);
            playSound('dtmf');
        }
    };

    const backspace = () => {
        setBusNo(prev => prev.slice(0, -1));
    };

    const submitBusNo = async () => {
        if (!busNo) return;
        playSound('beep');
        setStep(3); // Processing

        try {
            // Artificial delay for "IVR Thinking" feel
            await new Promise(r => setTimeout(r, 1500));

            // Call Real Backend to Send SMS
            const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
            const response = await busService.sendSimulatedSms(formattedPhone, busNo, selectedLang);

            if (response && response.status === 'sent') {
                setResultMessage(response.message);
                setStep(4); // Show Result
            } else {
                setError(response?.message || "Bus not found / Error sending SMS");
                setStep(4);
            }

        } catch (e) {
            setError("System Error");
            setStep(4);
        }
    };

    // Simulated Audio
    const playSound = (type: 'beep' | 'dtmf') => {
        // Visual feedback is enough for this version
    };

    return (
        <div className="page-container flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-start md:items-center">

                {/* Left Side: Explainer */}
                <div className="space-y-6">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider">
                        <Smartphone className="w-3 h-3 mr-2" />
                        IVR Simulator
                    </div>
                    <h1 className="text-4xl font-bold text-primary leading-tight">
                        {t.ivr.title}
                    </h1>
                    <p className="text-secondary text-lg leading-relaxed">
                        {t.ivr.subtitle}
                    </p>

                    <div className="space-y-4 pt-4">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 text-accent">
                                <Grip className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-primary text-lg">{t.ivr.interactiveMenu?.title}</h4>
                                <p className="text-secondary">{t.ivr.interactiveMenu?.desc}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 text-green-500">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-primary text-lg">{t.ivr.realSms?.title}</h4>
                                <p className="text-secondary">{t.ivr.realSms?.desc}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: IVR Simulation Interface */}
                <div className="relative mx-auto w-full max-w-[360px] bg-slate-900 rounded-[3rem] p-6 shadow-2xl border-4 border-slate-800">
                    {/* Phone Notch/Speaker */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-10"></div>

                    {/* Screen Content */}
                    <div className="bg-white dark:bg-slate-950 h-[640px] rounded-[2rem] overflow-hidden flex flex-col relative">

                        {/* Status Bar */}
                        <div className="h-8 bg-slate-100 dark:bg-slate-900 flex items-center justify-between px-6 text-[10px] text-slate-500 font-medium">
                            <span>{toNativeDigits("09:41")}</span>
                            <div className="flex gap-1">
                                <span className="w-3 h-3 bg-slate-300 rounded-full"></span>
                                <span className="w-3 h-3 bg-slate-300 rounded-full"></span>
                                <span className="w-3 h-3 bg-slate-800 dark:bg-slate-500 rounded-full"></span>
                            </div>
                        </div>

                        {/* Main Call UI */}
                        <div className="flex-grow flex flex-col p-6 relative">

                            {/* Header: Ongoing Call */}
                            <div className="text-center mb-8 mt-4">
                                <div className="w-16 h-16 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                                    <Phone className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.appTitle} IVR</h3>
                                <p className="text-sm text-slate-500">Live Simulation</p>
                            </div>

                            {/* Content Area */}
                            <div className="flex-grow flex flex-col justify-center">
                                <AnimatePresence mode="wait">

                                    {/* Step 0: Phone Number Input */}
                                    {step === 0 && (
                                        <motion.div
                                            key="step0"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="space-y-6"
                                        >
                                            <div className="text-center">
                                                <p className="text-slate-600 dark:text-slate-300 text-sm mb-2 font-medium">
                                                    {t.ivr.enterMobile}
                                                </p>
                                                <div className="flex items-center justify-center gap-2 mb-4">
                                                    <span className="text-xl font-bold text-slate-400">+91</span>
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        value={toNativeDigits(phoneNumber)}
                                                        onChange={(e) => {
                                                            const val = parseNativeDigits(e.target.value).slice(0, 10);
                                                            setPhoneNumber(val);
                                                        }}
                                                        placeholder={toNativeDigits("9999988888")}
                                                        className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-2xl font-mono tracking-widest text-center w-48 border-b-2 border-accent focus:outline-none"
                                                        autoFocus
                                                    />
                                                </div>
                                                <button
                                                    onClick={submitPhone}
                                                    disabled={phoneNumber.length !== 10}
                                                    className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-900/20"
                                                >
                                                    {t.ivr.startCallButton} <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 1: Language */}
                                    {step === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="space-y-4"
                                        >
                                            <p className="text-center text-slate-600 dark:text-slate-300 font-medium mb-4">
                                                {t.ivr.selectLanguage}
                                            </p>
                                            <button onClick={() => selectLanguage('en')} className="w-full p-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl flex items-center justify-between transition-colors">
                                                <span className="font-bold text-slate-700 dark:text-slate-200">{t.ivr.languages.en}</span>
                                            </button>
                                            <button onClick={() => selectLanguage('kn')} className="w-full p-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl flex items-center justify-between transition-colors">
                                                <span className="font-bold text-slate-700 dark:text-slate-200">{t.ivr.languages.kn}</span>
                                            </button>
                                            <button onClick={() => selectLanguage('hi')} className="w-full p-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl flex items-center justify-between transition-colors">
                                                <span className="font-bold text-slate-700 dark:text-slate-200">{t.ivr.languages.hi}</span>
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* Step 2: Bus Input */}
                                    {step === 2 && (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <div className="text-center">
                                                <p className="text-slate-600 dark:text-slate-300 text-sm mb-2">
                                                    {t.ivr.busInput.label}
                                                </p>
                                                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-3xl font-mono tracking-widest text-center border-b-2 border-accent h-16 flex items-center justify-center">
                                                    {toNativeDigits(busNo) || <span className="animate-pulse text-slate-400">_ _ _</span>}
                                                </div>
                                            </div>

                                            {/* Numeric Keypad */}
                                            <div className="grid grid-cols-3 gap-3">
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                                                    <button key={n} onClick={() => handleBusInput(n.toString())} className="h-12 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 font-bold text-xl flex items-center justify-center">
                                                        {toNativeDigits(n)}
                                                    </button>
                                                ))}
                                                <button onClick={backspace} className="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center font-bold text-sm text-slate-600 dark:text-slate-300">DEL</button>
                                                <button onClick={() => handleBusInput('0')} className="h-12 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 font-bold text-xl flex items-center justify-center">
                                                    {toNativeDigits(0)}
                                                </button>
                                                <button onClick={submitBusNo} className="h-12 bg-accent text-white rounded-lg flex items-center justify-center shadow-lg shadow-accent/20">
                                                    <ChevronRight className="w-6 h-6" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 3: Processing */}
                                    {step === 3 && (
                                        <motion.div
                                            key="step3"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex flex-col items-center justify-center space-y-6"
                                        >
                                            <div className="w-16 h-16 border-4 border-slate-200 border-t-accent rounded-full animate-spin"></div>
                                            <p className="text-slate-500 text-sm animate-pulse">
                                                {t.ivr.status.sendingSms}
                                            </p>
                                        </motion.div>
                                    )}

                                    {/* Step 4: Result */}
                                    {step === 4 && (
                                        <motion.div
                                            key="step4"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="space-y-4"
                                        >
                                            {error ? (
                                                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-100">
                                                    <p className="font-bold">{error}</p>
                                                </div>
                                            ) : (
                                                <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-100">
                                                    <div className="w-12 h-12 bg-green-500 rounded-full text-white mx-auto mb-4 flex items-center justify-center shadow-lg shadow-green-200">
                                                        <MessageSquare className="w-6 h-6" />
                                                    </div>
                                                    <h4 className="text-green-800 font-bold mb-2">{t.ivr.status.messageSent}</h4>
                                                    <p className="text-sm text-green-700 mb-4">
                                                        {t.ivr.status.sentDetail} <br />
                                                        <span className="font-mono bg-white/50 px-2 rounded">+91 {toNativeDigits(phoneNumber)}</span>
                                                    </p>

                                                    {/* Message Body Preview */}
                                                    <div className="bg-white p-3 rounded-lg text-left text-xs text-slate-600 border border-slate-100 shadow-sm font-mono">
                                                        {resultMessage}
                                                    </div>
                                                </div>
                                            )}

                                            <button
                                                onClick={reset}
                                                className="w-full py-3 mt-8 flex items-center justify-center gap-2 text-primary font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                            >
                                                <RefreshCw className="w-4 h-4" /> {t.ivr.status.restart}
                                            </button>
                                        </motion.div>
                                    )}

                                </AnimatePresence>
                            </div>

                        </div>

                        {/* Bottom Nav Bar (Decoration) */}
                        <div className="h-1 bg-slate-100 dark:bg-slate-900 mx-auto w-1/3 rounded-full mb-2"></div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default IvrDemo;
