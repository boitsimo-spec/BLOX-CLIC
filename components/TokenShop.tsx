import React from 'react';
import { Coins, Gem, Tag, DollarSign, BrainCircuit } from 'lucide-react';

interface TokenShopProps {
    tokens: number;
    onBuyGems: (cost: number, amount: number) => void;
    onBuyTag: (cost: number, tag: string) => void;
    ownedTags: string[];
}

export const TokenShop: React.FC<TokenShopProps> = ({ tokens, onBuyGems, onBuyTag, ownedTags }) => {
    
    const gemPackages = [
        { gems: 1000, cost: 10 },
        { gems: 10000, cost: 80 },
        { gems: 100000, cost: 750 },
        { gems: 1000000, cost: 5000 },
        { gems: 100000000, cost: 250000 },
    ];

    return (
        <div className="animate-fade-in space-y-6">
            <div className="bg-yellow-900/20 p-4 rounded-xl border border-yellow-600/30 flex items-center justify-between">
                <div>
                    <h2 className="font-game font-bold text-yellow-500 uppercase">Token Shop</h2>
                    <p className="text-xs text-gray-400">Spend tokens earned from fighting bosses.</p>
                </div>
                <div className="bg-black/40 px-3 py-1 rounded-lg border border-yellow-500/50 flex items-center gap-2">
                    <Coins size={16} className="text-yellow-400" />
                    <span className="font-mono font-bold text-white">{tokens.toLocaleString()}</span>
                </div>
            </div>

            {/* GEM EXCHANGE */}
            <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1"><Gem size={12}/> Gem Exchange</h3>
                <div className="grid grid-cols-2 gap-2">
                    {gemPackages.map((pkg, i) => (
                        <button 
                            key={i}
                            onClick={() => onBuyGems(pkg.cost, pkg.gems)}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 flex flex-col items-center gap-1 active:scale-95 transition-transform"
                        >
                            <span className="text-cyan-400 font-bold text-sm">+{pkg.gems >= 1000000 ? (pkg.gems/1000000)+'M' : (pkg.gems/1000)+'k'} Gems</span>
                            <div className="bg-yellow-600/20 text-yellow-400 px-2 py-0.5 rounded text-xs font-mono font-bold flex items-center gap-1">
                                <Coins size={10} /> {pkg.cost.toLocaleString()}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* TAGS */}
            <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1"><Tag size={12}/> Special Tags</h3>
                <div className="space-y-2">
                    
                    {/* MoneySpender Tag */}
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-500/20 p-2 rounded text-green-400"><DollarSign size={20} /></div>
                            <div>
                                <div className="font-bold text-green-400 text-sm">MoneySpender</div>
                                <div className="text-[10px] text-gray-500">Show off your wealth in chat.</div>
                            </div>
                        </div>
                        {ownedTags.includes('MoneySpender') ? (
                            <button disabled className="text-gray-500 text-xs font-bold px-3 py-1">OWNED</button>
                        ) : (
                            <button 
                                onClick={() => onBuyTag(50000, 'MoneySpender')}
                                className="bg-yellow-600 hover:bg-yellow-500 text-white text-xs font-bold px-3 py-2 rounded-lg border-b-2 border-yellow-800 active:border-b-0 active:translate-y-[2px] flex items-center gap-1"
                            >
                                <Coins size={12} /> 50,000
                            </button>
                        )}
                    </div>

                    {/* Brainrot Tag */}
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-pink-500/20 p-2 rounded text-pink-400"><BrainCircuit size={20} /></div>
                            <div>
                                <div className="font-bold text-pink-500 text-sm">Brainrot</div>
                                <div className="text-[10px] text-gray-500">You are the Rizzler.</div>
                            </div>
                        </div>
                        {ownedTags.includes('Brainrot') ? (
                            <button disabled className="text-gray-500 text-xs font-bold px-3 py-1">OWNED</button>
                        ) : (
                            <button 
                                onClick={() => onBuyTag(10000, 'Brainrot')}
                                className="bg-yellow-600 hover:bg-yellow-500 text-white text-xs font-bold px-3 py-2 rounded-lg border-b-2 border-yellow-800 active:border-b-0 active:translate-y-[2px] flex items-center gap-1"
                            >
                                <Coins size={12} /> 10,000
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};