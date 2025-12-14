
export enum Rarity {
  COMMON = 'Common',
  UNCOMMON = 'Uncommon',
  RARE = 'Rare',
  EPIC = 'Epic',
  LEGENDARY = 'Legendary',
  ULTRA_RARE = 'Ultra Rare',
  MYTHICAL = 'Mythical'
}

export interface Pet {
  id: string;
  name: string;
  rarity: Rarity;
  multiplier: number;
  emoji: string;
  description: string;
}

export interface Upgrade {
  id: string;
  name: string;
  baseCost: number;
  costMultiplier: number;
  powerIncrease: number;
  count: number;
  type: 'click' | 'auto';
  icon: string;
}

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  isSystem?: boolean;
  role?: 'player' | 'admin' | 'vip' | 'owner';
}

export interface GamePasses {
  vip: boolean;
  serverLuck: boolean; // 10x luck
  luck8x: boolean;
  luck15x: boolean;
  luck99x: boolean;
}

export interface GameEvent {
  id: string;
  name: string;
  type: 'luck' | 'currency';
  multiplier: number;
  durationSeconds: number;
  endTime: number;
}

export interface RankDefinition {
  name: string;
  threshold: number;
  multiplier: number;
  color: string;
}

export interface Island {
  id: string;
  name: string;
  multiplier: number;
  cost: number; // In Studs
  color: string;
  image: string;
}

export interface GameState {
  username?: string;
  password?: string;
  email?: string;
  isVerified?: boolean;
  isAdmin?: boolean;
  tags: string[]; 
  currency: number;
  gems: number;
  tokens: number;
  aura: number; // New Currency for Brainrot Update
  rebirths: number;
  clickPower: number;
  autoPower: number;
  currentIslandId: string;
  pets: Pet[];
  discoveredPets: Pet[]; // New: For the Index
  upgrades: Upgrade[];
  totalClicks: number;
  gamepasses: GamePasses;
  activeEvents: GameEvent[];
  claimedAchievementIds: string[];
}
