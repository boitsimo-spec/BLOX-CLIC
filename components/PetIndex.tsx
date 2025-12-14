import React, { useMemo, useState } from 'react';
import { Pet, Rarity } from '../types';
import { Book, Search, Filter, Sparkles } from 'lucide-react';
import { PetCard } from './PetCard';

interface PetIndexProps {
    discoveredPets: Pet[];
    aura?: number;
}

export const PetIndex: React.FC<PetIndexProps> = ({ discoveredPets, aura = 0 }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRarity, setFilterRarity] = useState<string>('ALL');

    const uniquePets = useMemo(() => {
        // Remove duplicates based on name to show unique discoveries
        const unique = new Map();
        discoveredPets.forEach(pet => {
            if (!unique.has(pet.name)) {
                unique.set(pet.name, pet);
            }
        });
        return Array.from(unique.values());
    }, [discoveredPets]);

    const filteredPets = uniquePets.filter(pet => {
        const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRarity = filterRarity === 'ALL' || pet.rarity === filterRarity;
        return matchesSearch && matchesRarity;
    });

    const stats = {
        total: uniquePets.length,
        mythical: uniquePets.filter(p => p.rarity === Rarity.MYTHICAL).length,
        legendary: uniquePets.filter(p => p.rarity === Rarity.LEGENDARY).length,
    };

    return (
        <div className="animate-fade-in h-full flex flex-col">
            <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 p-4 rounded-xl border border-blue-500/30 mb-4 shrink-0 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-2 relative z-10">
                    <Book size={24} className="text-blue-400" />
                    <div>
                        <h2 className="font-game font-bold text-xl text-white">Pet Index</h2>
                        <p className="text-xs text-blue-200">Track your unique discoveries!</p>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-2 text-xs font-mono relative z-10">
                    <div className="bg-black/40 px-2 py-1 rounded text-gray-300">Total: <span className="text-white font-bold">{stats.total}</span></div>
                    <div className="bg-black/40 px-2 py-1 rounded text-yellow-300">Legendary: <span className="text-white font-bold">{stats.legendary}</span></div>
                    <div className="bg-black/40 px-2 py-1 rounded text-pink-300">Mythical: <span className="text-white font-bold">{stats.mythical}</span></div>
                </div>

                {/* Aura Display in Index */}
                {aura > 0 && (
                    <div className="absolute top-2 right-2 bg-purple-900/60 backdrop-blur px-3 py-1.5 rounded-lg border border-purple-500/50 flex items-center gap-2 animate-pulse z-10">
                        <Sparkles size={14} className="text-purple-300" />
                        <div className="text-right leading-none">
                            <div className="text-[9px] text-purple-200 uppercase font-bold">Aura</div>
                            <div className="text-sm font-bold text-white">{aura.toLocaleString()}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="flex gap-2 mb-4 shrink-0">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Search pets..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                    />
                </div>
                <div className="relative">
                    <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <select 
                        value={filterRarity}
                        onChange={(e) => setFilterRarity(e.target.value)}
                        className="bg-black/40 border border-white/10 rounded-lg pl-9 pr-8 py-2 text-sm text-white focus:border-blue-500 outline-none appearance-none"
                    >
                        <option value="ALL">All Rarities</option>
                        {Object.values(Rarity).map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredPets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                        <Book size={48} className="mb-2 opacity-20" />
                        <p>No pets found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 pb-4">
                        {filteredPets.map(pet => (
                            <PetCard key={pet.id} pet={pet} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};