import React, { useState } from 'react';
import { useLanguage } from '../hooks/useAppLanguage';
import { Phone, MessageSquare, CheckCircle, Smartphone } from 'lucide-react';
import { sendSms } from '../api/sms';

const IvrDemo: React.FC = () => {
    const { t } = useLanguage();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const handleSimulateCall = async () => {
        if (!phoneNumber) return;
        setStatus('sending');
        try {
            const success = await sendSms(phoneNumber);
            if (success) {
                setStatus('sent');
            } else {
                setStatus('error');
            }
        } catch (e) {
            setStatus('error');
        }
    };

    return (
        <div className="page-container flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Left Side: Explainer */}
                <div className="space-y-6">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider">
                        <Smartphone className="w-3 h-3 mr-2" />
                        {t.ivr.badge}
                    </div>
                    <h1 className="text-4xl font-bold text-primary leading-tight">
                        {t.ivr.title}
                    </h1>
                    <p className="text-secondary text-lg leading-relaxed">
                        {t.ivr.instruction}
                    </p>

                    <div className="space-y-4 pt-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-secondary">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-primary">{t.ivr.steps.dial.title}</h4>
                                <p className="text-sm text-secondary">{t.ivr.steps.dial.desc}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-secondary">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-primary">{t.ivr.steps.sms.title}</h4>
                                <p className="text-sm text-secondary">{t.ivr.steps.sms.desc}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Interactive Demo Card */}
                <div className="bg-white dark:bg-surface p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-clean-lg space-y-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-primary">{t.ivr.demoTitle}</h2>
                        <p className="text-sm text-secondary mt-2">{t.ivr.demoDesc}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-secondary uppercase tracking-wide">{t.ivr.phoneLabel}</label>
                            <input
                                type="tel"
                                placeholder="+91 98765 43210"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full px-4 py-2 bg-surface border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200 text-primary placeholder:text-secondary"
                            />
                        </div>

                        <button
                            onClick={handleSimulateCall}
                            disabled={status === 'sending' || !phoneNumber}
                            className={`w-full py-3 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 ${status === 'sent'
                                ? 'bg-green-600 text-white shadow-sm'
                                : 'bg-primary text-white dark:text-background hover:opacity-90 shadow-sm'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {status === 'sending' ? (
                                <span className="animate-pulse">{t.ivr.status.processing}</span>
                            ) : status === 'sent' ? (
                                <>
                                    <CheckCircle className="w-5 h-5" /> {t.ivr.status.success}
                                </>
                            ) : (
                                <>
                                    <Phone className="w-4 h-4" /> {t.ivr.simulateBtn}
                                </>
                            )}
                        </button>

                        {status === 'sent' && (
                            <p className="text-center text-xs text-green-600 mt-2 font-medium">
                                {t.ivr.status.sentTo} {phoneNumber}
                            </p>
                        )}
                        {status === 'error' && (
                            <p className="text-center text-xs text-red-500 mt-2 font-medium">
                                {t.ivr.status.error}
                            </p>
                        )}
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-secondary text-center">
                            {t.ivr.note}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default IvrDemo;
