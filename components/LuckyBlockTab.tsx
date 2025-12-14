import React from 'react';
import { Gift, Skull, BrainCircuit, Sun, Flame, Crown, Lock, Box, HelpCircle } from 'lucide-react';

interface LuckyBlock {
  id: string;
  name: string;
  description: string;
  cost: number;
  currencyType: 'studs' | 'gems' | 'tokens';
  color: string;
  icon: React.ReactNode;
  bgGradient: string;
  borderColor: string;
  comingSoon?: boolean;
}

const BLOCKS: LuckyBlock[] = [
  {
    id: 'christmas',
    name: 'Christmas Lucky Block',
    description: 'Festive surprise! Chance for Gems.',
    cost: 5000,
    currencyType: 'gems',
    color: 'text-red-100',
    icon: <Gift size={40} className="text-red-100 drop-shadow-lg" />,
    bgGradient: 'from-red-900/80 to-green-900/80',
    borderColor: 'border-red-500'
  },
  {
    id: 'halloween',
    name: 'Halloween Lucky Block',
    description: 'Spooky riches... or a trick?',
    cost: 6666,
    currencyType: 'gems',
    color: 'text-orange-400',
    icon: <Skull size={40} className="text-orange-500 drop-shadow-lg" />,
    bgGradient: 'from-orange-900/80 to-black',
    borderColor: 'border-orange-600'
  },
  {
    id: 'summer',
    name: 'Summer Lucky Block',
    description: 'Hot earnings! Studs burst.',
    cost: 500000,
    currencyType: 'studs',
    color: 'text-yellow-300',
    icon: <Sun size={40} className="text-yellow-400 drop-shadow-lg" />,
    bgGradient: 'from-yellow-600/60 to-orange-500/60',
    borderColor: 'border-yellow-500'
  },
  {
    id: 'lava',
    name: 'Lava Lucky Block',
    description: 'Dangerous heat. Massive Studs.',
    cost: 5000000,
    currencyType: 'studs',
    color: 'text-red-500',
    icon: <Flame size={40} className="text-red-500 drop-shadow-lg animate-pulse" />,
    bgGradient: 'from-red-700/60 to-orange-900/80',
    borderColor: 'border-red-600'
  },
  {
    id: 'owner',
    name: "Owner's Lucky Block",
    description: 'OP Rewards. High Stakes.',
    cost: 1000,
    currencyType: 'tokens',
    color: 'text-cyan-300',
    icon: <Crown size={40} className="text-cyan-400 drop-shadow-lg" />,
    bgGradient: 'from-cyan-900/80 to-blue-900/80',
    borderColor: 'border-cyan-500'
  },
  {
    id: 'festive_2025',
    name: 'Festive Present',
    description: 'HUGE Gem/Token Rewards!',
    cost: 25000,
    currencyType: 'gems',
    color: 'text-green-300',
    icon: <Gift size={40} className="text-green-300 drop-shadow-lg animate-bounce" />,
    bgGradient: 'from-green-900/80 to-red-900/80',
    borderColor: 'border-green-500'
  },
  {
    id: 'brainrot',
    name: 'Brainrot Lucky Block',
    description: 'Skibidi rewards inside.',
    cost: 0,
    currencyType: 'tokens',
    color: 'text-pink-400',
    icon: <BrainCircuit size={40} className="text-pink-500" />,
    bgGradient: 'from-pink-900/20 to-purple-900/20',
    borderColor: 'border-pink-900',
    comingSoon: true // We toggle this prop logic inside component based on parent
  }
];

interface LuckyBlockTabProps {
  currency: number;
  gems: number;
  tokens: number;
  onOpen: (blockId: string, cost: number, currencyType: 'studs' | 'gems' | 'tokens') => void;
  isUpdateLive?: boolean;
  timeString?: string;
}

export const LuckyBlockTab: React.FC<LuckyBlockTabProps> = ({ currency, gems, tokens, onOpen, isUpdateLive = false, timeString = '' }) => {
  return (
    <div className="animate-fade-in pb-6">
      <div className="flex items-center gap-2 mb-4 bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/20">
         <Box className="text-yellow-400" size={24} />
         <div>
            <h2 className="font-game font-bold text-yellow-400 uppercase text-lg leading-none">Lucky Blocks</h2>
            <p className="text-xs text-yellow-200/60">Open blocks for random rewards!</p>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {BLOCKS.map((block) => {
           let canAfford = false;
           let balance = 0;
           let currLabel = '';

           switch(block.currencyType) {
               case 'studs': 
                   canAfford = currency >= block.cost; 
                   balance = currency;
                   currLabel = 'Studs';
                   break;
               case 'gems': 
                   canAfford = gems >= block.cost; 
                   balance = gems;
                   currLabel = 'Gems';
                   break;
               case 'tokens': 
                   canAfford = tokens >= block.cost; 
                   balance = tokens;
                   currLabel = 'Tokens';
                   break;
           }

           // Custom Logic for Brainrot block
           const isBrainrot = block.id === 'brainrot';
           const locked = isBrainrot ? !isUpdateLive : block.comingSoon;
           const lockText = isBrainrot && !isUpdateLive ? `UNLOCKS IN ${timeString}` : 'COMING SOON';

           // If it is brainrot and live, allow afford check
           if (locked) canAfford = false;

           return (
             <button
               key={block.id}
               onClick={() => !locked && onOpen(block.id, block.cost, block.currencyType)}
               disabled={!canAfford && !locked}
               className={`relative w-full p-4 rounded-xl border-b-4 transition-all group overflow-hidden text-left ${locked ? 'opacity-70 cursor-not-allowed' : 'active:border-b-0 active:translate-y-1 hover:brightness-110'} bg-gradient-to-br ${block.bgGradient} ${block.borderColor}`}
             >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                
                {locked && (
                    <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center backdrop-blur-[2px]">
                        <div className="bg-black/80 border border-white/20 px-4 py-2 rounded-lg transform -rotate-12">
                            <span className="font-game font-bold text-xl text-white tracking-widest flex items-center gap-2 uppercase">
                                <Lock size={18} /> {lockText}
                            </span>
                        </div>
                    </div>
                )}

                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 bg-black/30 rounded-lg border border-white/10 ${locked ? 'grayscale' : ''}`}>
                            {block.icon}
                        </div>
                        <div>
                            <div className={`font-game font-bold text-xl ${block.color} drop-shadow-md`}>{block.name}</div>
                            <div className="text-xs text-white/70 mb-2 font-medium max-w-[180px]">{block.description}</div>
                            
                            {!locked && (
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold bg-black/40 border border-white/10 ${canAfford ? 'text-white' : 'text-red-400'}`}>
                                    {block.cost === 0 ? 'FREE' : `${block.cost.toLocaleString()} ${currLabel}`}
                                </div>
                            )}
                        </div>
                    </div>

                    {!locked && (
                        <div className="hidden sm:flex flex-col items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                            <HelpCircle size={24} className="mb-1" />
                            <span className="text-[10px] uppercase font-bold">Luck?</span>
                        </div>
                    )}
                </div>
             </button>
           );
        })}
      </div>
    </div>
  );
};