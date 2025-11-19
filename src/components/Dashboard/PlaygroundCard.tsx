import { motion } from 'framer-motion';
import { Star, MapPin, Navigation } from 'lucide-react';
import type { Playground } from '../../services/PlaygroundService';

interface PlaygroundCardProps {
    playground: Playground;
    isSelected?: boolean;
    onSelect?: () => void;
}

export function PlaygroundCard({ playground, isSelected, onSelect }: PlaygroundCardProps) {
    const handleNavigationClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(`https://www.google.com/maps/search/?api=1&query=${playground.lat},${playground.lon}`, '_blank');
    };

    return (
        <motion.div
            className={`snap-center shrink-0 w-[280px] h-[180px] relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group transition-all duration-300 ${isSelected ? 'ring-4 ring-explorer-teal-500 scale-105 z-10' : 'hover:scale-102'
                }`}
            onClick={onSelect}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: isSelected ? 1.05 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${playground.image})` }}
            />

            {/* Overlay Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 ${isSelected ? 'opacity-90' : 'opacity-100'}`} />

            {/* Content */}
            <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                <div className="flex justify-between items-start mb-auto">
                    {playground.rating ? (
                        <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span>{playground.rating}</span>
                        </div>
                    ) : (
                        <div /> /* Spacer to keep layout consistent */
                    )}
                    <button
                        onClick={handleNavigationClick}
                        className={`p-1.5 rounded-full shadow-lg transition-colors hover:scale-110 active:scale-95 ${isSelected ? 'bg-explorer-teal-500' : 'bg-explorer-orange-500'}`}
                        title="Open in Google Maps"
                    >
                        <Navigation className="w-4 h-4 text-white" />
                    </button>
                </div>

                <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-explorer-orange-400 transition-colors">
                    {playground.name}
                </h3>

                <div className="flex items-center gap-4 text-xs text-gray-300">
                    <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{playground.distance.toFixed(1)} mi</span>
                    </div>
                    {playground.features && playground.features.length > 0 && (
                        <span className="truncate max-w-[100px]">• {playground.features[0]}</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
