import React from 'react';
import { GameState } from '../types';
import { Trophy, Check, Lock, Gem } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  reward: number; // Gems
  progress: (state: GameState) => number;
  target: number;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'clicks_100',
    title: 'Finger Warmer',
    description: 'Reach 100 Total Clicks',
    reward: 50,
    target: 100,
    progress: (s) => s.totalClicks
  },
  {
    id: 'clicks_1000',
    title: 'Clicking Novice',
    description: 'Reach 1,000 Total Clicks',
    reward: 150,
    target: 1000,
    progress: (s) => s.totalClicks
  },
  {
    id: 'clicks_10k',
    title: 'Carpal Tunnel',
    description: 'Reach 10,000 Total Clicks',
    reward: 500,
    target: 10000,
    progress: (s) => s.totalClicks
  },
  {
    id: 'pets_5',
    title: 'Pet Collector',
    description: 'Collect 5 Pets',
    reward: 200,
    target: 5,
    progress: (s) => s.pets.length
  },
  {
    id: 'rebirth_1',
    title: 'New Beginnings',
    description: 'Rebirth for the first time',
    reward: 1000,
    target: 1,
    progress: (s) => s.rebirths
  }
];

interface ProgressTabProps {
  gameState: GameState;
  onClaim: (id: string, reward: number) => void;
}

export const ProgressTab: React.FC<ProgressTabProps> = ({ gameState, onClaim }) => {
  // Sort: Unclaimed & Completed -> In Progress -> Claimed
  const sortedAchievements = [...ACHIEVEMENTS].sort((a, b) => {
    const isClaimedA = gameState.claimedAchievementIds.includes(a.id);
    const isClaimedB = gameState.claimedAchievementIds.includes(b.id);
    
    if (isClaimedA && !isClaimedB) return 1;
    if (!isClaimedA && isClaimedB) return -1;
    
    const isCompletedA = a.progress(gameState) >= a.target;
    const isCompletedB = b.progress(gameState) >= b.target;

    if (isCompletedA && !isCompletedB) return -1;
    if (!isCompletedA && isCompletedB) return 1;

    return 0;
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-game text-gray-400 uppercase text-xs tracking-wider">Achievements</h3>
        <div className="text-xs text-blue-400 bg-blue-900/20 px-2 py-1 rounded">
          {gameState.claimedAchievementIds.length} / {ACHIEVEMENTS.length}
        </div>
      </div>

      {sortedAchievements.map((ach) => {
        const current = ach.progress(gameState);
        const percent = Math.min(100, (current / ach.target) * 100);
        const isCompleted = current >= ach.target;
        const isClaimed = gameState.claimedAchievementIds.includes(ach.id);

        return (
          <div key={ach.id} className={`relative p-3 rounded-xl border border-white/5 transition-all ${isClaimed ? 'bg-white/5 opacity-60' : 'bg-white/5 hover:bg-white/10'}`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isCompleted ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-800 text-gray-500'}`}>
                  {isClaimed ? <Check size={20} /> : <Trophy size={20} />}
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-200">{ach.title}</div>
                  <div className="text-xs text-gray-500">{ach.description}</div>
                </div>
              </div>
              
              {isClaimed ? (
                 <span className="text-xs font-bold text-green-500 flex items-center gap-1"><Check size={12}/> CLAIMED</span>
              ) : isCompleted ? (
                 <button 
                    onClick={() => onClaim(ach.id, ach.reward)}
                    className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded animate-bounce-click shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                 >
                    CLAIM <span className="ml-1 text-yellow-300">+{ach.reward} 💎</span>
                 </button>
              ) : (
                <div className="flex items-center gap-1 text-xs text-gray-500 bg-black/30 px-2 py-1 rounded">
                    <Lock size={10} /> {Math.floor(percent)}%
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`} 
                    style={{ width: `${percent}%` }}
                />
            </div>
            <div className="flex justify-between mt-1">
                <span className="text-[10px] text-gray-500 font-mono">{current.toLocaleString()} / {ach.target.toLocaleString()}</span>
                {!isClaimed && !isCompleted && <span className="text-[10px] text-yellow-400 font-mono">Reward: {ach.reward} Gems</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};