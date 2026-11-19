// src/components/ContentMap.tsx
import React, { useState } from 'react';
import { Square, Orient } from '../lib/navigator/types';

interface ContentMapProps {
    allLandmarks: Orient[];
    onSelect: (landmarkId: string) => void;
}

const ContentMap: React.FC<ContentMapProps> = ({ allLandmarks, onSelect }) => {
    const [query, setQuery] = useState('');

    const filtered = allLandmarks.filter(lm => {
        const search = query.toLowerCase();
        const nameMatch = (lm.name || '').toLowerCase().includes(search);
        const textMatch = (lm.text || '').toLowerCase().includes(search);
        const typeMatch = lm.type.toLowerCase().includes(search);
        const roomMatch = lm.no ? `ауд. ${lm.no}`.includes(search) : false;
        return nameMatch || textMatch || typeMatch || roomMatch;
    });

    return (
        <div className="content-map bg-white border border-gray-300 rounded p-4">
            <input
                type="text"
                placeholder="Поиск по зданию (кафе, 4407, огнетушитель)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-2 border rounded mb-3"
            />
            <div className="max-h-60 overflow-y-auto space-y-1">
                {filtered.length === 0 ? (
                    <div className="text-sm text-gray-500">Ничего не найдено</div>
                ) : (
                    filtered.map((lm) => (
                        <div 
                            key={lm.id} 
                            className="p-2 rounded hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => onSelect(lm.id)}
                        >
                            <div className="font-medium">
                                {lm.type === 'room' ? `Ауд. ${lm.no}` : lm.name || lm.type}
                            </div>
                            {lm.text && <div className="text-gray-600">{lm.text}</div>}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ContentMap;