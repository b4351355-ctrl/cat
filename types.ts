export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}

export enum ItemType {
  CARROT = 'CARROT',
  TISSUE = 'TISSUE',
  FISH = 'FISH',
  MOUSE = 'MOUSE',
  WATER = 'WATER',
  PHONE = 'PHONE'
}

export interface GameItem {
  type: ItemType;
  label: string; // Chinese label
  subLabel: string; // English/Pinyin
  emoji: string;
  color: string;
  borderColor: string;
  weight: number; // Probability weight
}

export interface ScoreData {
  current: number;
  high: number;
}