import React, { useState, useEffect } from 'react';
import { Skull, Sword, Timer, Coins } from 'lucide-react';

interface BossFightProps {
    clickPower: number;
    onReward: (tokens: number) => void;
}

interface Boss {
    id: number;
    name: string;
    hp: number;
    maxHp: number;
    reward: number;
    image: string;
    color: string;
}

const BOSSES: Boss[] = [
    { id: 1, name: "Noob King", hp: 1000, maxHp: 1000, reward: 10, image: "👑", color: "text-yellow-400" },
    { id: 2, name: "Slime Golem", hp: 5000, maxHp: 5000, reward: 50, image: "🦠", color: "text-green-400" },
    { id: 3, name: "Magma Lord", hp: 25000, maxHp: 25000, reward: 250, image: "🌋", color: "text-red-500" },
    { id: 4, name: "Void Guardian", hp: 100000, maxHp: 100000, reward: 1000, image: "🌑", color: "text-purple-500" },
    { id: 5, name: "Evil Santa", hp: 500000, maxHp: 500000, reward: 5000, image: "🎅", color: "text-red-600" }, // Festive Boss
];

export const BossFight: React.FC<BossFightProps> = ({ clickPower, onReward }) => {
    const [currentBossIndex, setCurrentBossIndex] = useState(0);
    const [currentHp, setCurrentHp] = useState(BOSSES[0].maxHp);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isActive, setIsActive] = useState(false);

    const boss = BOSSES[currentBossIndex];

    useEffect(() => {
        let interval: any;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            // Fail
            setIsActive(false);
            setCurrentHp(boss.maxHp);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, boss]);

    const handleAttack = () => {
        if (!isActive) return;
        
        const newHp = currentHp - clickPower;
        setCurrentHp(newHp);

        if (newHp <= 0) {
            // Victory
            setIsActive(false);
            onReward(boss.reward);
            // Move to next boss or loop
            if (currentBossIndex < BOSSES.length - 1) {
                setTimeout(() => {
                    const nextIndex = currentBossIndex + 1;
                    setCurrentBossIndex(nextIndex);
                    setCurrentHp(BOSSES[nextIndex].maxHp);
                    setTimeLeft(30);
                }, 1000);
            } else {
                // Loop back to start or stay on final boss (Looping for now)
                setTimeout(() => {
                    setCurrentBossIndex(0);
                    setCurrentHp(BOSSES[0].maxHp);
                    setTimeLeft(30);
                }, 1000);
            }
        }
    };

    const startFight = () => {
        setIsActive(true);
        setTimeLeft(30);
        setCurrentHp(boss.maxHp);
    };

    const hpPercent = Math.max(0, (currentHp / boss.maxHp) * 100);

    return (
        <div className="space-y-6 animate-fade-in text-center p-4">
            <h2 className="text-2xl font-game font-bold text-red-500 uppercase flex items-center justify-center gap-2">
                <Sword size={24} /> Boss Arena
            </h2>

            <div className="bg-white/5 p-6 rounded-2xl border-2 border-red-900/50 shadow-2xl relative overflow-hidden">
                {/* Boss Display */}
                <div className="relative z-10">
                    <div className={`text-6xl md:text-8xl mb-4 animate-bounce-slow transition-transform ${isActive ? 'scale-110' : ''}`}>
                        {boss.image}
                    </div>
                    <h3 className={`text-2xl font-game font-bold ${boss.color} mb-1`}>{boss.name}</h3>
                    <div className="text-gray-400 text-sm mb-4">Reward: {boss.reward} Tokens</div>

                    {/* HP Bar */}
                    <div className="w-full h-6 bg-black/60 rounded-full border border-white/20 relative overflow-hidden mb-2">
                        <div 
                            className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-100"
                            style={{ width: `${hpPercent}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white shadow-black drop-shadow-md">
                            {Math.max(0, currentHp).toLocaleString()} / {boss.maxHp.toLocaleString()}
                        </div>
                    </div>

                    {/* Timer */}
                    <div className={`flex items-center justify-center gap-1 font-mono font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-gray-300'}`}>
                        <Timer size={16} /> {timeLeft}s remaining
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 relative z-10">
                    {!isActive ? (
                        <div className="space-y-2">
                             {currentHp <= 0 ? (
                                 <div className="text-green-400 font-bold text-xl animate-bounce">VICTORY! +{boss.reward} Tokens</div>
                             ) : (
                                 <div className="text-red-400 font-bold mb-2">Ready to Fight?</div>
                             )}
                             <button 
                                onClick={startFight}
                                className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-game font-bold text-lg border-b-4 border-red-800 active:border-b-0 active:translate-y-1"
                            >
                                START BATTLE
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={handleAttack}
                            className="w-full bg-transparent active:scale-95 transition-transform"
                        >
                            <div className="bg-gradient-to-b from-gray-700 to-gray-800 border-4 border-gray-600 rounded-full h-32 w-32 flex items-center justify-center mx-auto shadow-xl group hover:border-red-500">
                                <Sword size={48} className="text-white group-hover:text-red-500" />
                            </div>
                            <div className="mt-2 text-sm text-gray-400 animate-pulse">TAP FAST!</div>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};