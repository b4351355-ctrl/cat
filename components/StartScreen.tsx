import React from 'react';
import { Button } from './Button';
import { initAudio } from '../utils/audio';

// 使用用户提供的最新图片 URL
const catImg = 'https://www.helloimg.com/i/2025/12/25/694d0735e45a4.jpg';

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, highScore }) => {
  
  const handleStart = () => {
    initAudio(); 
    onStart();
  };

  return (
    <div className="flex flex-col items-center justify-between h-full py-6 px-6 text-center max-w-md mx-auto overflow-hidden">
      {/* 标题区域 */}
      <div className="space-y-1 mt-2 flex-shrink-0">
        <h1 className="text-5xl font-black text-gray-800 drop-shadow-sm tracking-tight">
          聪明猫
          <br />
          <span className="text-amber-500 text-5xl">挑战赛</span>
        </h1>
        <p className="text-gray-500 font-bold text-base">你能跟上猫咪的速度吗？</p>
      </div>

      {/* 图片区域 - 圆框设计 */}
      <div className="relative w-56 h-56 my-2 flex-shrink-1 min-h-[160px] flex items-center justify-center">
         <div className="absolute inset-0 bg-amber-200 rounded-full animate-pulse opacity-40 scale-110"></div>
         <div className="relative w-full h-full rounded-full border-8 border-white shadow-2xl overflow-hidden z-10">
           <img 
              src={catImg} 
              alt="Cat" 
              className="w-full h-full object-cover"
           />
         </div>
         <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white text-sm px-4 py-1.5 rounded-full font-bold border-4 border-white transform rotate-12 z-20 shadow-lg">
           快点我!
         </div>
      </div>

      {/* 分数区域 */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border-2 border-gray-100 w-full max-w-xs mx-auto flex-shrink-0">
        <p className="text-gray-400 uppercase text-xs font-bold mb-1">最高分 (Best)</p>
        <p className="text-4xl font-black text-gray-800">{highScore}</p>
      </div>

      {/* 底部操作区域 */}
      <div className="w-full space-y-3 flex-shrink-0 mb-2">
        <Button onClick={handleStart} className="w-full text-2xl py-5 animate-bounce shadow-orange-200">
          开始游戏
        </Button>
        
        <div className="text-gray-400 text-xs font-medium bg-orange-100/50 px-4 py-2 rounded-lg">
          🔊 记得开启声音<br/>
          听到指令，点击下方对应物品！
        </div>
      </div>
    </div>
  );
};