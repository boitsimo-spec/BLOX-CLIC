import React, { useState } from 'react';
import { ShieldAlert, Zap, Plus, Trash2, Clock, Gem, Megaphone, Skull, Ghost, Gift, Snowflake, Crown, Flame, Star, Biohazard } from 'lucide-react';
import { GameEvent } from '../types';

interface AdminPanelProps {
  onAddCurrency: (amount: number) => void;
  onAddGems: (amount: number) => void;
  onTriggerEvent: (event: Omit<GameEvent, 'id' | 'endTime'>) => void;
  onReset: () => void;
  onAnnounce: (text: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onAddCurrency, onAddGems, onTriggerEvent, onReset, onAnnounce }) => {
  const [amount, setAmount] = useState(100000);
  const [announceText, setAnnounceText] = useState('');
  const [activeTab, setActiveTab] = useState<'resources' | 'events' | 'abuse'>('resources');

  const handleAnnounce = () => {
      if(!announceText.trim()) return;
      onAnnounce(announceText);
      setAnnounceText('');
  };

  const triggerAllEvents = () => {
      onTriggerEvent({ name: '2x Studs Frenzy', type: 'currency', multiplier: 2, durationSeconds: 60 });
      onTriggerEvent({ name: '3x Luck Boost', type: 'luck', multiplier: 3, durationSeconds: 60 });
      onTriggerEvent({ name: '10x GEM RAIN', type: 'currency', multiplier: 10, durationSeconds: 30 });
      onTriggerEvent({ name: '☢️ RADIOACTIVE', type: 'currency', multiplier: 25, durationSeconds: 60 });
  };

  const triggerWinterEvent = () => {
      onTriggerEvent({ name: '❄️ WINTER BLIZZARD ❄️', type: 'currency', multiplier: 5, durationSeconds: 120 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="text-red-500" size={28} />
        <h2 className="text-2xl font-game font-bold text-red-500 uppercase tracking-widest">Panel Owner</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 bg-black/20 p-1 rounded-lg overflow-x-auto">
          {['resources', 'events', 'abuse'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-2 px-2 text-xs font-bold uppercase rounded whitespace-nowrap ${activeTab === tab ? 'bg-red-600 text-white' : 'bg-transparent text-gray-500 hover:text-white'}`}
              >
                  {tab}
              </button>
          ))}
      </div>

      {/* Resource Management */}
      {activeTab === 'resources' && (
        <div className="border border-red-900/30 bg-red-950/20 p-4 rounded-xl animate-fade-in">
            <h3 className="font-game font-bold uppercase tracking-wider text-red-400 mb-4">Resources</h3>
            <div className="space-y-2">
                <label className="text-xs text-gray-400 font-mono">Amount Value</label>
                <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded p-2 text-white font-mono text-sm"
                />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
                <button 
                    onClick={() => onAddCurrency(amount)}
                    className="bg-blue-900/50 hover:bg-blue-800/50 border border-blue-500/30 text-blue-200 p-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-colors"
                >
                    <Plus size={14} /> Add Studs
                </button>
                <button 
                    onClick={() => onAddGems(amount)}
                    className="bg-cyan-900/50 hover:bg-cyan-800/50 border border-cyan-500/30 text-cyan-200 p-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-colors"
                >
                    <Plus size={14} /> Add Gems
                </button>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
                <button 
                    onClick={() => onAddCurrency(1000000000)}
                    className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:brightness-110 text-white p-3 rounded-lg font-bold font-game flex items-center justify-center gap-2 shadow-lg"
                >
                    <Skull size={16} /> OWNER CLICK (+1B)
                </button>
            </div>
        </div>
      )}

      {/* Events Management */}
      {activeTab === 'events' && (
        <div className="border border-purple-900/30 bg-purple-950/20 p-4 rounded-xl animate-fade-in">
            <h3 className="font-game font-bold uppercase tracking-wider text-purple-400 mb-4">Server Events</h3>
            <div className="grid grid-cols-1 gap-2">
                
                {/* Standard Events */}
                <button 
                    onClick={() => onTriggerEvent({ name: '2x Studs Frenzy', type: 'currency', multiplier: 2, durationSeconds: 60 })}
                    className="w-full bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 text-yellow-200 p-2 rounded flex justify-between items-center"
                >
                    <span className="font-bold text-xs flex items-center gap-2"><Clock size={12}/> 2x Studs (60s)</span>
                </button>

                <button 
                    onClick={() => onTriggerEvent({ name: '3x Luck Boost', type: 'luck', multiplier: 3, durationSeconds: 60 })}
                    className="w-full bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 text-pink-200 p-2 rounded flex justify-between items-center"
                >
                    <span className="font-bold text-xs flex items-center gap-2"><Clock size={12}/> 3x Luck (60s)</span>
                </button>

                {/* SPECIAL EVENTS */}
                <div className="my-2 border-t border-white/10"></div>
                <h4 className="text-[10px] text-gray-500 uppercase font-bold mb-1">Boss & Special Events</h4>

                <button 
                    onClick={() => onTriggerEvent({ name: '99x GOD Luck', type: 'luck', multiplier: 99, durationSeconds: 60 })}
                    className="w-full bg-gradient-to-r from-red-600 to-black hover:from-red-500 hover:to-gray-900 border border-red-500 text-white p-2 rounded flex justify-between items-center shadow-lg"
                >
                    <span className="font-bold text-xs flex items-center gap-2"><Flame size={12}/> 99x GOD Luck (+1.8M/tap)</span>
                </button>

                <button 
                    onClick={() => onTriggerEvent({ name: '👑 OWNER BOSS', type: 'currency', multiplier: 500, durationSeconds: 45 })}
                    className="w-full bg-gradient-to-r from-yellow-700 to-yellow-900 hover:brightness-110 border border-yellow-500 text-white p-2 rounded flex justify-between items-center shadow-lg"
                >
                    <span className="font-bold text-xs flex items-center gap-2"><Crown size={12}/> OWNER BOSS (500x Studs)</span>
                </button>

                <button 
                    onClick={() => onTriggerEvent({ name: '🦍 YETI BOSS', type: 'currency', multiplier: 150, durationSeconds: 60 })}
                    className="w-full bg-gradient-to-r from-cyan-800 to-blue-900 hover:brightness-110 border border-cyan-500 text-white p-2 rounded flex justify-between items-center shadow-lg"
                >
                    <span className="font-bold text-xs flex items-center gap-2"><Snowflake size={12}/> YETI BOSS (150x Studs)</span>
                </button>
                
                <button 
                    onClick={() => onTriggerEvent({ name: '🎃 HALLOWEEN MUTATION', type: 'luck', multiplier: 66, durationSeconds: 120 })}
                    className="w-full bg-orange-900/40 hover:bg-orange-600/40 border border-orange-500/50 text-orange-300 p-2 rounded flex justify-between items-center"
                >
                    <span className="font-bold text-xs flex items-center gap-2"><Biohazard size={12}/> Halloween Mutation (66x Luck)</span>
                </button>

                <button 
                    onClick={() => onTriggerEvent({ name: '☢️ RADIOACTIVE', type: 'currency', multiplier: 25, durationSeconds: 60 })}
                    className="w-full bg-green-900/40 hover:bg-green-600/40 border border-green-500/50 text-green-300 p-2 rounded flex justify-between items-center"
                >
                    <span className="font-bold text-xs flex items-center gap-2"><Flame size={12}/> Radioactive (25x Studs)</span>
                </button>

                <button 
                    onClick={() => onTriggerEvent({ name: '🎅 SANTA IS HEREEE', type: 'currency', multiplier: 50, durationSeconds: 45 })}
                    className="w-full bg-red-600/20 hover:bg-red-600/40 border border-white/50 text-white p-2 rounded flex justify-between items-center"
                >
                    <span className="font-bold text-xs flex items-center gap-2"><Gift size={12}/> Santa Is Hereee (50x Studs)</span>
                </button>
            </div>
        </div>
      )}

      {/* ADMIN ABUSE */}
      {activeTab === 'abuse' && (
          <div className="border border-red-500 bg-red-950/40 p-4 rounded-xl animate-pulse-slow">
              <div className="flex items-center gap-2 text-red-400 mb-4 pb-2 border-b border-red-500/30">
                <Skull size={20} />
                <h3 className="font-game font-bold uppercase tracking-wider">ADMIN ABUSE</h3>
              </div>

              <div className="space-y-4">
                  <div>
                      <label className="text-xs text-red-300 font-bold mb-1 block">GLOBAL ANNOUNCE</label>
                      <div className="flex gap-2">
                          <input 
                              type="text" 
                              value={announceText}
                              onChange={(e) => setAnnounceText(e.target.value)}
                              placeholder="System Message..."
                              className="flex-1 bg-black/60 border border-red-500/30 rounded p-2 text-white font-mono text-sm"
                          />
                          <button 
                              onClick={handleAnnounce}
                              className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg font-bold"
                          >
                              <Megaphone size={16} />
                          </button>
                      </div>
                  </div>

                  <button 
                      onClick={triggerAllEvents}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-lg font-bold font-game flex justify-center items-center gap-2 border-b-4 border-purple-800 active:border-b-0 active:translate-y-1"
                  >
                      <Zap size={18} /> TRIGGER ALL EVENTS
                  </button>

                  <button 
                      onClick={triggerWinterEvent}
                      className="w-full bg-cyan-600 hover:bg-cyan-500 text-white p-3 rounded-lg font-bold font-game flex justify-center items-center gap-2 border-b-4 border-cyan-800 active:border-b-0 active:translate-y-1"
                  >
                      ❄️ START WINTER BLIZZARD ❄️
                  </button>
              </div>
          </div>
      )}

      <div className="pt-4 border-t border-red-900/30 mt-4">
          <button 
            onClick={() => {
                if(window.confirm('NUKE SAVE DATA? This cannot be undone.')) onReset();
            }}
            className="w-full bg-red-900/50 hover:bg-red-800 text-red-200 font-bold p-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-xs"
          >
              <Trash2 size={16} /> WIPE SAVE DATA
          </button>
      </div>
    </div>
  );
};