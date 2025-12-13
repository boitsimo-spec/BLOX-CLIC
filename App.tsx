import React, { useState, useEffect, useMemo } from 'react';
import { GameState, Upgrade, Pet, GamePasses as GamePassesType, GameEvent, RankDefinition, ChatMessage } from './types';
import { ChatBox } from './components/ChatBox';
import { generatePet } from './services/geminiService';
import { PetCard } from './components/PetCard';
import { PlayerStats } from './components/PlayerStats';
import { GamePasses } from './components/GamePasses';
import { AdminPanel } from './components/AdminPanel';
import { ProgressTab } from './components/ProgressTab';
import { UsernameModal } from './components/UsernameModal';
import { Zap, ShoppingCart, Award, MousePointer2, Skull, MessageSquare, Shield, Gem, User, Save, ListTodo, Timer, Snowflake, Trophy, Megaphone, Settings, Key, LogOut } from 'lucide-react';

const INITIAL_UPGRADES: Upgrade[] = [
  { id: 'click1', name: 'Stronger Click', baseCost: 15, costMultiplier: 1.5, powerIncrease: 1, count: 0, type: 'click', icon: '👆' },
  { id: 'auto1', name: 'Noob Auto Clicker', baseCost: 50, costMultiplier: 1.4, powerIncrease: 1, count: 0, type: 'auto', icon: '🤖' },
  { id: 'click2', name: 'Super Gloves', baseCost: 250, costMultiplier: 1.6, powerIncrease: 5, count: 0, type: 'click', icon: '🥊' },
  { id: 'auto2', name: 'Pro Auto Clicker', baseCost: 1000, costMultiplier: 1.5, powerIncrease: 10, count: 0, type: 'auto', icon: '👨‍💻' },
  { id: 'click3', name: 'Godly Touch', baseCost: 5000, costMultiplier: 1.8, powerIncrease: 25, count: 0, type: 'click', icon: '⚡' },
];

const INITIAL_GAMEPASSES: GamePassesType = {
    vip: false,
    serverLuck: false,
    luck8x: false,
    luck15x: false,
    luck99x: false
};

const INITIAL_GAME_STATE: GameState = {
  username: undefined,
  password: undefined,
  isAdmin: false,
  currency: 0,
  gems: 0,
  rebirths: 0,
  clickPower: 1,
  autoPower: 0,
  pets: [],
  upgrades: INITIAL_UPGRADES,
  totalClicks: 0,
  gamepasses: INITIAL_GAMEPASSES,
  activeEvents: [],
  claimedAchievementIds: []
};

const SAVE_KEY = 'bloxSim_save_v1';

const RANKS: RankDefinition[] = [
  { name: "Noob", threshold: 0, multiplier: 1, color: "text-gray-400" },
  { name: "Beginner", threshold: 1000, multiplier: 1.25, color: "text-green-400" },
  { name: "Pro", threshold: 10000, multiplier: 1.5, color: "text-blue-400" },
  { name: "Elite", threshold: 50000, multiplier: 2, color: "text-purple-400" },
  { name: "Hacker", threshold: 250000, multiplier: 3.5, color: "text-red-400" },
  { name: "God", threshold: 1000000, multiplier: 5, color: "text-yellow-400" },
  { name: "Developer", threshold: 10000000, multiplier: 10, color: "text-cyan-400" },
];

type TabType = 'upgrades' | 'pets' | 'eggs' | 'player' | 'progress' | 'gamepasses' | 'chat' | 'admin' | 'settings';

export default function App() {
  // Game State with Load Logic
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Intelligent Merge:
        const mergedUpgrades = INITIAL_UPGRADES.map(baseUpgrade => {
          const savedUpgrade = parsed.upgrades?.find((u: Upgrade) => u.id === baseUpgrade.id);
          return savedUpgrade ? { ...baseUpgrade, count: savedUpgrade.count } : baseUpgrade;
        });

        const mergedGamepasses = { ...INITIAL_GAMEPASSES, ...(parsed.gamepasses || {}) };

        return {
          ...INITIAL_GAME_STATE,
          ...parsed,
          upgrades: mergedUpgrades,
          gamepasses: mergedGamepasses,
          pets: Array.isArray(parsed.pets) ? parsed.pets : [],
          activeEvents: parsed.activeEvents || [],
          claimedAchievementIds: parsed.claimedAchievementIds || []
        };
      }
    } catch (e) {
      console.error("Failed to load save data:", e);
    }
    return INITIAL_GAME_STATE;
  });

  const [notifications, setNotifications] = useState<{id: string, text: string, color: string}[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('upgrades');
  const [isHatching, setIsHatching] = useState(false);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [authCode, setAuthCode] = useState('');
  
  // Chat State lifted to App
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'System', text: 'Welcome to Blox Clicker Sim! Click to gain Studs.', isSystem: true }
  ]);

  // Generate Snowflakes only once
  const snowflakes = useMemo(() => Array.from({ length: 40 }).map((_, i) => (
    <div 
      key={i} 
      className="snowflake" 
      style={{
        left: `${Math.random() * 100}vw`,
        animationDuration: `${Math.random() * 5 + 5}s`,
        animationDelay: `-${Math.random() * 5}s`,
        opacity: Math.random() * 0.5 + 0.2,
        fontSize: `${Math.random() * 14 + 10}px`
      }}
    >❄</div>
  )), []);

  // Autosave Effect
  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  // Event Expiration Loop
  useEffect(() => {
    if (gameState.activeEvents.length === 0) return;
    const interval = setInterval(() => {
        const now = Date.now();
        setGameState(prev => ({
            ...prev,
            activeEvents: prev.activeEvents.filter(e => e.endTime > now)
        }));
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState.activeEvents.length]);

  // Calculate Rank (Memoized)
  const currentRank = useMemo(() => {
    return [...RANKS].reverse().find(r => gameState.totalClicks >= r.threshold) || RANKS[0];
  }, [gameState.totalClicks]);

  const nextRank = useMemo(() => {
    return RANKS.find(r => r.threshold > gameState.totalClicks);
  }, [gameState.totalClicks]);

  // Calculate Multipliers
  const petMultiplier = gameState.pets.reduce((acc, pet) => acc + pet.multiplier, 0) || 1;
  const rebirthMultiplier = (gameState.rebirths * 0.5) + 1;
  
  const gamepassMultiplier = (gameState.gamepasses.vip ? 2 : 1) * 
                             (gameState.gamepasses.serverLuck ? 10 : 1) *
                             (gameState.gamepasses.luck8x ? 8 : 1) *
                             (gameState.gamepasses.luck15x ? 15 : 1) *
                             (gameState.gamepasses.luck99x ? 99 : 1);

  const rankMultiplier = currentRank.multiplier;
  
  // Calculate Event Multipliers
  const eventCurrencyMult = gameState.activeEvents
    .filter(e => e.type === 'currency')
    .reduce((acc, e) => acc * e.multiplier, 1);

  const eventLuckMult = gameState.activeEvents
    .filter(e => e.type === 'luck')
    .reduce((acc, e) => acc * e.multiplier, 1);

  const totalLuckMultiplier = gamepassMultiplier * eventLuckMult;

  // --- SPECIAL EVENT LOGIC ---
  const isGodLuckEventActive = gameState.activeEvents.some(e => e.name === '99x GOD Luck');
  
  // 99x GOD Luck logic: Adds 1,800,000 to CLICK power per tap
  const godLuckClickBonus = isGodLuckEventActive ? 1800000 : 0;
  
  const totalMultiplier = petMultiplier * rebirthMultiplier * gamepassMultiplier * eventCurrencyMult * rankMultiplier;
  
  const currentClickPower = Math.floor(gameState.clickPower * totalMultiplier) + godLuckClickBonus;
  const currentAutoPower = Math.floor(gameState.autoPower * totalMultiplier);

  // Auto Clicker Loop
  useEffect(() => {
    if (currentAutoPower === 0) return; 

    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        currency: prev.currency + currentAutoPower
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentAutoPower]);

  // Handle Main Click
  const handleClick = () => {
    setGameState(prev => ({
      ...prev,
      currency: prev.currency + currentClickPower,
      totalClicks: prev.totalClicks + 1
    }));
    spawnFloatingText(currentClickPower);
  };

  const spawnFloatingText = (amount: number) => {
    const id = Date.now().toString() + Math.random();
    setNotifications(prev => [...prev, { id, text: `+${amount}`, color: 'text-green-400' }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 800);
  };

  const notify = (text: string, color: string = 'text-white') => {
    const id = Date.now().toString() + Math.random();
    setNotifications(prev => [...prev, { id, text, color }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const buyUpgrade = (upgradeId: string) => {
    setGameState(prev => {
      const upgradeIndex = prev.upgrades.findIndex(u => u.id === upgradeId);
      if (upgradeIndex === -1) return prev;

      const upgrade = prev.upgrades[upgradeIndex];
      const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.count));

      if (prev.currency < cost) {
        notify("Not enough Studs!", "text-red-500");
        return prev;
      }

      const newUpgrades = [...prev.upgrades];
      newUpgrades[upgradeIndex] = { ...upgrade, count: upgrade.count + 1 };

      const newClickPower = upgrade.type === 'click' ? prev.clickPower + upgrade.powerIncrease : prev.clickPower;
      const newAutoPower = upgrade.type === 'auto' ? prev.autoPower + upgrade.powerIncrease : prev.autoPower;

      notify(`Bought ${upgrade.name}!`);

      return {
        ...prev,
        currency: prev.currency - cost,
        upgrades: newUpgrades,
        clickPower: newClickPower,
        autoPower: newAutoPower
      };
    });
  };

  const hatchEgg = async (tier: 'Basic' | 'Golden' | 'Diamond' | 'Winter', cost: number, currencyType: 'studs' | 'gems') => {
    const balance = currencyType === 'studs' ? gameState.currency : gameState.gems;
    
    if (balance < cost) {
      notify(`Not enough ${currencyType}!`, "text-red-500");
      return;
    }
    if (isHatching) return;

    setIsHatching(true);
    setGameState(prev => ({ 
        ...prev, 
        currency: currencyType === 'studs' ? prev.currency - cost : prev.currency,
        gems: currencyType === 'gems' ? prev.gems - cost : prev.gems 
    }));
    
    notify(`Hatching egg... (Luck: x${totalLuckMultiplier.toFixed(1)})`, "text-yellow-400");

    try {
      // Pass the luck multiplier to generatePet
      const petData = await generatePet(tier, totalLuckMultiplier);
      const newPet: Pet = {
        ...petData,
        id: Date.now().toString()
      };

      setGameState(prev => ({
        ...prev,
        pets: [...prev.pets, newPet]
      }));

      notify(`Hatched ${newPet.name} (${newPet.rarity})!`, "text-pink-400");
    } catch (e) {
      notify("Egg fizzled out...", "text-gray-400");
    } finally {
      setIsHatching(false);
    }
  };

  const doRebirth = () => {
    const rebirthCost = 1000000 * (gameState.rebirths + 1);
    if (gameState.currency < rebirthCost) {
      notify(`Need ${rebirthCost.toLocaleString()} Studs to Rebirth`, "text-red-500");
      return;
    }

    if (!window.confirm("Are you sure? This resets stats but gives a Multiplier + GEMS!")) return;

    const gemsEarned = (gameState.rebirths + 1) * 100;

    setGameState(prev => ({
      ...prev,
      currency: 0,
      gems: prev.gems + gemsEarned,
      clickPower: 1,
      autoPower: 0,
      upgrades: INITIAL_UPGRADES, // Upgrades reset on rebirth
      totalClicks: 0,
      rebirths: prev.rebirths + 1,
    }));
    notify(`REBIRTH! +${gemsEarned} Gems!`, "text-cyan-400");
  };

  const buyGamepass = (type: keyof GamePassesType, cost: number, currencyType: 'gems' | 'studs') => {
      const currentFunds = currencyType === 'gems' ? gameState.gems : gameState.currency;
      if (currentFunds < cost) {
          notify(`Not enough ${currencyType}!`, "text-red-500");
          return;
      }

      setGameState(prev => ({
          ...prev,
          gems: currencyType === 'gems' ? prev.gems - cost : prev.gems,
          currency: currencyType === 'studs' ? prev.currency - cost : prev.currency,
          gamepasses: {
              ...prev.gamepasses,
              [type]: true
          }
      }));
      notify(`PURCHASE SUCCESSFUL!`, "text-green-400");
  };

  // --- NEW FEATURES ---
  const handleLogin = (name: string, pass: string) => {
    setGameState(prev => ({ ...prev, username: name, password: pass }));
    notify(`Welcome back, ${name}!`);
  };

  const handleAuthorize = () => {
      if (authCode.toLowerCase() === 'admin' || authCode === 'owner123') {
          setGameState(prev => ({ ...prev, isAdmin: true }));
          notify("AUTHORIZATION GRANTED: Owner Mode Active", "text-red-500");
          setAuthCode('');
      } else {
          notify("ACCESS DENIED: Invalid Key", "text-red-500");
      }
  };

  const handleLogout = () => {
      if(window.confirm("Are you sure you want to log out?")) {
        setGameState(prev => ({ ...prev, username: undefined, password: undefined, isAdmin: false }));
        window.location.reload();
      }
  };

  const handleClaimAchievement = (id: string, reward: number) => {
    setGameState(prev => ({
      ...prev,
      gems: prev.gems + reward,
      claimedAchievementIds: [...prev.claimedAchievementIds, id]
    }));
    notify(`Achievement Claimed! +${reward} Gems`, "text-cyan-400");
  };

  const addChatMessage = (msg: ChatMessage) => {
      setChatMessages(prev => [...prev, msg].slice(-50));
  };

  // --- ADMIN FUNCTIONS ---
  const adminAddCurrency = (amount: number) => {
      setGameState(prev => ({ ...prev, currency: prev.currency + amount }));
      notify(`ADMIN: Added ${amount} Studs`, "text-red-400");
  };
  const adminAddGems = (amount: number) => {
      setGameState(prev => ({ ...prev, gems: prev.gems + amount }));
      notify(`ADMIN: Added ${amount} Gems`, "text-cyan-400");
  };
  const adminTriggerEvent = (eventData: Omit<GameEvent, 'id' | 'endTime'>) => {
      const newEvent: GameEvent = {
          ...eventData,
          id: Date.now().toString(),
          endTime: Date.now() + (eventData.durationSeconds * 1000)
      };
      setGameState(prev => ({
          ...prev,
          activeEvents: [...prev.activeEvents, newEvent]
      }));
      notify(`EVENT STARTED: ${eventData.name}`, "text-purple-400");
  };
  const adminReset = () => {
      localStorage.removeItem(SAVE_KEY);
      window.location.reload(); // Hard reload to clear everything including state
  };
  const adminAnnounce = (text: string) => {
      addChatMessage({
          id: Date.now().toString() + 'ann',
          user: 'SYSTEM',
          text: text,
          isSystem: true
      });
      // Show Visual Banner
      setAnnouncement(text);
      // Hide after 6 seconds
      setTimeout(() => setAnnouncement(null), 6000);
      
      notify("ANNOUNCEMENT SENT", "text-red-500");
  };

  // Dynamic Context string for AI Chat
  const activeEventNames = gameState.activeEvents.map(e => e.name).join(", ");
  const chatContext = `User ${gameState.username || 'Guest'} is ${currentRank.name} rank. Active Events: ${activeEventNames || 'None'}. Winter Event is ACTIVE!`;

  return (
    <div className="min-h-screen bg-[#111] text-white font-sans selection:bg-blue-500 selection:text-white flex flex-col md:flex-row overflow-hidden relative">
      
      {/* SNOW OVERLAY */}
      {snowflakes}
      
      {/* GLOBAL ANNOUNCEMENT BANNER */}
      {announcement && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[200] w-[90%] max-w-3xl pointer-events-none">
            <div className="bg-gradient-to-r from-red-900/95 to-red-800/95 border-4 border-red-500 rounded-xl p-4 shadow-[0_0_50px_rgba(220,38,38,0.8)] backdrop-blur text-center animate-slide-down relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-80"></div>
                 <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 mb-1">
                        <Megaphone size={24} className="text-red-200 animate-pulse" />
                        <h2 className="text-xl font-game font-bold text-red-200 uppercase tracking-[0.2em] drop-shadow-lg">Global Announcement</h2>
                        <Megaphone size={24} className="text-red-200 animate-pulse scale-x-[-1]" />
                    </div>
                    <p className="text-2xl md:text-3xl font-bold text-white leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-game break-words w-full">
                        {announcement}
                    </p>
                 </div>
            </div>
        </div>
      )}

      {/* USERNAME MODAL (LOGIN) */}
      {!gameState.username && <UsernameModal onSubmit={handleLogin} />}

      {/* LEFT PANEL - GAME INTERACTION */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center relative bg-gradient-to-b from-slate-900 via-[#1a1a2e] to-[#0f172a]">
        
        {/* Header Stats */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 pointer-events-none">
            <div className="flex flex-col gap-2 pointer-events-auto">
                <div className="flex gap-2">
                    <div className="bg-black/50 backdrop-blur rounded-lg p-2 px-3 border border-white/10 shadow-lg flex items-center gap-2">
                        <Skull size={16} className="text-purple-400" /> 
                        <div>
                            <div className="text-[10px] text-gray-400 uppercase leading-none">Rebirths</div>
                            <div className="text-sm font-bold">{gameState.rebirths}</div>
                        </div>
                    </div>
                    <div className="bg-black/50 backdrop-blur rounded-lg p-2 px-3 border border-white/10 shadow-lg flex items-center gap-2">
                        <Gem size={16} className="text-cyan-400" /> 
                        <div>
                            <div className="text-[10px] text-gray-400 uppercase leading-none">Gems</div>
                            <div className="text-sm font-bold text-cyan-200">{gameState.gems.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
                
                {/* Active Events Display */}
                {gameState.activeEvents.map(event => (
                    <div key={event.id} className="bg-gradient-to-r from-purple-900/80 to-pink-900/80 p-2 rounded-lg border border-purple-500/50 flex items-center gap-2 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                        <Timer size={14} className="text-white" />
                        <div>
                            <div className="text-[10px] font-bold text-white uppercase leading-none">{event.name}</div>
                            <div className="text-[10px] text-purple-200">{Math.ceil((event.endTime - Date.now()) / 1000)}s remaining</div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="flex flex-col items-end gap-2 pointer-events-auto">
                <div className="bg-black/50 backdrop-blur rounded px-3 py-1 border border-white/10 text-xs font-bold text-gray-400 flex items-center gap-2">
                    {gameState.isAdmin && <Shield size={12} className="text-red-500" />}
                    {gameState.username || 'Guest'}
                </div>
                <button 
                    onClick={doRebirth}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2 px-4 rounded border-b-4 border-purple-800 active:border-b-0 active:translate-y-1 transition-all"
                >
                    REBIRTH
                </button>
            </div>
        </div>

        {/* Floating Notifications */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 pointer-events-none z-50 w-full flex flex-col items-center">
           {notifications.map(n => (
             <div key={n.id} className={`font-game text-3xl font-bold animate-bounce-click ${n.color} drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] my-1`}>
               {n.text}
             </div>
           ))}
        </div>

        {/* Winter Badge */}
        <div className="mb-4 z-10 flex items-center gap-2 bg-blue-500/20 border border-blue-400/50 px-4 py-1 rounded-full animate-pulse">
            <Snowflake size={16} className="text-cyan-300" />
            <span className="font-game font-bold text-cyan-200 text-sm tracking-widest">WINTER UPDATE</span>
            <Snowflake size={16} className="text-cyan-300" />
        </div>

        {/* Currency Display */}
        <div className="mb-12 text-center z-10 select-none">
          <h1 className="text-5xl md:text-7xl font-game font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 drop-shadow-sm">
            {gameState.currency.toLocaleString()}
          </h1>
          <p className="text-blue-200/60 font-bold tracking-widest uppercase mt-2 text-sm">Blox Studs</p>
          <div className="flex gap-4 justify-center mt-2 text-xs text-gray-500 font-mono">
             <span className={eventCurrencyMult > 1 || godLuckClickBonus > 0 ? "text-yellow-400 font-bold" : ""}>Click: {currentClickPower.toLocaleString()}/tap</span>
             <span className={eventCurrencyMult > 1 ? "text-yellow-400 font-bold" : ""}>Auto: {currentAutoPower.toLocaleString()}/sec</span>
          </div>
        </div>

        {/* THE BIG BUTTON */}
        <button 
            onClick={handleClick}
            className="group relative w-64 h-64 md:w-80 md:h-80 transition-transform active:scale-95 focus:outline-none z-10"
        >
            <div className="absolute inset-0 bg-blue-600 rounded-3xl transform rotate-3 opacity-30 group-hover:rotate-6 transition-transform"></div>
            <div className="absolute inset-0 bg-blue-600 rounded-3xl transform -rotate-3 opacity-30 group-hover:-rotate-6 transition-transform"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl shadow-[0_10px_0_rgb(30,58,138)] active:shadow-none active:translate-y-[10px] border-4 border-blue-300 flex items-center justify-center transition-all overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/snow.png')] opacity-30"></div>
                <MousePointer2 size={80} className="text-white drop-shadow-lg relative z-10" />
            </div>
        </button>
        
        <div className="absolute bottom-4 text-center z-10">
            <div className={`font-game text-sm ${currentRank.color} font-bold flex items-center gap-2 justify-center bg-black/50 px-3 py-1 rounded-full border border-white/10`}>
                <Trophy size={14} /> 
                {currentRank.name} 
                <span className="text-gray-500 text-xs">(x{currentRank.multiplier})</span>
            </div>
        </div>
      </div>

      {/* RIGHT PANEL - MENU SYSTEM */}
      <div className="w-full md:w-[420px] bg-[#1a1a1a] border-l border-white/10 flex flex-col h-[60vh] md:h-screen shadow-2xl z-20">
         
         {/* Navigation Bar - Scrollable horizontal for mobile if needed */}
         <div className="flex bg-[#222] overflow-x-auto no-scrollbar border-b border-white/10">
            {[
                { id: 'upgrades', icon: <ShoppingCart size={18}/>, label: 'Shop', color: 'blue' },
                { id: 'pets', icon: <Zap size={18}/>, label: 'Pets', color: 'green' },
                { id: 'eggs', icon: <Award size={18}/>, label: 'Eggs', color: 'yellow' },
                { id: 'progress', icon: <ListTodo size={18}/>, label: 'Tasks', color: 'orange' },
                { id: 'player', icon: <User size={18}/>, label: 'Stats', color: 'purple' },
                { id: 'gamepasses', icon: <Gem size={18}/>, label: 'Store', color: 'pink' },
                { id: 'chat', icon: <MessageSquare size={18}/>, label: 'Chat', color: 'gray' },
                { id: 'settings', icon: <Settings size={18}/>, label: 'Settings', color: 'gray' },
                ...(gameState.isAdmin ? [{ id: 'admin', icon: <Shield size={18}/>, label: 'Owner', color: 'red' }] : []), // Conditional Admin Tab
            ].map((tab) => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`min-w-[70px] flex-1 py-3 px-1 font-game font-bold text-[10px] uppercase flex flex-col items-center gap-1 transition-all
                    ${activeTab === tab.id 
                        ? `text-${tab.color}-400 bg-white/5 border-b-2 border-${tab.color}-400` 
                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                >
                    {tab.icon}
                    <span>{tab.label}</span>
                </button>
            ))}
         </div>

         {/* Content Area */}
         <div className="flex-1 overflow-y-auto p-4 custom-scrollbar relative bg-[#151515]">
            
            {/* UPGRADES TAB */}
            {activeTab === 'upgrades' && (
                <div className="space-y-3 animate-fade-in">
                    <h3 className="font-game text-gray-400 uppercase text-xs tracking-wider mb-2">Boost your stats</h3>
                    {gameState.upgrades.map(upgrade => {
                         const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.count));
                         const canAfford = gameState.currency >= cost;

                         return (
                             <button 
                                key={upgrade.id}
                                onClick={() => buyUpgrade(upgrade.id)}
                                disabled={!canAfford}
                                className={`w-full flex items-center p-3 rounded-lg border-2 transition-all group ${canAfford ? 'bg-white/5 border-white/10 hover:border-blue-500 hover:bg-blue-900/10' : 'bg-red-900/10 border-red-900/30 opacity-60 cursor-not-allowed'}`}
                             >
                                 <div className="w-10 h-10 bg-black/40 rounded flex items-center justify-center text-xl mr-3 border border-white/5 group-hover:scale-110 transition-transform">
                                    {upgrade.icon}
                                 </div>
                                 <div className="flex-1 text-left">
                                     <div className="font-bold text-sm text-gray-200">{upgrade.name}</div>
                                     <div className="text-xs text-blue-400 font-mono">+{upgrade.powerIncrease} {upgrade.type === 'click' ? 'Click' : 'Auto'} Power</div>
                                 </div>
                                 <div className="text-right">
                                     <div className={`font-bold font-game ${canAfford ? 'text-yellow-400' : 'text-red-400'}`}>{cost.toLocaleString()}</div>
                                     <div className="text-[10px] text-gray-500">Lvl {upgrade.count}</div>
                                 </div>
                             </button>
                         );
                    })}
                </div>
            )}

            {/* PETS TAB */}
            {activeTab === 'pets' && (
                <div className="animate-fade-in">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="font-game text-gray-400 uppercase text-xs tracking-wider">Your Inventory</h3>
                        <span className="text-xs text-blue-400 bg-blue-900/20 px-2 py-1 rounded">Mult: x{totalMultiplier.toFixed(2)}</span>
                     </div>
                     
                     {gameState.pets.length === 0 ? (
                         <div className="text-center py-10 text-gray-500">
                             <div className="text-4xl mb-2">🥚</div>
                             <p>No pets yet. Go hatch some eggs!</p>
                         </div>
                     ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {gameState.pets.map((pet) => (
                                <PetCard key={pet.id} pet={pet} />
                            ))}
                        </div>
                     )}
                </div>
            )}

            {/* EGGS TAB */}
            {activeTab === 'eggs' && (
                <div className="space-y-4 animate-fade-in">
                    <h3 className="font-game text-gray-400 uppercase text-xs tracking-wider mb-2">Hatch New Pets</h3>
                    
                    {/* WINTER EGG */}
                    <button
                        onClick={() => hatchEgg('Winter', 5000, 'gems')}
                        disabled={isHatching || gameState.gems < 5000}
                        className={`w-full relative p-4 rounded-xl border-b-4 bg-cyan-900 border-cyan-500 transition-all active:border-b-0 active:translate-y-1 hover:brightness-110 overflow-hidden group text-left shadow-[0_0_20px_rgba(34,211,238,0.2)]`}
                    >
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/snow.png')] opacity-20"></div>
                        <div className="absolute top-0 right-0 p-2 opacity-30 text-6xl group-hover:scale-125 transition-transform duration-500 rotate-12">❄️</div>
                        <div className="relative z-10 flex flex-col items-start">
                            <div className="font-game font-bold text-xl text-cyan-200 drop-shadow-md flex items-center gap-2">
                                Winter Egg <span className="text-[10px] bg-cyan-500 text-black px-1 rounded uppercase">Event</span>
                            </div>
                            <div className="text-sm text-cyan-100/80 mb-2">Limited time! Ice & Snow pets.</div>
                            <div className="bg-black/40 px-3 py-1 rounded-full text-cyan-300 font-bold font-mono text-sm border border-cyan-500/30 flex items-center gap-1">
                                <Gem size={12} /> 5,000 Gems
                            </div>
                        </div>
                    </button>

                    {[
                        { tier: 'Basic', cost: 500, color: 'bg-gray-700', border: 'border-gray-500' },
                        { tier: 'Golden', cost: 2500, color: 'bg-yellow-700', border: 'border-yellow-500' },
                        { tier: 'Diamond', cost: 10000, color: 'bg-cyan-700', border: 'border-cyan-500' }
                    ].map((egg) => (
                        <button
                            key={egg.tier}
                            onClick={() => hatchEgg(egg.tier as any, egg.cost, 'studs')}
                            disabled={isHatching || gameState.currency < egg.cost}
                            className={`w-full relative p-4 rounded-xl border-b-4 ${egg.color} ${egg.border} transition-all active:border-b-0 active:translate-y-1 hover:brightness-110 overflow-hidden group text-left`}
                        >
                            <div className="absolute top-0 right-0 p-2 opacity-10 text-6xl group-hover:scale-125 transition-transform duration-500">🥚</div>
                            <div className="relative z-10 flex flex-col items-start">
                                <div className="font-game font-bold text-xl text-white drop-shadow-md">{egg.tier} Egg</div>
                                <div className="text-sm text-white/80 mb-2">Contains AI generated pets!</div>
                                <div className="bg-black/30 px-3 py-1 rounded-full text-yellow-300 font-bold font-mono text-sm">
                                    {egg.cost.toLocaleString()} Studs
                                </div>
                            </div>
                        </button>
                    ))}
                    
                    {isHatching && (
                        <div className="text-center p-4 animate-pulse text-yellow-400 font-bold">
                            HATCHING...
                        </div>
                    )}
                </div>
            )}

            {/* PROGRESS TAB */}
            {activeTab === 'progress' && (
                <div className="animate-fade-in">
                    <ProgressTab gameState={gameState} onClaim={handleClaimAchievement} />
                </div>
            )}

            {/* PLAYER STATS TAB */}
            {activeTab === 'player' && (
                <div className="animate-fade-in">
                    <PlayerStats gameState={gameState} currentRank={currentRank} nextRank={nextRank} />
                </div>
            )}

            {/* GAMEPASSES TAB */}
            {activeTab === 'gamepasses' && (
                <div className="animate-fade-in">
                    <h3 className="font-game text-gray-400 uppercase text-xs tracking-wider mb-2">Exclusive Upgrades</h3>
                    <GamePasses owned={gameState.gamepasses} currency={gameState.currency} gems={gameState.gems} onBuy={buyGamepass} />
                </div>
            )}

            {/* CHAT TAB */}
            <div className={`h-full ${activeTab === 'chat' ? 'block' : 'hidden'}`}>
                <ChatBox 
                    gameContext={chatContext} 
                    messages={chatMessages}
                    onAddMessage={addChatMessage}
                />
            </div>

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
                <div className="animate-fade-in space-y-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h3 className="font-game text-gray-200 font-bold mb-1 flex items-center gap-2">
                            <User size={18} /> Account
                        </h3>
                        <p className="text-xs text-gray-500 mb-4">Manage your session.</p>
                        
                        <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg mb-4">
                            <div>
                                <div className="text-xs text-gray-500 uppercase">Logged in as</div>
                                <div className="font-bold text-white">{gameState.username}</div>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="bg-red-900/50 hover:bg-red-800 text-red-200 text-xs px-3 py-2 rounded flex items-center gap-2 border border-red-500/30"
                            >
                                <LogOut size={14} /> Logout
                            </button>
                        </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h3 className="font-game text-gray-200 font-bold mb-1 flex items-center gap-2">
                            <Key size={18} /> Authorization
                        </h3>
                        <p className="text-xs text-gray-500 mb-4">Enter key to take control of this account.</p>
                        
                        {gameState.isAdmin ? (
                            <div className="bg-green-900/20 border border-green-500/30 p-3 rounded-lg text-green-400 text-sm font-bold text-center">
                                ACCESS GRANTED
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input 
                                    type="password" 
                                    value={authCode}
                                    onChange={(e) => setAuthCode(e.target.value)}
                                    placeholder="Enter Admin Key..."
                                    className="flex-1 bg-black/40 border border-white/10 rounded p-2 text-white text-sm"
                                />
                                <button 
                                    onClick={handleAuthorize}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-bold text-xs"
                                >
                                    AUTHORIZE
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="text-center text-[10px] text-gray-600 mt-8">
                        Blox Clicker Simulator Security v2.0
                    </div>
                </div>
            )}

            {/* ADMIN TAB */}
            {activeTab === 'admin' && gameState.isAdmin && (
                <div className="animate-fade-in">
                    <AdminPanel 
                        onAddCurrency={adminAddCurrency} 
                        onAddGems={adminAddGems} 
                        onTriggerEvent={adminTriggerEvent}
                        onReset={adminReset} 
                        onAnnounce={adminAnnounce}
                    />
                </div>
            )}

         </div>
         
         {/* Footer Info */}
         <div className="p-3 bg-black/20 text-[10px] text-gray-600 text-center border-t border-white/5 flex justify-center items-center gap-2">
             <span>Blox Clicker Sim v1.6 (Owner Panel) • Powered by Google Gemini</span>
             <span className="text-green-500/50 flex items-center gap-1"><Save size={8} /> Autosave On</span>
         </div>
      </div>
    </div>
  );
}