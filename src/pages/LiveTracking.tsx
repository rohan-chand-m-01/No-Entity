import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useAppLanguage';
import MapView from '../components/MapView';
import { getBusStatus } from '../api/bus';
import type { Bus } from '../api/bus';
import { Search, Clock, MapPin, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LiveTracking: React.FC = () => {
    const { t } = useLanguage();
    const [busNo, setBusNo] = useState('189');
    const [loading, setLoading] = useState(false);
    const [busData, setBusData] = useState<Bus | null>(null);
    const [error, setError] = useState('');

    const fetchBus = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getBusStatus(busNo);
            if (data) {
                setBusData(data);
            } else {
                setError(t.tracking.notFound);
                setBusData(null);
            }
        } catch (err) {
            setError('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchBus();
        // Auto refresh every 30s
        const interval = setInterval(fetchBus, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="page-container space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">{t.tracking.title}</h1>
            </div>

            <div className="max-w-xl mx-auto flex space-x-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={busNo}
                        onChange={(e) => setBusNo(e.target.value)}
                        placeholder={t.tracking.placeholder}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 shadow-sm transition-all"
                    />
                    <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                </div>
                <button onClick={fetchBus} className="glass-button bg-violet-600 text-white hover:bg-violet-700">
                    {loading ? '...' : t.tracking.search}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
                {/* Info Card */}
                <div className="glass-card p-6 flex flex-col space-y-6 lg:col-span-1 border-t-4 border-t-violet-500">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex items-center justify-center"
                            >
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                            </motion.div>
                        ) : error ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col items-center justify-center text-red-500 space-y-2"
                            >
                                <AlertCircle className="w-10 h-10" />
                                <p>{error}</p>
                            </motion.div>
                        ) : busData ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-4xl font-black text-slate-800">{busData.busNo}</h2>
                                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase mt-2">
                                        {busData.status}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl">
                                        <Clock className="w-5 h-5 text-violet-500 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t.tracking.eta}</p>
                                            <p className="text-xl font-bold text-slate-800">{busData.eta} {t.tracking.minutes}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl">
                                        <MapPin className="w-5 h-5 text-pink-500 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t.tracking.location}</p>
                                            <p className="text-xl font-bold text-slate-800">{busData.area}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>

                {/* Map */}
                <div className="lg:col-span-2 h-full rounded-2xl overflow-hidden shadow-lg">
                    <MapView
                        lat={busData?.lat || 12.9716}
                        lng={busData?.lng || 77.5946}
                        popup={busData ? `Bus ${busData.busNo} - ${busData.area}` : "Bengaluru"}
                    />
                </div>
            </div>
        </div>
    );
};

export default LiveTracking;
