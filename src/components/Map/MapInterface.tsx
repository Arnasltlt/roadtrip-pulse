import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState, useRef } from 'react';
import { useLocationTracker } from '../../hooks/useLocationTracker';
import { tripAgent, type AgentStatus } from '../../services/TripAgent';
import { playgroundService, type Playground } from '../../services/PlaygroundService';
import { TravelCompanion } from '../Dashboard/TravelCompanion';
import { PlaygroundCard } from '../Dashboard/PlaygroundCard';
import { DebugPanel } from '../Debug/DebugPanel';
import { AnimatePresence, motion } from 'framer-motion';

import { getPlaygroundIcon } from './MapMarker';

// Fix for default marker icon in Leaflet with Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;


// Custom Pulsing Icon for User Location
const PulsingUserIcon = L.divIcon({
    className: 'bg-transparent',
    html: `
    <div class="relative flex items-center justify-center w-12 h-12">
      <div class="absolute w-full h-full bg-explorer-teal-400/30 rounded-full animate-ping"></div>
      <div class="relative w-4 h-4 bg-explorer-teal-600 rounded-full border-2 border-white shadow-lg z-10"></div>
      <div class="absolute w-8 h-8 bg-explorer-teal-500/20 rounded-full animate-pulse"></div>
    </div>
  `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
});

// Component to center map on user location
function LocationMarker({ lat, lng }: { lat: number, lng: number }) {
    const map = useMap();
    const firstRun = useRef(true);

    useEffect(() => {
        if (firstRun.current) {
            map.flyTo([lat, lng], map.getZoom());
            firstRun.current = false;
        }
    }, [lat, lng, map]);

    return (
        <Marker position={[lat, lng]} icon={PulsingUserIcon}>
            <Popup>You are here</Popup>
        </Marker>
    );
}

// Helper to fly to location
function MapController({ selectedLocation, userLocation }: { selectedLocation: Playground | null, userLocation: [number, number] | null }) {
    const map = useMap();
    const lastSelectedId = useRef<number | null>(null);

    useEffect(() => {
        if (selectedLocation && userLocation && selectedLocation.id !== lastSelectedId.current) {
            const bounds = L.latLngBounds([userLocation, [selectedLocation.lat, selectedLocation.lon]]);
            map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
            lastSelectedId.current = selectedLocation.id;
        }
    }, [selectedLocation, userLocation, map]);

    return null;
}

export function MapInterface() {
    const { latitude, longitude, speed: realSpeed, error } = useLocationTracker();

    // State for Agent
    const [agentStatus, setAgentStatus] = useState<AgentStatus>(tripAgent.update(0));
    const [playgrounds, setPlaygrounds] = useState<Playground[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedPlaygroundId, setSelectedPlaygroundId] = useState<number | null>(null);

    // State for Debugging (Simulated Speed)
    const [simulatedSpeed, setSimulatedSpeed] = useState<number>(0);
    const [isDebugMode] = useState(true); // Default to true for MVP testing

    const selectedPlayground = playgrounds.find(p => p.id === selectedPlaygroundId) || null;

    // Effect to update Agent
    useEffect(() => {
        // Use simulated speed if in debug mode, otherwise real speed
        const currentSpeed = isDebugMode ? simulatedSpeed : (realSpeed || 0);

        const interval = setInterval(() => {
            const status = tripAgent.update(currentSpeed);
            setAgentStatus(status);

            // Trigger search if stopped and haven't searched recently (simple logic for MVP)
            if (status.state === 'STOPPED' && playgrounds.length === 0 && !isSearching && latitude && longitude) {
                // Auto-search logic could go here, but we'll rely on the button for now to be less annoying
            } else if (status.state === 'DRIVING' && playgrounds.length > 0 && !selectedPlayground) {
                // Clear playgrounds when driving to reduce clutter (per user story)
                setPlaygrounds([]);
                setSelectedPlaygroundId(null);
            }

        }, 1000); // Check every second

        return () => clearInterval(interval);
    }, [realSpeed, simulatedSpeed, isDebugMode, latitude, longitude, playgrounds.length, isSearching, selectedPlayground]);

    // Default to a central location (e.g., Houston as per user story) if no location yet
    const defaultPosition: [number, number] = [29.7604, -95.3698];
    const center = latitude && longitude ? [latitude, longitude] as [number, number] : defaultPosition;

    const [notification, setNotification] = useState<{ message: string, type: 'error' | 'info' } | null>(null);

    // Clear notification after 3 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleSearch = async () => {
        if (!latitude || !longitude) return;

        setIsSearching(true);
        setPlaygrounds([]); // Clear previous results
        setSelectedPlaygroundId(null);
        setNotification(null);

        try {
            const results = await playgroundService.findNearbyPlaygrounds(latitude, longitude);
            if (results.length === 0) {
                setNotification({ message: "No playgrounds found nearby.", type: 'info' });
            } else {
                setPlaygrounds(results);
            }
        } catch (err) {
            console.error("Failed to search:", err);
            setNotification({ message: "Failed to search. Try again.", type: 'error' });
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="h-full w-full relative bg-slate-50">
            {error && (
                <div className="absolute top-16 left-4 z-[1000] bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                    {error}
                </div>
            )}

            {/* Search Notifications */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`absolute top-24 left-1/2 transform -translate-x-1/2 z-[1000] px-6 py-3 rounded-full shadow-xl backdrop-blur-md border ${notification.type === 'error'
                            ? 'bg-red-500/90 text-white border-red-400'
                            : 'bg-explorer-teal-900/90 text-white border-explorer-teal-700'
                            }`}
                    >
                        <span className="font-medium">{notification.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <MapContainer
                center={center}
                zoom={13}
                className="h-full w-full z-0 map-tiles"
                zoomControl={false}
                eventHandlers={{
                    click: () => setSelectedPlaygroundId(null)
                }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                {latitude && longitude && <LocationMarker lat={latitude} lng={longitude} />}
                <MapController selectedLocation={selectedPlayground} userLocation={latitude && longitude ? [latitude, longitude] : null} />

                {playgrounds.map(pg => (
                    <Marker
                        key={pg.id}
                        position={[pg.lat, pg.lon]}
                        icon={getPlaygroundIcon(selectedPlaygroundId === pg.id)}
                        eventHandlers={{
                            click: (e) => {
                                e.originalEvent.stopPropagation();
                                setSelectedPlaygroundId(pg.id);
                            }
                        }}
                        zIndexOffset={selectedPlaygroundId === pg.id ? 1000 : 0}
                    >
                    </Marker>
                ))}
            </MapContainer>

            {/* Premium UI Overlay */}

            {/* 1. Travel Companion (Agent Status) */}
            <TravelCompanion
                status={agentStatus}
                isSearching={isSearching}
                onSearch={handleSearch}
            />

            {/* 2. Playground Drawer (Horizontal List) */}
            <AnimatePresence>
                {playgrounds.length > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute bottom-32 left-0 right-0 z-[900] px-4 overflow-x-auto flex gap-4 snap-x pb-4 no-scrollbar"
                    >
                        {playgrounds.map(pg => (
                            <PlaygroundCard
                                key={pg.id}
                                playground={pg}
                                isSelected={selectedPlaygroundId === pg.id}
                                onSelect={() => setSelectedPlaygroundId(pg.id)}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Debug Panel */}
            {isDebugMode && (
                <DebugPanel
                    speed={simulatedSpeed}
                    setSpeed={setSimulatedSpeed}
                    onInjectDemoData={handleSearch}
                />
            )}
        </div>
    );
}
