import React, { useState, useEffect } from 'react';
import MapView from '../components/MapView';
import { useLanguage } from '../hooks/useAppLanguage';
import { Search, Navigation } from 'lucide-react';
import { busService } from '../api/busService';
import type { Bus } from '../api/busService';

const LiveTracking: React.FC = () => {
    const { t } = useLanguage();
    const [selectedBusNo, setSelectedBusNo] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [buses, setBuses] = useState<Bus[]>([]);

    // Fetch buses periodically
    useEffect(() => {
        const fetchBuses = async () => {
            const data = await busService.getAllBuses();
            setBuses(data);
        };

        fetchBuses(); // Initial fetch
        const interval = setInterval(fetchBuses, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const activeBus = selectedBusNo ? buses.find(b => b.busNo === selectedBusNo) : null;

    // Filter buses based on search
    const filteredBuses = buses.filter(bus =>
        bus.busNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bus.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bus.stops && bus.stops.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    // Helper to map backend data to UI
    const getAreaName = (bus: Bus) => {
        if (bus.stops && bus.stops[bus.nextStopIndex]) {
            return `Next: ${bus.stops[bus.nextStopIndex].name}`;
        }
        return bus.routeName;
    };

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
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-accent transition-colors text-primary"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filteredBuses.length > 0 ? (
                            filteredBuses.map((bus) => (
                                <div
                                    key={bus.busNo}
                                    onClick={() => setSelectedBusNo(bus.busNo)}
                                    className={`p-4 border-b border-slate-50 dark:border-slate-800 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${selectedBusNo === bus.busNo ? 'bg-accent/10 border-l-4 border-l-accent' : 'border-l-4 border-l-transparent'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-primary flex items-center gap-2">
                                                {bus.busNo}
                                                <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold bg-green-100 text-green-700">
                                                    Live
                                                </span>
                                            </h3>
                                            <p className="text-xs text-secondary mt-1 flex items-center gap-1">
                                                <Navigation className="w-3 h-3" /> {getAreaName(bus)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-lg font-bold text-accent">{bus.eta} <span className="text-xs font-normal text-secondary">{t.tracking.minutes}</span></span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-secondary">
                                <p>No buses found matching "{searchQuery}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 bg-white dark:bg-surface rounded-xl border border-slate-200 dark:border-slate-800 shadow-clean overflow-hidden relative">
                <MapView
                    markers={
                        activeBus
                            ? [{
                                id: activeBus.busNo,
                                lat: activeBus.lat,
                                lng: activeBus.lng,
                                popupContent: `${activeBus.busNo} - ${getAreaName(activeBus)}`
                            }]
                            : buses.map(b => ({
                                id: b.busNo,
                                lat: b.lat,
                                lng: b.lng,
                                popupContent: `${b.busNo} - ${getAreaName(b)}`
                            }))
                    }
                    center={activeBus ? [activeBus.lat, activeBus.lng] : undefined}
                />

                {/* Floating status card if bus selected */}
                {activeBus ? (
                    <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-white dark:bg-surface p-4 rounded-lg shadow-clean-lg border border-slate-200 dark:border-slate-800 z-[1000]">
                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-2 mb-2">
                            <h4 className="font-bold text-primary">{t.tracking.liveStatus} {activeBus.busNo}</h4>
                            <button
                                onClick={(e) => { e.stopPropagation(); setSelectedBusNo(null); }}
                                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded"
                            >
                                Clear
                            </button>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-secondary">{t.tracking.location}</span>
                                <span className="font-medium text-primary text-right max-w-[60%] truncate">{getAreaName(activeBus)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-secondary">{t.tracking.eta}</span>
                                <span className="font-bold text-accent">{activeBus.eta} {t.tracking.minutes}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-secondary">Route</span>
                                <span className="font-medium text-primary text-right max-w-[60%] truncate">{activeBus.routeName}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 bg-white/90 backdrop-blur-sm dark:bg-surface/90 p-3 rounded-lg shadow-clean border border-slate-200 dark:border-slate-800 z-[1000] text-center">
                        <p className="text-sm font-medium text-secondary">Showing {buses.length} Active Buses. Select one to track.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveTracking;
