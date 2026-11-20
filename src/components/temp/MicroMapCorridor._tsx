// src/components/MicroMapCorridor.tsx
import React from 'react';
import { Corridor, Orient } from '../lib/navigator/types';

interface MicroMapCorridorProps {
    corridor: Corridor;
}

const MicroMapCorridor: React.FC<MicroMapCorridorProps> = ({ corridor }) => {
    return (
        <div className="micro-map-corridor border-2 border-yellow-300 rounded-lg p-4 bg-yellow-50">
            <div className="text-sm font-semibold text-yellow-800 mb-2">
                Коридор: {corridor.start} → {corridor.finish}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                    <div className="text-gray-700 mb-1">По левую руку:</div>
                    {corridor.orients
                        .filter((o: Orient) => o.wall === 'left')
                        .map((o: Orient, idx: number) => (
                            <div key={idx} className="text-gray-600">{o.name || o.text}</div>
                        ))}
                </div>
                <div>
                    <div className="text-gray-700 mb-1">По правую руку:</div>
                    {corridor.orientirs
                        .filter((o: Orient) => o.wall === 'right')
                        .map((o: Orient, idx: number) => (
                            <div key={idx} className="text-gray-600">{o.name || o.text}</div>
                        ))}
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-yellow-200 text-sm font-medium text-yellow-800">
                В конце коридора: {corridor.finish_text}
            </div>
        </div>
    );
};

export default MicroMapCorridor;