import React, { useMemo } from 'react';
import { Crown, Medal, User, Shield, Gem, MousePointer2, DollarSign } from 'lucide-react';

interface LeaderboardProps {
  currentUsername?: string;
  currentClicks: number;
  currentGems: number;
  currentStuds: number;
}

interface RankEntry {
  rank: number;
  name: string;
  studs: number;
  gems: number;
  clicks: number;
  isUser: boolean;
  tags?: string[];
}

// Simulated High Scores with more data
const MOCK_LEADERS = [
  { name: "builderman", studs: 1500000000, gems: 500000, clicks: 2000000, tags: ['DEV'] },
  { name: "ClickGod_99", studs: 500000000, gems: 25000, clicks: 800000, tags: ['VIP'] },
  { name: "NoobSlayer", studs: 250000000, gems: 10000, clicks: 450000, tags: [] },
  { name: "Luna_Starlight", studs: 100000000, gems: 5000, clicks: 200000, tags: ['VIP'] },
  { name: "Guest 666", studs: 50000000, gems: 1000, clicks: 150000, tags: [] },
  { name: "BaconHairWarrior", studs: 10000000, gems: 500, clicks: 50000, tags: [] },
  { name: "HappyMeal", studs: 5000000, gems: 100, clicks: 25000, tags: [] },
  { name: "Robloxian_1", studs: 100000, gems: 0, clicks: 1000, tags: [] },
];

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentUsername, currentClicks, currentGems, currentStuds }) => {
  
  const rankings: RankEntry[] = useMemo(() => {
    // Combine mock data with current user
    const userEntry = {
      name: currentUsername || "You (Guest)",
      studs: currentStuds,
      gems: currentGems,
      clicks: currentClicks,
      isUser: true,
      tags: []
    };

    const all = [...MOCK_LEADERS.map(l => ({ ...l, isUser: false })), userEntry];
    
    // Sort by Studs (Money) descending
    return all.sort((a, b) => b.studs - a.studs).map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  }, [currentUsername, currentClicks, currentGems, currentStuds]);

  const getRankStyle = (rank: number) => {
    switch(rank) {
      case 1: return "bg-yellow-500/20 border-yellow-500 text-yellow-400";
      case 2: return "bg-gray-400/20 border-gray-400 text-gray-300";
      case 3: return "bg-orange-700/20 border-orange-700 text-orange-400";
      default: return "bg-white/5 border-white/5 text-white";
    }
  };

  const getIcon = (rank: number) => {
    switch(rank) {
      case 1: return <Crown size={20} fill="currentColor" />;
      case 2: return <Medal size={20} />;
      case 3: return <Medal size={20} />;
      default: return <span className="font-mono font-bold text-gray-500">#{rank}</span>;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-gradient-to-r from-yellow-900/40 to-black p-4 rounded-xl border border-yellow-500/20 mb-6">
        <h3 className="font-game text-xl text-yellow-500 uppercase tracking-widest flex items-center gap-2">
            <Crown size={24} /> Global Elite
        </h3>
        <p className="text-xs text-gray-400">Richest players in the multiverse.</p>
      </div>

      <div className="space-y-2">
        {rankings.map((entry) => (
          <div 
            key={entry.name}
            className={`relative flex flex-col p-3 rounded-lg border ${getRankStyle(entry.rank)} ${entry.isUser ? 'ring-2 ring-blue-500 bg-blue-900/20 transform scale-[1.02] transition-transform' : ''}`}
          >
            {/* Top Row: Rank & Name */}
            <div className="flex items-center gap-3 mb-2 pb-2 border-b border-white/5">
                <div className="w-8 flex justify-center font-bold text-lg">
                    {getIcon(entry.rank)}
                </div>
                <div className="flex items-center gap-2">
                    <span className={`font-bold ${entry.isUser ? 'text-white' : ''}`}>{entry.name}</span>
                    {entry.tags?.includes('DEV') && <span className="bg-red-500 text-black text-[9px] px-1 rounded font-bold">DEV</span>}
                    {entry.tags?.includes('VIP') && <span className="bg-yellow-500 text-black text-[9px] px-1 rounded font-bold">VIP</span>}
                    {entry.isUser && <span className="bg-blue-500 text-white text-[9px] px-1 rounded font-bold">YOU</span>}
                </div>
            </div>

            {/* Bottom Row: Stats Grid */}
            <div className="grid grid-cols-3 gap-2 text-[10px] uppercase font-bold tracking-wide">
                
                {/* Money / Studs */}
                <div className="bg-black/40 rounded p-1.5 flex flex-col items-center border border-blue-500/20">
                    <span className="text-blue-400 flex items-center gap-1 mb-0.5"><DollarSign size={10} /> Studs</span>
                    <span className="text-white font-mono text-xs">{formatNumber(entry.studs)}</span>
                </div>

                {/* Gems */}
                <div className="bg-black/40 rounded p-1.5 flex flex-col items-center border border-cyan-500/20">
                    <span className="text-cyan-400 flex items-center gap-1 mb-0.5"><Gem size={10} /> Gems</span>
                    <span className="text-white font-mono text-xs">{formatNumber(entry.gems)}</span>
                </div>

                {/* Clicks */}
                <div className="bg-black/40 rounded p-1.5 flex flex-col items-center border border-gray-500/20">
                    <span className="text-gray-400 flex items-center gap-1 mb-0.5"><MousePointer2 size={10} /> Clicks</span>
                    <span className="text-white font-mono text-xs">{formatNumber(entry.clicks)}</span>
                </div>

            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-[10px] text-gray-600">Leaderboard updates in real-time</p>
      </div>
    </div>
  );
};