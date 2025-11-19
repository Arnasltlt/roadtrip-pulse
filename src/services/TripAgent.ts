export type TripState = 'IDLE' | 'DRIVING' | 'STOPPED';

export interface AgentStatus {
    state: TripState;
    lastCheck: number;
    message: string;
    mood: string;
}

export class TripAgent {
    private state: TripState = 'IDLE';
    // private lastSpeed: number = 0; // Unused for now
    private stopStartTime: number | null = null;

    // Configuration
    private readonly STOP_SPEED_THRESHOLD = 2.2; // ~5 mph in m/s
    private readonly DRIVE_SPEED_THRESHOLD = 6.7; // ~15 mph in m/s
    private readonly STOP_DURATION_THRESHOLD = 2000; // 2 seconds for MVP testing

    public update(speed: number | null): AgentStatus {
        const currentSpeed = speed || 0;
        const now = Date.now();

        // Logic to transition states
        if (this.state === 'IDLE') {
            if (currentSpeed > this.DRIVE_SPEED_THRESHOLD) {
                this.transitionTo('DRIVING');
            } else {
                // Assume stopped if we start idle and slow
                this.transitionTo('STOPPED');
            }
        } else if (this.state === 'DRIVING') {
            if (currentSpeed < this.STOP_SPEED_THRESHOLD) {
                if (!this.stopStartTime) {
                    this.stopStartTime = now;
                } else if (now - this.stopStartTime > this.STOP_DURATION_THRESHOLD) {
                    this.transitionTo('STOPPED');
                    this.stopStartTime = null;
                }
            } else {
                // Reset stop timer if we speed up
                this.stopStartTime = null;
            }
        } else if (this.state === 'STOPPED') {
            if (currentSpeed > this.DRIVE_SPEED_THRESHOLD) {
                this.transitionTo('DRIVING');
            }
        }

        // this.lastSpeed = currentSpeed;

        return {
            state: this.state,
            lastCheck: now,
            message: this.getMessage(),
            mood: this.getMood(),
        };
    }

    private transitionTo(newState: TripState) {
        console.log(`[TripAgent] Transitioning from ${this.state} to ${newState}`);
        this.state = newState;
    }

    private getMessage(): string {
        switch (this.state) {
            case 'DRIVING':
                return "Monitoring route... I'll look for playgrounds when you stop.";
            case 'STOPPED':
                return "It looks like you've stopped! Tap to find playgrounds.";
            default:
                return "Waiting for GPS...";
        }
    }

    private getMood(): string {
        switch (this.state) {
            case 'DRIVING': return 'Observant';
            case 'STOPPED': return 'Excited';
            default: return 'Calm';
        }
    }
}

export const tripAgent = new TripAgent();
