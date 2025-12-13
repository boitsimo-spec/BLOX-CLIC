import React from 'react';
import { GamePasses as GamePassesType } from '../types';
import { Crown, Star, Gem, Zap, Flame, ShieldCheck } from 'lucide-react';

interface GamePassesProps {
  owned: GamePassesType;
  currency: number; // Studs (if we want to use studs for anything)
  gems: number;
  onBuy: (type: keyof GamePassesType, cost: number, currencyType: 'gems' | 'studs') => void;
}

interface GamePassCardProps {
  title: string;
  desc: string;
  price: number;
  id: keyof GamePassesType;
  owned: boolean;
  onBuy: (type: keyof GamePassesType, cost: number, currencyType: 'gems' | 'studs') => void;
  icon: React.ReactNode;
  color: 'yellow' | 'pink' | 'green' | 'purple' | 'red';
}

const GamePassCard: React.FC<GamePassCardProps> = ({ title, desc, price, id, owned, onBuy, icon, color }) => {
  const colorMap = {
    yellow: { bg: 'from-yellow-900/40 to-yellow-600/10', border: 'border-yellow-500/30', text: 'text-yellow-400', sub: 'text-yellow-200/70', btn: 'bg-yellow-600 hover:bg-yellow-500', btnBorder: 'border-yellow-800', iconBg: 'bg-yellow-500/20' },
    pink: { bg: 'from-pink-900/40 to-pink-600/10', border: 'border-pink-500/30', text: 'text-pink-400', sub: 'text-pink-200/70', btn: 'bg-pink-600 hover:bg-pink-500', btnBorder: 'border-pink-800', iconBg: 'bg-pink-500/20' },
    green: { bg: 'from-green-900/40 to-green-600/10', border: 'border-green-500/30', text: 'text-green-400', sub: 'text-green-200/70', btn: 'bg-green-600 hover:bg-green-500', btnBorder: 'border-green-800', iconBg: 'bg-green-500/20' },
    purple: { bg: 'from-purple-900/40 to-purple-600/10', border: 'border-purple-500/30', text: 'text-purple-400', sub: 'text-purple-200/70', btn: 'bg-purple-600 hover:bg-purple-500', btnBorder: 'border-purple-800', iconBg: 'bg-purple-500/20' },
    red: { bg: 'from-red-900/40 to-red-600/10', border: 'border-red-500/30', text: 'text-red-400', sub: 'text-red-200/70', btn: 'bg-red-600 hover:bg-red-500', btnBorder: 'border-red-800', iconBg: 'bg-red-500/20' },
  };

  const c = colorMap[color];

  return (
    <div className={`bg-gradient-to-br ${c.bg} border ${c.border} p-4 rounded-xl relative overflow-hidden group flex flex-col justify-between`}>
      <div className="flex justify-between items-start relative z-10">
        <div className="flex gap-4">
          <div className={`${c.iconBg} p-3 rounded-lg ${c.text} flex items-center justify-center h-14 w-14`}>
             {icon}
          </div>
          <div>
            <h3 className={`font-game text-xl ${c.text} font-bold`}>{title}</h3>
            <p className={`text-xs ${c.sub} mt-1 leading-tight`}>
              {desc}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
         {owned ? (
             <button disabled className="bg-gray-600 text-white px-6 py-2 rounded-lg font-bold font-game opacity-50 cursor-not-allowed w-full">
                 OWNED
             </button>
         ) : (
             <button 
                onClick={() => onBuy(id, price, 'gems')}
                className={`${c.btn} text-white px-6 py-2 rounded-lg font-bold font-game border-b-4 ${c.btnBorder} active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 w-full`}
             >
                 Buy <Gem size={14}/> {price.toLocaleString()}
             </button>
         )}
      </div>
    </div>
  );
};

export const GamePasses: React.FC<GamePassesProps> = ({ owned, gems, onBuy }) => {
  return (
    <div className="space-y-4">
      {/* V.I.P Section */}
      <GamePassCard 
        title="V.I.P Rank" 
        desc="Permanent 2x Currency Boost and golden chat tag." 
        price={500} 
        id="vip" 
        owned={owned.vip} 
        onBuy={onBuy} 
        icon={<Crown size={32} />} 
        color="yellow" 
      />

      {/* Luck Multipliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <GamePassCard 
            title="8x Luck" 
            desc="Boosts all clicks by 8x!" 
            price={2000} 
            id="luck8x" 
            owned={owned.luck8x} 
            onBuy={onBuy} 
            icon={<ShieldCheck size={32} />} 
            color="green" 
        />
        <GamePassCard 
            title="10x Server Luck" 
            desc="Boosts all clicks by 10x!" 
            price={1000} // Legacy price kept low as per prompt logic if desired, or can be increased.
            id="serverLuck" 
            owned={owned.serverLuck} 
            onBuy={onBuy} 
            icon={<Star size={32} />} 
            color="pink" 
        />
        <GamePassCard 
            title="15x Luck" 
            desc="Boosts all clicks by 15x!" 
            price={4500} 
            id="luck15x" 
            owned={owned.luck15x} 
            onBuy={onBuy} 
            icon={<Zap size={32} />} 
            color="purple" 
        />
        <GamePassCard 
            title="99x GOD Luck" 
            desc="UNREAL 99x BOOST! BECOME A GOD!" 
            price={1000000000} 
            id="luck99x" 
            owned={owned.luck99x} 
            onBuy={onBuy} 
            icon={<Flame size={32} />} 
            color="red" 
        />
      </div>
    </div>
  );
};