import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameItem, ItemType } from '../types';
import { 
  ITEMS, POSITIVE_FEEDBACKS, NEGATIVE_FEEDBACKS, INITIAL_TIME_SECONDS, 
  BASE_TIME_BONUS_MS, MIN_TIME_BONUS_MS, TIME_DECAY_PER_POINT, TIME_PENALTY_MS 
} from '../constants';
import { Volume2, VolumeX, Zap } from 'lucide-react';
import { speak, playSuccessSound, playErrorSound } from '../utils/audio';

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
  const [pawState, setPawState] = useState<'idle' | 'left' | 'right'>('idle');
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMutedRef = useRef(isMuted);

  // Helper: Weighted random selection
  const getRandomItems = () => {
    const allItems = Object.values(ITEMS);
    const shuffled = [...allItems].sort(() => 0.5 - Math.random());
    return [shuffled[0], shuffled[1]];
  };

  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);

  // Game Loop Logic (Next Round)
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

  // Init
  useEffect(() => {
    nextRound();
  }, [nextRound]);

  // High Resolution Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
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
  }, [onGameOver, score]);

  // Diminishing Return Logic
  const calculateTimeBonus = (currentScore: number) => {
    const decay = currentScore * TIME_DECAY_PER_POINT;
    return Math.max(MIN_TIME_BONUS_MS, BASE_TIME_BONUS_MS - decay);
  };

  const handleInteraction = (selectedType: ItemType) => {
    if (timeLeftMs <= 0) return;

    // Paw Animation
    setPawState(selectedType === leftItem.type ? 'left' : 'right');
    // Reset paw after animation
    setTimeout(() => setPawState('idle'), 200);

    if (selectedType === targetItem) {
      // Correct
      if (!isMuted) playSuccessSound(combo);
      
      const newCombo = combo + 1;
      setCombo(newCombo);
      setScore(s => s + 1);
      
      // Dynamic Bonus Time
      const bonus = calculateTimeBonus(score);
      setTimeLeftMs(prev => Math.min(prev + bonus, 30000));

      const msg = POSITIVE_FEEDBACKS[Math.floor(Math.random() * POSITIVE_FEEDBACKS.length)];
      setFeedback(msg);
      setFeedbackType('success');
      
      nextRound(); 
      
      setTimeout(() => {
        setFeedback(null);
        setFeedbackType(null);
      }, 300);

    } else {
      // Incorrect
      if (!isMuted) playErrorSound();
      
      setCombo(0);
      setTimeLeftMs(prev => Math.max(0, prev - TIME_PENALTY_MS));

      const msg = NEGATIVE_FEEDBACKS[Math.floor(Math.random() * NEGATIVE_FEEDBACKS.length)];
      setFeedback(msg);
      setFeedbackType('error');

      if (!isMuted) {
         setTimeout(() => speak(ITEMS[targetItem].label, targetItem), 200);
      }
      
      setTimeout(() => {
        setFeedback(null);
        setFeedbackType(null);
      }, 500);
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto relative bg-amber-50 rounded-xl overflow-hidden shadow-2xl">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 bg-amber-200 text-amber-900 border-b-4 border-amber-300 z-20">
        <div className="flex flex-col">
          <span className="text-xs uppercase font-bold tracking-wider opacity-70">得分</span>
          <span className="text-3xl font-black">{score}</span>
        </div>
        
        <div className="flex items-center gap-2">
            {combo > 1 && (
                <div className="flex items-center text-orange-600 font-black italic animate-bounce mr-2">
                    <Zap size={20} fill="currentColor" />
                    <span className="text-2xl">x{combo}</span>
                </div>
            )}
            <button onClick={toggleMute} className="p-2 rounded-full hover:bg-amber-300/50">
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-xs uppercase font-bold tracking-wider opacity-70">时间</span>
          <span className={`text-3xl font-black ${timeLeftMs < 5000 ? 'text-red-600 animate-pulse' : ''}`}>
            {(timeLeftMs / 1000).toFixed(1)}s
          </span>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative p-4 space-y-4">
        
        {/* The Prompt Bubble */}
        <div className="w-full text-center z-10 mb-2 relative">
           <div className={`
             inline-block bg-white border-4 rounded-3xl px-10 py-6 shadow-lg transform transition-transform duration-100
             ${feedbackType === 'error' ? 'shake border-red-500 bg-red-50' : 'border-gray-800'}
             ${feedbackType === 'success' ? 'scale-105 border-green-500' : ''}
           `}>
             <p className="text-gray-400 text-xs font-bold mb-1 uppercase tracking-widest">Cat wants</p>
             <h2 className="text-5xl font-black text-gray-800 mb-1">
               {ITEMS[targetItem].label}
             </h2>
           </div>
        </div>

        {/* Cat Area with Paw */}
        <div className="relative w-full flex justify-center h-48 sm:h-56 z-0">
          
          {/* Cat Image Container - ensure full head visible */}
          <div className={`
            relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border-8 border-white shadow-xl bg-gray-200 
            transition-transform duration-100
            ${feedbackType === 'error' ? 'shake grayscale' : ''}
          `}>
            <img 
              src="https://picsum.photos/id/40/400/400" 
              alt="The Cat" 
              className="w-full h-full object-cover rounded-full" 
            />
            
            {/* The Cat Paw */}
            <div className={`
                absolute -bottom-10 left-1/2 w-16 h-24 bg-white border-4 border-gray-300 rounded-full origin-top transition-transform duration-150 ease-out z-20 shadow-md
                ${pawState === 'left' ? '-rotate-45 -translate-x-12' : ''}
                ${pawState === 'right' ? 'rotate-45 translate-x-4' : ''}
                ${pawState === 'idle' ? 'scale-0' : ''}
            `} style={{ marginLeft: '-2rem' }}>
                {/* Paw Pads */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-6 bg-pink-300 rounded-full"></div>
                <div className="absolute top-1 left-2 w-3 h-3 bg-pink-300 rounded-full"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-pink-300 rounded-full"></div>
                <div className="absolute top-1 right-2 w-3 h-3 bg-pink-300 rounded-full"></div>
            </div>

          </div>

          {/* Feedback Overlay Text */}
          {feedback && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 text-center pointer-events-none pop-in z-30">
               <div className={`
                 px-4 py-2 rounded-full border-4 text-3xl font-black shadow-[0_0_20px_rgba(0,0,0,0.2)] rotate-[-10deg]
                 ${feedbackType === 'success' ? 'bg-green-400 border-white text-white' : 'bg-red-500 border-white text-white'}
               `}>
                 {feedback}
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls Area: Random Buttons */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-white/50 backdrop-blur-sm pb-8">
        {[leftItem, rightItem].map((item, idx) => (
            <button
            key={`${item.type}-${idx}`}
            onClick={() => handleInteraction(item.type)}
            className={`
                relative group h-48 rounded-3xl border-b-[8px] transition-all active:scale-95 active:border-b-0
                flex flex-col items-center justify-center shadow-lg
                ${item.color} 
                ${item.borderColor}
            `}
            >
            <span className="text-7xl mb-2 drop-shadow-md filter group-hover:brightness-110 transition-all">
                {item.emoji}
            </span>
            <span className="text-white font-black text-3xl drop-shadow-md tracking-wider">
                {item.label}
            </span>
            <span className="text-white/60 font-bold text-sm uppercase mt-1">
                {item.subLabel}
            </span>
            
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-3xl"></div>
            </button>
        ))}
      </div>
    </div>
  );
};