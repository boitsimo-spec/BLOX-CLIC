import React from 'react';
import { Island } from '../types';
import { Map, Lock, Check } from 'lucide-react';

interface IslandSelectorProps {
    currentIslandId: string;
    unlockedIslands: string[]; 
    currency: number;
    onTravel: (island: Island) => void;
    isUpdateLive?: boolean;
}

export const ISLANDS_DATA: Island[] = [
    { id: 'spawn', name: 'Spawn Island', multiplier: 1, cost: 0, color: 'text-green-400', image: '🌳' },
    { id: 'desert', name: 'Sand Dunes', multiplier: 2.5, cost: 50000, color: 'text-yellow-500', image: '🌵' },
    { id: 'candy', name: 'Candy Land', multiplier: 5, cost: 250000, color: 'text-pink-400', image: '🍭' },
    { id: 'magma', name: 'Magma Ridge', multiplier: 10, cost: 1000000, color: 'text-red-500', image: '🌋' },
    { id: 'cyber', name: 'Cyber City', multiplier: 25, cost: 10000000, color: 'text-cyan-400', image: '🏙️' },
    { id: 'northpole', name: 'North Pole', multiplier: 100, cost: 250000000, color: 'text-red-400', image: '🎄' }, // New Festive Island
    { id: 'ohio', name: 'Ohio (Limited)', multiplier: 50, cost: 50000000, color: 'text-gray-200', image: '💀' }, // Limited Island
];

export const IslandSelector: React.FC<IslandSelectorProps> = ({ currentIslandId, currency, onTravel, isUpdateLive = false }) => {
    return (
        <div className="space-y-4 animate-fade-in pb-4">
             <h2 className="text-xl font-game font-bold text-blue-400 uppercase flex items-center gap-2 mb-4">
                <Map size={24} /> Travel
            </h2>

            <div className="space-y-3">
                {ISLANDS_DATA.map((island) => {
                    const isCurrent = currentIslandId === island.id;
                    const canAfford = currency >= island.cost;
                    
                    const isLimited = island.id === 'ohio';
                    const isLockedByTime = isLimited && !isUpdateLive;

                    return (
                        <div 
                            key={island.id} 
                            className={`relative p-4 rounded-xl border-2 transition-all ${isCurrent ? 'bg-blue-900/40 border-blue-500' : isLockedByTime ? 'bg-black/60 border-gray-800 opacity-80' : 'bg-black/40 border-white/10'}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl">{island.image}</div>
                                    <div>
                                        <div className={`font-game font-bold text-lg ${island.color} flex items-center gap-2`}>
                                            {island.name}
                                            {isLimited && <span className="bg-red-600 text-white text-[9px] px-1 rounded animate-pulse">LIMITED</span>}
                                        </div>
                                        <div className="text-xs text-gray-400 font-mono">Multiplier: <span className="text-white font-bold">x{island.multiplier}</span></div>
                                    </div>
                                </div>

                                {isLockedByTime ? (
                                    <button disabled className="bg-gray-800 text-gray-500 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1 cursor-not-allowed border border-gray-700">
                                        <Lock size={12} /> SOON
                                    </button>
                                ) : isCurrent ? (
                                    <button disabled className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xs opacity-80 flex items-center gap-1">
                                        <Check size={14} /> HERE
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => onTravel(island)}
                                        className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 border-b-4 active:border-b-0 active:translate-y-1 transition-all ${canAfford || island.cost === 0 ? 'bg-green-600 hover:bg-green-500 border-green-800 text-white' : 'bg-gray-700 border-gray-900 text-gray-400 cursor-not-allowed'}`}
                                    >
                                        {canAfford ? 'TRAVEL' : 'LOCKED'}
                                        {island.cost > 0 && <span className="bg-black/20 px-1 rounded text-[10px]">{island.cost.toLocaleString()}</span>}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};