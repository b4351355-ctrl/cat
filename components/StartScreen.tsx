import React from 'react';
import { Button } from './Button';
import { initAudio } from '../utils/audio';

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, highScore }) => {
  
  const handleStart = () => {
    initAudio(); // Initialize audio context on user gesture
    onStart();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 p-6 text-center max-w-md mx-auto">
      <div className="space-y-2 mt-8">
        <h1 className="text-6xl font-black text-gray-800 drop-shadow-sm tracking-tight">
          聪明猫
          <br />
          <span className="text-amber-500 text-5xl">挑战赛</span>
        </h1>
        <p className="text-gray-500 font-bold text-lg">你能跟上猫咪的速度吗？</p>
      </div>

      <div className="relative w-48 h-48 my-8">
         <div className="absolute inset-0 bg-yellow-200 rounded-full animate-pulse opacity-50"></div>
         <img 
            src="https://picsum.photos/id/40/300/300" 
            alt="Cat" 
            className="w-full h-full object-cover rounded-full border-8 border-white shadow-xl relative z-10"
         />
         <div className="absolute -bottom-2 right-0 bg-blue-500 text-white text-xs px-3 py-1 rounded-xl font-bold border-2 border-white transform rotate-12 z-20 shadow-md">
           快给我!
         </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100 w-full max-w-xs mx-auto">
        <p className="text-gray-400 uppercase text-xs font-bold mb-1">最高分 (Best)</p>
        <p className="text-4xl font-black text-gray-800">{highScore}</p>
      </div>

      <div className="w-full space-y-4">
        <Button onClick={handleStart} className="w-full text-2xl py-6 animate-bounce shadow-orange-200">
          开始游戏
        </Button>
      </div>

      <div className="text-gray-400 text-xs font-medium bg-orange-100/50 px-4 py-2 rounded-lg">
        🔊 记得开启声音<br/>
        听到什么点什么，速度要快！
      </div>
    </div>
  );
};