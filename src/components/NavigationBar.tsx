import { Home, Map, Settings, User } from 'lucide-react';
import { motion } from 'framer-motion';

export function NavigationBar() {
    const navItems = [
        { icon: Home, label: 'Home', active: false },
        { icon: Map, label: 'Explore', active: true },
        { icon: User, label: 'Profile', active: false },
        { icon: Settings, label: 'Settings', active: false },
    ];

    return (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[1000] w-auto">
            <div className="glass-panel rounded-full px-2 py-2 flex items-center gap-2 shadow-2xl bg-white/80 backdrop-blur-xl border border-white/40">
                {navItems.map((item, index) => (
                    <button
                        key={index}
                        className={`relative group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                            item.active 
                                ? 'bg-explorer-teal-600 text-white shadow-lg shadow-explorer-teal-600/30' 
                                : 'text-explorer-slate-500 hover:bg-white hover:text-explorer-teal-600'
                        }`}
                    >
                        <item.icon 
                            className={`w-5 h-5 transition-transform duration-300 ${item.active ? 'scale-110' : 'group-hover:scale-110'}`} 
                            strokeWidth={item.active ? 2.5 : 2} 
                        />
                        
                        {/* Tooltip */}
                        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-explorer-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                            {item.label}
                            <span className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-explorer-slate-900"></span>
                        </span>

                        {item.active && (
                            <motion.div
                                layoutId="nav-indicator"
                                className="absolute inset-0 rounded-full border-2 border-white/20"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
