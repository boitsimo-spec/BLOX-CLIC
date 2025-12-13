import React from 'react';
import { Pet, Rarity } from '../types';

interface PetCardProps {
  pet: Pet;
  onEquip?: (pet: Pet) => void; // Placeholder for future equip logic
}

const getRarityColor = (rarity: Rarity) => {
  switch (rarity) {
    case Rarity.COMMON: return 'text-gray-400 border-gray-600 bg-gray-900/50';
    case Rarity.UNCOMMON: return 'text-green-400 border-green-600 bg-green-900/20';
    case Rarity.RARE: return 'text-blue-400 border-blue-600 bg-blue-900/20';
    case Rarity.EPIC: return 'text-purple-400 border-purple-600 bg-purple-900/20';
    case Rarity.LEGENDARY: return 'text-orange-400 border-orange-600 bg-orange-900/20';
    case Rarity.MYTHICAL: return 'text-pink-500 border-pink-500 bg-pink-900/20 shadow-[0_0_15px_rgba(236,72,153,0.3)]';
    default: return 'text-white border-white';
  }
};

export const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const colorClass = getRarityColor(pet.rarity);

  return (
    <div className={`relative flex flex-col items-center p-3 rounded-xl border-2 ${colorClass} transition-transform hover:scale-105 cursor-pointer group`}>
      <div className="text-4xl mb-2 filter drop-shadow-md animate-bounce-click">
        {pet.emoji}
      </div>
      <div className="text-center">
        <div className="font-bold text-sm leading-tight">{pet.name}</div>
        <div className="text-[10px] uppercase tracking-wider opacity-80 mt-1">{pet.rarity}</div>
      </div>
      <div className="mt-2 bg-black/40 rounded px-2 py-1 text-xs font-mono text-yellow-300">
        x{pet.multiplier.toFixed(1)}
      </div>
      
      {/* Tooltip Description */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/90 text-white text-xs p-2 text-center rounded-xl transition-opacity duration-200 pointer-events-none z-10">
        "{pet.description}"
      </div>
    </div>
  );
};