import { useState } from 'react';
import { Settings2, X, Play, Square, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DebugPanelProps {
    speed: number;
    setSpeed: (speed: number) => void;
    onInjectDemoData?: () => void;
}

export function DebugPanel({ speed, setSpeed, onInjectDemoData }: DebugPanelProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`absolute top-4 right-4 z-[2000] p-3 rounded-full shadow-lg transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'bg-white/90 text-explorer-slate-900 hover:bg-white'
                    }`}
            >
                <Settings2 className="w-6 h-6" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="absolute top-0 right-0 h-full z-[2000] w-80 bg-white/95 backdrop-blur-xl border-l border-white/20 shadow-2xl p-6"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-bold text-xl text-explorer-slate-900 flex items-center gap-2">
                                <Settings2 className="w-5 h-5 text-explorer-teal-600" />
                                Simulation
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-explorer-slate-100 rounded-full transition-colors text-explorer-slate-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-explorer-slate-700">Speed Control</label>
                                    <span className="text-xs font-mono bg-explorer-slate-100 px-2 py-1 rounded text-explorer-teal-600">
                                        {speed.toFixed(1)} m/s
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="30"
                                    step="0.5"
                                    value={speed}
                                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-explorer-slate-200 rounded-lg appearance-none cursor-pointer accent-explorer-teal-600"
                                />
                                <div className="flex justify-between text-xs text-explorer-slate-400 font-medium">
                                    <span>Stop</span>
                                    <span>Cruise</span>
                                    <span>Fast</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setSpeed(0)}
                                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${speed === 0
                                            ? 'bg-red-50 text-red-600 ring-2 ring-red-500/20'
                                            : 'bg-explorer-slate-50 text-explorer-slate-600 hover:bg-explorer-slate-100'
                                        }`}
                                >
                                    <Square className="w-4 h-4 fill-current" />
                                    Stop
                                </button>
                                <button
                                    onClick={() => setSpeed(20)}
                                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${speed > 0
                                            ? 'bg-explorer-teal-50 text-explorer-teal-600 ring-2 ring-explorer-teal-500/20'
                                            : 'bg-explorer-slate-50 text-explorer-slate-600 hover:bg-explorer-slate-100'
                                        }`}
                                >
                                    <Play className="w-4 h-4 fill-current" />
                                    Drive
                                </button>
                            </div>

                            {onInjectDemoData && (
                                <div className="pt-4 border-t border-explorer-slate-100">
                                    <button
                                        onClick={onInjectDemoData}
                                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium bg-explorer-orange-50 text-explorer-orange-600 hover:bg-explorer-orange-100 transition-colors"
                                    >
                                        <Database className="w-4 h-4" />
                                        Inject Demo Data
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
