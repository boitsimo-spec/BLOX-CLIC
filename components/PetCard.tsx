import React from 'react';
import { Pet, Rarity } from '../types';
import { Sparkles, Zap, Flame, Star, Crown } from 'lucide-react';

interface PetCardProps {
  pet: Pet;
  onEquip?: (pet: Pet) => void;
}

const getRarityStyles = (rarity: Rarity) => {
  switch (rarity) {
    case Rarity.COMMON:
      return {
        container: 'border-gray-600 bg-gray-900/50 text-gray-400',
        effect: null
      };
    case Rarity.UNCOMMON:
      return {
        container: 'border-green-600 bg-green-900/20 text-green-400',
        effect: null
      };
    case Rarity.RARE:
      return {
        container: 'border-blue-600 bg-blue-900/20 text-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.1)]',
        effect: null
      };
    case Rarity.EPIC:
      return {
        container: 'border-purple-600 bg-purple-900/20 text-purple-400 shadow-[0_0_15px_rgba(147,51,234,0.2)]',
        effect: <Zap size={14} className="absolute top-2 right-2 text-purple-300 opacity-75 animate-pulse" />
      };
    case Rarity.LEGENDARY:
      return {
        container: 'border-orange-500 bg-orange-900/20 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.3)]',
        effect: <Star size={14} className="absolute top-2 right-2 text-yellow-300 animate-[spin_3s_linear_infinite]" />
      };
    case Rarity.ULTRA_RARE:
      return {
        container: 'border-red-600 bg-red-900/30 text-red-500 shadow-[0_0_25px_rgba(220,38,38,0.4)] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]',
        effect: <Flame size={14} className="absolute top-2 right-2 text-red-400 animate-bounce" />
      };
    case Rarity.MYTHICAL:
      return {
        container: 'border-pink-500 bg-pink-900/30 text-pink-400 shadow-[0_0_30px_rgba(236,72,153,0.5)]',
        effect: (
            <>
                <Sparkles size={14} className="absolute top-2 right-2 text-pink-200 animate-pulse" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none"></div>
            </>
        )
      };
    default:
      return { container: 'border-white', effect: null };
  }
};

export const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const styles = getRarityStyles(pet.rarity);

  return (
    <div className={`relative flex flex-col items-center p-3 rounded-xl border-2 ${styles.container} transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer group overflow-hidden`}>
      
      {/* Shine Effect on Hover */}
      <div className="absolute inset-0 -translate-x-[200%] group-hover:animate-[shine_1s_ease-in-out] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"></div>

      {/* Rarity Icon Effect */}
      {styles.effect}

      <div className="text-4xl mb-2 filter drop-shadow-md animate-[bounce_2s_infinite]">
        {pet.emoji}
      </div>
      
      <div className="text-center relative z-10">
        <div className="font-bold text-sm leading-tight group-hover:text-white transition-colors">{pet.name}</div>
        <div className="text-[10px] uppercase tracking-wider opacity-80 mt-1 font-mono">{pet.rarity}</div>
      </div>
      
      <div className="mt-2 bg-black/60 rounded-lg px-2 py-1 text-xs font-mono text-yellow-300 border border-white/10 flex items-center gap-1 shadow-sm">
        <Zap size={10} className="text-yellow-500" />
        x{pet.multiplier.toFixed(1)}
      </div>
      
      {/* Tooltip Description */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/95 text-white text-xs p-3 text-center transition-opacity duration-200 pointer-events-none z-20 backdrop-blur-sm">
        <div className="transform scale-90 group-hover:scale-100 transition-transform">
            <p className="italic text-gray-300">"{pet.description}"</p>
        </div>
      </div>
    </div>
  );
};