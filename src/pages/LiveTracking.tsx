import React, { useState } from 'react';
import MapView from '../components/MapView';
import { useLanguage } from '../hooks/useAppLanguage';
import { Search, Navigation } from 'lucide-react';
import buses from '../data/buses.json';

const LiveTracking: React.FC = () => {
    const { t } = useLanguage();
    const [selectedBus, setSelectedBus] = useState<string | null>(null);

    const activeBus = selectedBus ? buses.find(b => b.busNo === selectedBus) : null;

    return (
        <div className="page-container h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-6">
            {/* Sidebar / List */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
                <div className="bg-white dark:bg-surface p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-clean">
                    <h2 className="text-xl font-bold text-primary mb-1">{t.nav.track}</h2>
                    <p className="text-sm text-secondary">{t.tracking.selectPrompt}</p>
                </div>

                <div className="bg-white dark:bg-surface rounded-xl border border-slate-200 dark:border-slate-800 shadow-clean flex-1 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
                            <input
                                type="text"
                                placeholder={t.tracking.placeholder}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-accent transition-colors text-primary"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {buses.map((bus) => (
                            <div
                                key={bus.busNo}
                                onClick={() => setSelectedBus(bus.busNo)}
                                className={`p-4 border-b border-slate-50 dark:border-slate-800 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${selectedBus === bus.busNo ? 'bg-accent/10 border-l-4 border-l-accent' : 'border-l-4 border-l-transparent'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-primary flex items-center gap-2">
                                            {bus.busNo}
                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold ${bus.status === 'On Time' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {(t.busStatus as any)[bus.status] || bus.status}
                                            </span>
                                        </h3>
                                        <p className="text-xs text-secondary mt-1 flex items-center gap-1">
                                            <Navigation className="w-3 h-3" /> {(t.locations as any)[bus.area] || bus.area}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-lg font-bold text-accent">{bus.eta} <span className="text-xs font-normal text-secondary">{t.tracking.minutes}</span></span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 bg-white dark:bg-surface rounded-xl border border-slate-200 dark:border-slate-800 shadow-clean overflow-hidden relative">
                <MapView
                    lat={activeBus?.lat || 12.9716}
                    lng={activeBus?.lng || 77.5946}
                    popup={activeBus ? t.liveTracking.popup.replace('{busNo}', activeBus.busNo).replace('{area}', (t.locations as any)[activeBus.area] || activeBus.area) : (t.locations as any)["Bengaluru"]}
                />
                {/* Floating status card if bus selected */}
                {activeBus && (
                    <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-white dark:bg-surface p-4 rounded-lg shadow-clean-lg border border-slate-200 dark:border-slate-800 z-[1000]">
                        <h4 className="font-bold text-primary border-b border-slate-100 dark:border-slate-700 pb-2 mb-2">{t.tracking.liveStatus} {activeBus.busNo}</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-secondary">{t.tracking.location}</span>
                                <span className="font-medium text-primary">{(t.locations as any)[activeBus.area] || activeBus.area}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-secondary">{t.tracking.eta}</span>
                                <span className="font-bold text-accent">{activeBus.eta} {t.tracking.minutes}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveTracking;
