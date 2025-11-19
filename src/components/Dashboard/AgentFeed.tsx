import type { AgentStatus } from '../../services/TripAgent';

interface AgentFeedProps {
    status: AgentStatus;
}

export function AgentFeed({ status }: AgentFeedProps) {
    return (
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-6 z-[1000] transition-transform duration-300">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

            <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${status.state === 'DRIVING' ? 'bg-blue-100 text-blue-600' :
                    status.state === 'STOPPED' ? 'bg-green-100 text-green-600' :
                        'bg-gray-100 text-gray-600'
                    }`}>
                    {status.state === 'DRIVING' && <span className="animate-spin">🚗</span>}
                    {status.state === 'STOPPED' && <span className="animate-bounce">📍</span>}
                    {status.state === 'IDLE' && <span>😴</span>}
                </div>

                <div>
                    <h3 className="font-bold text-lg text-gray-900">
                        {status.state === 'DRIVING' ? 'On the Road' :
                            status.state === 'STOPPED' ? 'Stopped' : 'Ready'}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                        {status.message}
                    </p>
                </div>
            </div>
        </div>
    );
}
