import React from 'react';
import { GameState, RankDefinition } from '../types';
import { User, Trophy, Gem, MousePointer2, Dog, Crown } from 'lucide-react';

interface PlayerStatsProps {
  gameState: GameState;
  currentRank: RankDefinition;
  nextRank?: RankDefinition;
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ gameState, currentRank, nextRank }) => {
  // Calculate progress to next rank
  let progressPercent = 100;
  if (nextRank) {
      const prevThreshold = currentRank.threshold;
      const targetThreshold = nextRank.threshold;
      const current = gameState.totalClicks;
      
      const totalRange = targetThreshold - prevThreshold;
      const currentProgress = current - prevThreshold;
      
      progressPercent = Math.min(100, Math.max(0, (currentProgress / totalRange) * 100));
  }

  return (
    <div className="space-y-4">
      {/* Rank Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 p-4 rounded-xl border border-blue-500/30">
        <div className="flex items-center gap-4 mb-3">
          <div className="h-14 w-14 bg-blue-600 rounded-full flex items-center justify-center text-2xl border-4 border-blue-400 shadow-lg relative">
            <User size={24} className="text-white"/>
            <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1 border-2 border-black">
                <Crown size={10} className="text-white" fill="currentColor"/>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-end">
                <div>
                    <div className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Current Rank</div>
                    <div className={`text-xl font-game font-bold ${currentRank.color} drop-shadow-md`}>{currentRank.name}</div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] text-gray-500 uppercase">Multiplier</div>
                    <div className="text-lg font-mono font-bold text-yellow-400">x{currentRank.multiplier}</div>
                </div>
            </div>
          </div>
        </div>

        {/* Rank Progress Bar */}
        {nextRank ? (
            <div>
                <div className="flex justify-between text-[10px] text-gray-400 mb-1 font-mono">
                    <span>{gameState.totalClicks.toLocaleString()}</span>
                    <span>{nextRank.threshold.toLocaleString()} Clicks for {nextRank.name}</span>
                </div>
                <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>
        ) : (
            <div className="text-center text-xs text-yellow-500 font-bold bg-yellow-500/10 py-1 rounded border border-yellow-500/20">
                MAX RANK ACHIEVED
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2">
        <StatRow icon={<MousePointer2 size={16} className="text-yellow-400"/>} label="Total Clicks" value={gameState.totalClicks.toLocaleString()} />
        <StatRow icon={<Trophy size={16} className="text-purple-400"/>} label="Rebirths" value={gameState.rebirths.toLocaleString()} />
        <StatRow icon={<Dog size={16} className="text-green-400"/>} label="Pets Collected" value={gameState.pets.length.toLocaleString()} />
        <StatRow icon={<Gem size={16} className="text-cyan-400"/>} label="Gems Earned" value={gameState.gems.toLocaleString()} />
      </div>

      <div className="bg-black/20 p-4 rounded-lg border border-white/5 mt-4">
        <h4 className="font-game text-sm text-gray-400 mb-2">Active Multipliers</h4>
        <div className="space-y-1 text-xs font-mono text-gray-300">
           <div className="flex justify-between">
              <span>Rank Bonus:</span>
              <span className={currentRank.color}>x{currentRank.multiplier.toFixed(1)}</span>
           </div>
           <div className="flex justify-between">
              <span>Rebirth Mult:</span>
              <span className="text-green-400">x{((gameState.rebirths * 0.5) + 1).toFixed(1)}</span>
           </div>
           <div className="flex justify-between">
              <span>Pet Mult:</span>
              <span className="text-green-400">x{(gameState.pets.reduce((a, b) => a + b.multiplier, 0) || 1).toFixed(1)}</span>
           </div>
           {gameState.gamepasses.vip && (
               <div className="flex justify-between">
                  <span className="text-yellow-400">VIP Bonus:</span>
                  <span className="text-yellow-400">x2.0</span>
               </div>
           )}
           {gameState.gamepasses.serverLuck && (
               <div className="flex justify-between">
                  <span className="text-pink-400">Server Luck:</span>
                  <span className="text-pink-400">x10.0</span>
               </div>
           )}
           {gameState.gamepasses.luck8x && (
               <div className="flex justify-between">
                  <span className="text-green-400">8x Luck:</span>
                  <span className="text-green-400">x8.0</span>
               </div>
           )}
           {gameState.gamepasses.luck15x && (
               <div className="flex justify-between">
                  <span className="text-purple-400">15x Luck:</span>
                  <span className="text-purple-400">x15.0</span>
               </div>
           )}
           {gameState.gamepasses.luck99x && (
               <div className="flex justify-between">
                  <span className="text-red-500 font-bold">99x GOD Luck:</span>
                  <span className="text-red-500 font-bold">x99.0</span>
               </div>
           )}
        </div>
      </div>
    </div>
  );
};

const StatRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm font-medium text-gray-300">{label}</span>
    </div>
    <span className="font-mono font-bold text-white">{value}</span>
  </div>
);