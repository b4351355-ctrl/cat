import React from 'react';
import { Button } from './Button';
import { RotateCcw, Share2, Award } from 'lucide-react';
import { RANKS } from '../constants';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, highScore, onRestart }) => {
  const isNewHigh = score > highScore;
  
  // Calculate Rank
  // Find the highest threshold that is less than or equal to score
  const currentRank = [...RANKS].reverse().find(r => score >= r.threshold) || RANKS[0];

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center max-w-md mx-auto space-y-6">
      
      <div className="space-y-1">
        <h2 className="text-4xl font-black text-gray-800">时间到!</h2>
        <p className="text-gray-500 font-bold">手速不错，人类!</p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-xl border-b-8 border-gray-200 w-full transform rotate-1 relative overflow-hidden">
        {isNewHigh && (
          <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 px-3 py-1 text-xs font-bold rounded-bl-xl shadow-sm animate-pulse">
             新纪录!
          </div>
        )}
        
        <div className="mb-4">
            <p className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-1">本次得分</p>
            <p className="text-7xl font-black text-amber-500 leading-none">{score}</p>
        </div>

        <div className="border-t-2 border-gray-100 pt-4 mt-4">
             <p className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-2">获得称号</p>
             <div className="flex flex-col items-center justify-center space-y-1">
                 <span className={`text-2xl font-black ${currentRank.color}`}>
                    {currentRank.title}
                 </span>
                 <span className="text-sm text-gray-500 font-medium italic">
                    "{currentRank.message}"
                 </span>
             </div>
        </div>
      </div>

      <div className="flex flex-col w-full space-y-3">
        <Button onClick={onRestart} className="w-full flex items-center justify-center gap-2">
          <RotateCcw size={24} />
          再来一次
        </Button>
        
        <Button 
          onClick={() => alert("截图分享给朋友吧!")} 
          variant="secondary"
          className="w-full flex items-center justify-center gap-2"
        >
          <Share2 size={24} />
          炫耀战绩
        </Button>
      </div>

      <div className="text-xs text-gray-400 font-bold">
        历史最高: {highScore > score ? highScore : score}
      </div>
    </div>
  );
};