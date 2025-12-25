import { GameItem, ItemType } from './types';

export const INITIAL_TIME_SECONDS = 15; // Start with less time to create urgency
export const GAME_DURATION_SECONDS = 60;
export const TIME_BONUS_MS = 800; // Add 0.8s per correct answer
export const TIME_PENALTY_MS = 3000; // Subtract 3s per mistake

// Probability: Carrot/Tissue appear more often (Weight 3), others less (Weight 1)
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

export const POSITIVE_FEEDBACKS = [
  "快!", 
  "好!", 
  "对!", 
  "强!"
];

export const NEGATIVE_FEEDBACKS = [
  "错啦!",
  "哎呀!",
  "笨笨!"
];