import { GameItem, ItemType } from './types';

export const INITIAL_TIME_SECONDS = 15;
export const GAME_DURATION_SECONDS = 60;

// Difficulty Settings
export const BASE_TIME_BONUS_MS = 800; // Starting bonus
export const MIN_TIME_BONUS_MS = 100;  // Minimum bonus possible
export const TIME_DECAY_PER_POINT = 15; // How much the bonus decreases per point
export const TIME_PENALTY_MS = 3000;   // Penalty for wrong answer

// Audio Paths - REPLACE THESE WITH YOUR UPLOADED FILE URLS IF AVAILABLE
export const AUDIO_CONFIG = {
  // If you have real mp3 files, paste their URLs here for best results.
  SOUND_CORRECT: '', // "Zhen Bang" sound
  SOUND_WRONG: '',
  ITEMS: {
    [ItemType.CARROT]: '', 
    [ItemType.TISSUE]: '', 
    [ItemType.FISH]: '',
    [ItemType.MOUSE]: '',
    [ItemType.WATER]: '',
    [ItemType.PHONE]: '',
  }
};

export const RANKS = [
  { threshold: 0, title: "呆萌猫 (Silly Cat)", message: "还没睡醒吗？😹", color: "text-gray-500" },
  { threshold: 10, title: "奶牛猫 (Cow Cat)", message: "神经兮兮，偶尔失手 🐄", color: "text-black" },
  { threshold: 30, title: "大橘猫 (Orange Cat)", message: "为了吃的，拼了！🐱", color: "text-orange-500" },
  { threshold: 60, title: "黑猫警长 (Sheriff)", message: "眼神犀利，动作敏捷 👮", color: "text-blue-800" },
  { threshold: 100, title: "猫神 (God of Cats)", message: "人类的手速极限！👑", color: "text-purple-600" }
];

export const ITEMS: Record<ItemType, GameItem> = {
  [ItemType.CARROT]: {
    type: ItemType.CARROT,
    label: '萝卜',
    subLabel: 'Luóbo',
    emoji: '🥕',
    color: 'bg-orange-500',
    borderColor: 'border-orange-700',
    weight: 3,
  },
  [ItemType.TISSUE]: {
    type: ItemType.TISSUE,
    label: '纸巾',
    subLabel: 'Zhǐjīn',
    emoji: '🧻',
    color: 'bg-blue-400',
    borderColor: 'border-blue-600',
    weight: 3,
  },
  [ItemType.FISH]: {
    type: ItemType.FISH,
    label: '鱼',
    subLabel: 'Yú',
    emoji: '🐟',
    color: 'bg-cyan-400',
    borderColor: 'border-cyan-600',
    weight: 1,
  },
  [ItemType.MOUSE]: {
    type: ItemType.MOUSE,
    label: '老鼠',
    subLabel: 'Lǎoshǔ',
    emoji: '🐭',
    color: 'bg-gray-400',
    borderColor: 'border-gray-600',
    weight: 1,
  },
  [ItemType.WATER]: {
    type: ItemType.WATER,
    label: '水',
    subLabel: 'Shuǐ',
    emoji: '💧',
    color: 'bg-blue-300',
    borderColor: 'border-blue-500',
    weight: 1,
  },
  [ItemType.PHONE]: {
    type: ItemType.PHONE,
    label: '手机',
    subLabel: 'Shǒujī',
    emoji: '📱',
    color: 'bg-purple-400',
    borderColor: 'border-purple-600',
    weight: 1,
  }
};

export const POSITIVE_FEEDBACKS = ["真棒!", "太强了!", "厉害!"];
export const NEGATIVE_FEEDBACKS = ["错啦!", "哎呀!", "笨笨!"];