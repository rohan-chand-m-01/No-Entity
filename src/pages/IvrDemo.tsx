import React, { useState } from 'react';
import { useLanguage } from '../hooks/useAppLanguage';
import { ivrWelcome, ivrHandleKey } from '../api/ivr';
import { sendSms } from '../api/sms';
import { Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const IvrDemo: React.FC = () => {
    const { t } = useLanguage();
    const [callStatus, setCallStatus] = useState<'idle' | 'connected' | 'ended'>('idle');
    const [audioLog, setAudioLog] = useState<string[]>([]);
    const [sms, setSms] = useState<string | null>(null);
    const [keyInput, setKeyInput] = useState('1');

    const startCall = async () => {
        setCallStatus('connected');
        setSms(null);
        setAudioLog([]);
        const welcome = await ivrWelcome();
        setAudioLog([welcome]);
    };

    const handleKey = async () => {
        if (callStatus !== 'connected') return;

        // Simulate user pressing key
        setAudioLog(prev => [...prev, `[User Pressed]: ${keyInput}`]);

        const response = await ivrHandleKey(keyInput);
        setAudioLog(prev => [...prev, response]);

        // Send SMS as well
        await sendSms(response);
        setSms(response); // Show on simulated phone

        setTimeout(() => {
            setCallStatus('ended');
        }, 2000);
    };

    return (
        <div className="page-container">
            <h1 className="text-3xl font-bold text-center mb-8">{t.ivr.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* Simulation Controls */}
                <div className="space-y-6">
                    <div className="glass-card p-6 border-t-4 border-teal-500">
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <Phone className="w-5 h-5 mr-2 text-teal-600" />
                            Call Simulator
                        </h2>

                        <div className="space-y-4">
                            {callStatus === 'idle' || callStatus === 'ended' ? (
                                <button
                                    onClick={startCall}
                                    className="w-full py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition font-semibold shadow-lg shadow-teal-200"
                                >
                                    {callStatus === 'ended' ? 'Call Again' : 'Call 1800-BUS-TRACK'}
                                </button>
                            ) : (
                                <div className="space-y-4">
                                    <div className="p-4 bg-teal-50 rounded-xl border border-teal-100 animate-pulse">
                                        <p className="text-teal-800 font-medium text-center">Connected...</p>
                                    </div>

                                    <div className="flex space-x-2">
                                        <select
                                            value={keyInput}
                                            onChange={(e) => setKeyInput(e.target.value)}
                                            className="flex-1 px-4 py-2 border border-slate-200 rounded-xl"
                                        >
                                            <option value="1">Press 1 (ETA)</option>
                                            <option value="2">Press 2 (Location)</option>
                                            <option value="3">Press 3 (Invalid)</option>
                                        </select>
                                        <button
                                            onClick={handleKey}
                                            className="px-6 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-900"
                                        >
                                            Press
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Audio Log */}
                    <div className="glass-card p-6 min-h-[200px]">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Audio Transcript</h3>
                        <div className="space-y-2 text-sm text-slate-700 font-mono">
                            {audioLog.map((log, i) => (
                                <motion.p
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    {log.startsWith('[') ? <span className="text-slate-400">{log}</span> : <span className="text-teal-700">IVR: {log}</span>}
                                </motion.p>
                            ))}
                            {audioLog.length === 0 && <p className="text-slate-400 italic">No active call.</p>}
                        </div>
                    </div>
                </div>

                {/* Mobile SMS View */}
                <div className="flex justify-center">
                    <div className="relative w-[300px] h-[600px] bg-slate-900 rounded-[3rem] shadow-2xl border-8 border-slate-800 p-4">
                        {/* Screen */}
                        <div className="w-full h-full bg-slate-50 rounded-[2rem] overflow-hidden flex flex-col relative">
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-slate-800 rounded-b-xl z-10"></div>

                            {/* Status Bar */}
                            <div className="h-8 bg-slate-200 flex items-center justify-between px-6 text-[10px] text-slate-500 font-bold">
                                <span>9:41</span>
                                <span>5G</span>
                            </div>

                            {/* App Header */}
                            <div className="bg-white p-4 border-b border-slate-100 flex items-center space-x-3 mt-4">
                                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold">T</div>
                                <div>
                                    <p className="font-bold text-xs text-slate-800">TravelEasy</p>
                                    <p className="text-[10px] text-slate-400">Public Service</p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 p-4 space-y-4">
                                <AnimatePresence>
                                    {sms && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            className="bg-slate-200 rounded-xl rounded-tl-none p-3 shadow-sm max-w-[85%]"
                                        >
                                            <p className="text-xs text-slate-800 leading-relaxed">{sms}</p>
                                            <p className="text-[9px] text-slate-400 mt-1 text-right">Just now</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Input Area (Fake) */}
                            <div className="p-3 bg-white border-t border-slate-100">
                                <div className="h-8 bg-slate-100 rounded-full w-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IvrDemo;
