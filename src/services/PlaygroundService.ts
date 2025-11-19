export interface Playground {
    id: number;
    lat: number;
    lon: number;
    name?: string;
    surface?: string;
    wheelchair?: string;
    equipment?: string;
    rating?: number;
    distance: number;
    features: string[];
    image: string;
}

export class PlaygroundService {
    private readonly OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

    // Curated Unsplash Images mapped to categories
    private readonly IMAGES = {
        water: 'https://images.unsplash.com/photo-1557334077-176351725479?auto=format&fit=crop&w=800&q=80', // Splash pad / Water
        nature: 'https://images.unsplash.com/photo-1566454419290-57a64afe79ac?auto=format&fit=crop&w=800&q=80', // Greenery / Park
        modern: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80', // Modern structures
        active: 'https://images.unsplash.com/photo-1596464716127-f9a8274169c5?auto=format&fit=crop&w=800&q=80', // Sports / Active
        default: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80' // Generic
    };

    public async findNearbyPlaygrounds(lat: number, lon: number, radius: number = 5000): Promise<Playground[]> {
        // Query for nodes with leisure=playground within radius meters
        const query = `
      [out:json];
      (
        node["leisure"="playground"](around:${radius},${lat},${lon});
        way["leisure"="playground"](around:${radius},${lat},${lon});
        relation["leisure"="playground"](around:${radius},${lat},${lon});
      );
      out center;
    `;

        try {
            const response = await fetch(this.OVERPASS_URL, {
                method: 'POST',
                body: query,
            });

            if (!response.ok) {
                throw new Error(`Overpass API error: ${response.statusText}`);
            }

            const data = await response.json();

            return data.elements.map((element: any) => {
                const pLat = element.lat || element.center?.lat;
                const pLon = element.lon || element.center?.lon;
                const tags = element.tags || {};

                return {
                    id: element.id,
                    lat: pLat,
                    lon: pLon,
                    name: tags.name || 'Playground',
                    surface: tags.surface,
                    wheelchair: tags.wheelchair,
                    equipment: tags.playground_equipment || tags.equipment,
                    rating: undefined, // No fake ratings
                    distance: this.calculateDistance(lat, lon, pLat, pLon),
                    features: this.extractFeatures(tags),
                    image: this.getSmartImage(tags),
                };
            }).filter((p: any) => p.lat && p.lon); // Ensure valid coordinates

        } catch (error) {
            console.error('Failed to fetch playgrounds:', error);
            return [];
        }
    }

    private getSmartImage(tags: any): string {
        // Check for water features
        if (tags.water || tags.splash_pad || (tags.feature && tags.feature.includes('water'))) {
            return this.IMAGES.water;
        }

        // Check for nature/sand/grass
        if (tags.surface === 'sand' || tags.surface === 'grass' || tags.natural) {
            return this.IMAGES.nature;
        }

        // Check for sports/active
        if (tags.sport || tags.fitness_station) {
            return this.IMAGES.active;
        }

        // Default to modern/generic based on ID parity to give some variety if no tags match
        return Math.random() > 0.5 ? this.IMAGES.modern : this.IMAGES.default;
    }

    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 3959; // Radius of Earth in miles
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }

    private extractFeatures(tags: any): string[] {
        const features = [];
        if (tags?.surface) features.push(tags.surface);
        if (tags?.wheelchair === 'yes') features.push('Accessible');
        if (tags?.playground_equipment) features.push('Equipment Info');
        if (features.length === 0) features.push('Fun Zone');
        return features;
    }
}

export const playgroundService = new PlaygroundService();
