import React from 'react';
import { Button } from './Button';
import { RotateCcw, Share2 } from 'lucide-react';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, highScore, onRestart }) => {
  const isNewHigh = score > highScore;

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center max-w-md mx-auto space-y-8">
      
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-gray-800">Time's Up!</h2>
        <p className="text-gray-500 font-bold">Great job, human!</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-gray-200 w-full transform rotate-1">
        <div className="mb-6">
            <p className="text-gray-400 uppercase text-sm font-bold tracking-wider mb-2">Your Score</p>
            <p className="text-7xl font-black text-amber-500">{score}</p>
        </div>
        
        {isNewHigh && (
          <div className="inline-block bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg font-bold text-sm mb-2 animate-pulse">
            🏆 New Personal Best!
          </div>
        )}

        {!isNewHigh && (
           <p className="text-gray-400 font-medium">Best: {highScore}</p>
        )}
      </div>

      <div className="flex flex-col w-full space-y-3">
        <Button onClick={onRestart} className="w-full flex items-center justify-center gap-2">
          <RotateCcw size={24} />
          Play Again
        </Button>
        
        {/* Placeholder for sharing logic */}
        <Button 
          onClick={() => alert("Share feature would go here!")} 
          variant="secondary"
          className="w-full flex items-center justify-center gap-2"
        >
          <Share2 size={24} />
          Share Score
        </Button>
      </div>
    </div>
  );
};