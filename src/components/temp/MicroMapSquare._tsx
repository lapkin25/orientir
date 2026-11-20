// src/components/MicroMapSquare.tsx
import React from 'react';
import { Square, Orient } from '../lib/navigator/types';

interface MicroMapSquareProps {
    square: Square;
    currentSide: 'forward' | 'left' | 'right' | 'backward'; // Сторона, где стоит пользователь
}

const MicroMapSquare: React.FC<MicroMapSquareProps> = ({ square, currentSide }) => {
    // Порядок обхода сторон против часовой стрелки относительно взгляда (backward -> left -> forward -> right)
    const sideOrder: (keyof Pick<Square, 'forward' | 'left' | 'right' | 'backward'>)[] = 
        currentSide === 'backward' ? ['left', 'forward', 'right'] :
        currentSide === 'left' ? ['forward', 'right', 'backward'] :
        currentSide === 'forward' ? ['right', 'backward', 'left'] :
        ['backward', 'left', 'forward'];

    const getSideData = (dir: keyof Pick<Square, 'forward' | 'left' | 'right' | 'backward'>) => {
        return square[dir] || { parts: [] };
    };

    return (
        <div className="micro-map-square border-2 border-gray-300 rounded-lg p-4 bg-white relative">
            <div className="text-sm font-semibold mb-2">
                {square.building} — Этаж {square.floor}
            </div>
            
            {/* Визуализация "взгляда" пользователя */}
            <div className="flex justify-center items-center h-32 relative">
                <div 
                    className={`absolute w-2 h-2 rounded-full ${
                        currentSide === 'forward' ? 'bg-green-500' : 'bg-gray-400'
                    } -top-8`}
                />
                <div 
                    className={`absolute w-2 h-2 rounded-full ${
                        currentSide === 'left' ? 'bg-green-500' : 'bg-gray-400'
                    } -left-8`}
                />
                <div 
                    className={`absolute w-2 h-2 rounded-full ${
                        currentSide === 'backward' ? 'bg-green-500' : 'bg-gray-400'
                    } bottom-0 mx-auto`}
                />
                <div 
                    className={`absolute w-2 h-2 rounded-full ${
                        currentSide === 'right' ? 'bg-green-500' : 'bg-gray-400'
                    } -right-8`}
                />
                <div className="text-xs text-gray-500">Вы здесь</div>
            </div>

            {/* Ориентиры по сторонам */}
            {sideOrder.map((dir) => {
                const side = getSideData(dir);
                if (!side || side.parts.length === 0) return null;
                return (
                    <div key={dir} className="mt-2">
                        <div className="text-xs uppercase text-gray-600">{dir}</div>
                        <div className="flex flex-wrap gap-1">
                            {side.parts.map((part, idx) => (
                                <div 
                                    key={idx} 
                                    className="px-2 py-1 bg-blue-50 text-blue-800 text-xs rounded border border-blue-200"
                                >
                                    {part.orientirs.map((o: Orient, oIdx: number) => (
                                        <span key={oIdx}>
                                            {o.type === 'room' ? `Ауд. ${o.no}` : o.name || o.text}
                                            {o.key && <span className="text-yellow-500">*</span>}
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            {/* Стыки (переходы) */}
            {square.joints && square.joints.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs font-medium text-gray-700">Переходы:</div>
                    {square.joints.map((joint) => (
                        <div key={joint.id} className="text-xs text-gray-600">
                            → {joint.text}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MicroMapSquare;