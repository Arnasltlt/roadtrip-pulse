import { useState, useEffect } from 'react';

interface LocationState {
    latitude: number | null;
    longitude: number | null;
    speed: number | null; // Speed in meters/second
    heading: number | null;
    timestamp: number | null;
    error: string | null;
}

export function useLocationTracker() {
    const [location, setLocation] = useState<LocationState>({
        latitude: null,
        longitude: null,
        speed: null,
        heading: null,
        timestamp: null,
        error: null,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocation(prev => ({ ...prev, error: 'Geolocation is not supported by your browser' }));
            return;
        }

        const success = (position: GeolocationPosition) => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                speed: position.coords.speed,
                heading: position.coords.heading,
                timestamp: position.timestamp,
                error: null,
            });
        };

        const error = (err: GeolocationPositionError) => {
            setLocation(prev => ({ ...prev, error: `Unable to retrieve your location: ${err.message}` }));
        };

        const options = {
            enableHighAccuracy: true, // Important for driving
            timeout: 5000,
            maximumAge: 0,
        };

        const watchId = navigator.geolocation.watchPosition(success, error, options);

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return location;
}
