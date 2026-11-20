// src/components/MacroMap.tsx
import React from 'react';
import { Square, Corridor } from '../lib/navigator/types';

interface MacroMapProps {
    // Сюда передаются соседние площадки и коридоры из графа
    neighbors: Array<{ 
        id: string; 
        type: 'square' | 'corridor'; 
        data: Square | Corridor; 
        direction: 'forward' | 'left' | 'right' 
    }>;
}

const MacroMap: React.FC<MacroMapProps> = ({ neighbors }) => {
    return (
        <div className="macro-map bg-gray-50 border border-gray-300 rounded p-3">
            <div className="text-sm font-bold text-gray-800 mb-2">Основные направления</div>
            <div className="space-y-2">
                {neighbors.map((n) => {
                    const keyLandmarks = [];
                    if (n.type === 'square') {
                        const platz = n.data as Square;
                        // Собираем ключевые ориентиры со всех сторон
                        ['forward', 'left', 'right', 'backward'].forEach(side => {
                            const sideData = platz[side as keyof Square];
                            if (sideData?.parts) {
                                sideData.parts.forEach(part => {
                                    part.orientirs.forEach(o => {
                                        if (o.key) keyLandmarks.push(o);
                                    });
                                });
                            }
                        });
                    }
                    // Для коридоров берем ориентиры в начале пути
                    if (n.type === 'corridor') {
                        const corridor = n.data as Corridor;
                        corridor.orientirs.forEach(o => {
                            if (o.key) keyLandmarks.push(o);
                        });
                    }

                    if (keyLandmarks.length === 0) return null;

                    return (
                        <div key={n.id} className="flex items-center text-sm">
                            <span className="w-6 text-center">{n.direction === 'forward' ? '↑' : n.direction === 'left' ? '←' : '→'}</span>
                            <span className="text-gray-700">
                                {keyLandmarks.map((lm, i) => (
                                    <span key={i}>{lm.type === 'room' ? `Ауд. ${lm.no}` : lm.name || lm.text}{i < keyLandmarks.length - 1 ? ', ' : ''}</span>
                                ))}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MacroMap;