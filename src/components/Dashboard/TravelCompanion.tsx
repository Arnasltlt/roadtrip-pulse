import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Navigation, Search, ChevronUp, ChevronDown } from 'lucide-react';
import type { AgentStatus } from '../../services/TripAgent';
import { useState, useEffect } from 'react';

interface TravelCompanionProps {
    status: AgentStatus;
    isSearching: boolean;
    onSearch: () => void;
}

export function TravelCompanion({ status, isSearching, onSearch }: TravelCompanionProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Auto-expand when stopped
    useEffect(() => {
        if (status.state === 'STOPPED') {
            setIsExpanded(true);
        }
    }, [status.state]);

    // Determine icon based on state
    const getIcon = () => {
        if (isSearching) return <Sparkles className="w-5 h-5 text-white animate-pulse" />;
        switch (status.state) {
            case 'DRIVING': return <Navigation className="w-5 h-5 text-white" />;
            case 'STOPPED': return <MapPin className="w-5 h-5 text-white" />;
            default: return <Sparkles className="w-5 h-5 text-white" />;
        }
    };

    const getBgColor = () => {
        if (isSearching) return 'bg-explorer-teal-500';
        switch (status.state) {
            case 'DRIVING': return 'bg-explorer-teal-600';
            case 'STOPPED': return 'bg-explorer-orange-500';
            default: return 'bg-explorer-teal-500';
        }
    };

    return (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[900] pointer-events-none flex justify-center w-full max-w-md px-4">
            <AnimatePresence mode="wait">
                <motion.div
                    key={status.message}
                    initial={{ y: -50, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -20, opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="pointer-events-auto w-full"
                >
                    <div
                        className={`glass-panel rounded-3xl shadow-2xl border border-white/40 bg-white/80 backdrop-blur-xl transition-all duration-300 overflow-hidden ${isExpanded ? 'p-5' : 'p-2'}`}
                    >
                        <div className="flex items-center gap-4">
                            {/* Icon / Status Indicator */}
                            <div className="relative">
                                {isSearching && (
                                    <>
                                        <span className="absolute inset-0 rounded-full bg-explorer-teal-400 opacity-75 animate-ping"></span>
                                        <span className="absolute inset-0 rounded-full bg-explorer-teal-400 opacity-50 animate-pulse delay-75"></span>
                                    </>
                                )}
                                <div
                                    className={`relative flex items-center justify-center ${getBgColor()} rounded-full shadow-lg shrink-0 transition-all duration-500 cursor-pointer z-10 ${isExpanded ? 'w-12 h-12' : 'w-10 h-10'}`}
                                    onClick={() => setIsExpanded(!isExpanded)}
                                >
                                    {getIcon()}
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                                {isExpanded ? (
                                    <div className="pt-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="text-xs font-bold text-explorer-slate-900 uppercase tracking-wider flex items-center gap-2">
                                                {isSearching ? 'Scanning' : 'Trip Companion'}
                                            </h3>
                                            <span className="text-[10px] font-bold text-explorer-slate-500 bg-white/60 px-2 py-0.5 rounded-full uppercase tracking-wide border border-white/50">
                                                {status.mood}
                                            </span>
                                        </div>
                                        <p className="text-explorer-slate-800 text-base font-medium leading-snug">
                                            {isSearching ? "Looking for the perfect playground nearby..." : status.message}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <p className="text-explorer-slate-800 text-sm font-medium truncate pr-2">
                                            {isSearching ? "Scanning..." : status.message}
                                        </p>
                                        <ChevronDown className="w-4 h-4 text-explorer-slate-400" />
                                    </div>
                                )}
                            </div>

                            {/* Collapse Toggle (only visible when expanded) */}
                            {isExpanded && (
                                <button
                                    onClick={() => setIsExpanded(false)}
                                    className="p-1 hover:bg-black/5 rounded-full transition-colors self-start -mt-1 -mr-1"
                                >
                                    <ChevronUp className="w-4 h-4 text-explorer-slate-400" />
                                </button>
                            )}
                        </div>

                        {/* Contextual Action Hints (Only when expanded) */}
                        <AnimatePresence>
                            {isExpanded && status.state === 'STOPPED' && !isSearching && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                    animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <button
                                        onClick={onSearch}
                                        className="group w-full flex items-center justify-center gap-2 bg-explorer-orange-500 text-white px-4 py-3 rounded-xl font-bold shadow-lg shadow-explorer-orange-500/20 hover:bg-explorer-orange-600 hover:shadow-explorer-orange-500/30 hover:-translate-y-0.5 transition-all active:translate-y-0 active:shadow-none"
                                    >
                                        <Search className="w-4 h-4" />
                                        Find Nearby Fun
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
