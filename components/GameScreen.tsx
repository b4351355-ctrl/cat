
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameItem, ItemType } from '../types';
import { 
  ITEMS, POSITIVE_FEEDBACKS, NEGATIVE_FEEDBACKS, INITIAL_TIME_SECONDS, 
  BASE_TIME_BONUS_MS, MIN_TIME_BONUS_MS, TIME_DECAY_PER_POINT, TIME_PENALTY_MS 
} from '../constants';
import { Volume2, VolumeX, Zap } from 'lucide-react';
import { speak, playSuccessSound, playErrorSound, stopAudio } from '../utils/audio';

// 使用用户提供的最新图片 URL
const catImg = 'https://www.helloimg.com/i/2025/12/25/694d0735e45a4.jpg';

interface GameScreenProps {
  onGameOver: (score: number) => void;
  gameDuration: number;
}

export const GameScreen: React.FC<GameScreenProps> = ({ onGameOver }) => {
  const [score, setScore] = useState(0);
  const [timeLeftMs, setTimeLeftMs] = useState(INITIAL_TIME_SECONDS * 1000);
  const [combo, setCombo] = useState(0);
  
  const [leftItem, setLeftItem] = useState<GameItem>(ITEMS[ItemType.CARROT]);
  const [rightItem, setRightItem] = useState<GameItem>(ITEMS[ItemType.TISSUE]);
  const [targetItem, setTargetItem] = useState<ItemType>(ItemType.CARROT);
  
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [activePaw, setActivePaw] = useState<'left' | 'right' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false); 
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMutedRef = useRef(isMuted);

  const getRandomItems = () => {
    const allItems = Object.values(ITEMS);
    const shuffled = [...allItems].sort(() => 0.5 - Math.random());
    return [shuffled[0], shuffled[1]];
  };

  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);

  const nextRound = useCallback(() => {
    const [item1, item2] = getRandomItems();
    setLeftItem(item1);
    setRightItem(item2);

    const isLeftTarget = Math.random() > 0.5;
    const newTarget = isLeftTarget ? item1.type : item2.type;
    setTargetItem(newTarget);

    if (!isMutedRef.current) {
      speak(ITEMS[newTarget].label, newTarget);
    }
  }, []);

  useEffect(() => {
    nextRound();
    return () => stopAudio();
  }, []); 

  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (isTransitioning) return;

      setTimeLeftMs((prev) => {
        if (prev <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          onGameOver(score);
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [onGameOver, score, isTransitioning]);

  const calculateTimeBonus = (currentScore: number) => {
    const decay = currentScore * TIME_DECAY_PER_POINT;
    return Math.max(MIN_TIME_BONUS_MS, BASE_TIME_BONUS_MS - decay);
  };

  const handleInteraction = (selectedType: ItemType) => {
    if (timeLeftMs <= 0 || isTransitioning) return;

    setActivePaw(selectedType === leftItem.type ? 'left' : 'right');
    setTimeout(() => setActivePaw(null), 250);

    if (selectedType === targetItem) {
      setIsTransitioning(true); 

      if (!isMuted) {
        playSuccessSound(combo);
      }
      
      const newCombo = combo + 1;
      setCombo(newCombo);
      setScore(s => s + 1);
      
      const bonus = calculateTimeBonus(score);
      setTimeLeftMs(prev => Math.min(prev + bonus, 30000));

      const msg = POSITIVE_FEEDBACKS[Math.floor(Math.random() * POSITIVE_FEEDBACKS.length)];
      setFeedback(msg);
      setFeedbackType('success');
      
      setTimeout(() => {
        setFeedback(null);
        setFeedbackType(null);
        nextRound(); 
        setIsTransitioning(false); 
      }, 500); 

    } else {
      if (!isMuted) playErrorSound();
      
      setCombo(0);
      setTimeLeftMs(prev => Math.max(0, prev - TIME_PENALTY_MS));

      const msg = NEGATIVE_FEEDBACKS[Math.floor(Math.random() * NEGATIVE_FEEDBACKS.length)];
      setFeedback(msg);
      setFeedbackType('error');

      if (!isMuted) {
         setTimeout(() => speak(ITEMS[targetItem].label, targetItem), 300);
      }
      
      setTimeout(() => {
        setFeedback(null);
        setFeedbackType(null);
      }, 500);
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const Paw = ({ side, isActive }: { side: 'left' | 'right', isActive: boolean }) => (
    <div className={`
      absolute bottom-0 w-12 h-36 bg-white border-4 border-gray-200 rounded-full
      origin-bottom transition-all duration-150 ease-out z-20 shadow-lg
      ${side === 'left' ? '-translate-x-16 rotate-[-10deg]' : 'translate-x-16 rotate-[10deg]'}
      ${isActive ? (side === 'left' ? '-translate-x-28 -translate-y-6 rotate-[-35deg]' : 'translate-x-28 -translate-y-6 rotate-[35deg]') : ''}
    `} style={{ bottom: '-15%' }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-14 bg-white border-4 border-gray-200 rounded-full -mt-6 shadow-sm">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-6 h-6 bg-pink-200 rounded-full"></div>
          <div className="absolute top-1 left-1 w-3 h-3 bg-pink-100 rounded-full"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-4 bg-pink-100 rounded-full"></div>
          <div className="absolute top-1 right-1 w-3 h-3 bg-pink-100 rounded-full"></div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* 顶部栏 */}
      <div className="flex justify-between items-center p-4 bg-amber-200 text-amber-900 border-b-4 border-amber-300 z-20 h-20 shrink-0">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">得分</span>
          <span className="text-3xl font-black leading-none">{score}</span>
        </div>
        
        <div className="flex items-center gap-2">
            {combo > 1 && (
                <div className="flex items-center text-orange-600 font-black italic animate-bounce mr-2">
                    <Zap size={20} fill="currentColor" />
                    <span className="text-2xl">x{combo}</span>
                </div>
            )}
            <button onClick={toggleMute} className="p-2 rounded-full active:bg-amber-300/50">
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">时间</span>
          <span className={`text-3xl font-black leading-none ${timeLeftMs < 5000 ? 'text-red-600 animate-pulse' : ''}`}>
            {(timeLeftMs / 1000).toFixed(1)}s
          </span>
        </div>
      </div>

      {/* 游戏主体区域 */}
      <div className="flex-1 flex flex-col items-center justify-start relative p-2 overflow-hidden min-h-0">
        <div className="w-full text-center z-10 mt-4 h-16 shrink-0">
           <div className={`
             inline-block bg-white border-4 rounded-3xl px-8 py-2 shadow-lg transform transition-transform duration-100
             ${feedbackType === 'error' ? 'shake border-red-500 bg-red-50' : 'border-gray-800'}
             ${feedbackType === 'success' ? 'scale-110 border-green-500' : ''}
           `}>
             <h2 className="text-4xl font-black text-gray-800">
               {ITEMS[targetItem].label}
             </h2>
           </div>
        </div>

        <div className="relative w-full flex-1 flex flex-col justify-center items-center z-0 min-h-0">
          <div className={`
            relative w-56 h-56 flex items-center justify-center
            transition-all duration-300
            ${feedbackType === 'error' ? 'shake grayscale brightness-75' : ''}
            ${feedbackType === 'success' ? 'scale-105' : ''}
          `}>
             <div className="w-full h-full rounded-full border-8 border-white shadow-2xl overflow-hidden relative bg-amber-100">
                <img 
                    src={catImg}
                    alt="Smart Cat" 
                    className="w-full h-full object-cover" 
                />
             </div>
            <Paw side="left" isActive={activePaw === 'left'} />
            <Paw side="right" isActive={activePaw === 'right'} />
          </div>

          {feedback && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none pop-in z-30">
               <div className={`
                 inline-block px-6 py-3 rounded-full border-4 text-4xl font-black shadow-[0_0_20px_rgba(0,0,0,0.3)] rotate-[-5deg]
                 ${feedbackType === 'success' ? 'bg-green-500 border-white text-white' : 'bg-red-500 border-white text-white'}
               `}>
                 {feedback}
               </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部按钮操作区 - 高度固定，按钮更大更适合手指点击 */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-white/80 backdrop-blur-md pb-10 pt-4 shrink-0 border-t border-amber-100">
        {[leftItem, rightItem].map((item, idx) => (
            <button
            key={`${item.type}-${idx}`}
            onClick={() => handleInteraction(item.type)}
            disabled={isTransitioning}
            className={`
                relative group h-40 rounded-3xl border-b-8 transition-all active:translate-y-1 active:border-b-0
                flex flex-col items-center justify-center shadow-lg overflow-hidden
                ${item.color} 
                ${item.borderColor}
                ${isTransitioning ? 'opacity-90' : ''}
            `}
            >
            <span className="text-6xl mb-1 drop-shadow-md">
                {item.emoji}
            </span>
            <span className="text-white font-black text-2xl drop-shadow-md tracking-wider">
                {item.label}
            </span>
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent"></div>
            </button>
        ))}
      </div>
    </div>
  );
};
