
import React, { useState, useEffect } from 'react';
import { GameState } from './types';
import { GAME_DURATION_SECONDS } from './constants';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { GameOverScreen } from './components/GameOverScreen';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // 加载最高分
  useEffect(() => {
    try {
      const saved = localStorage.getItem('smartCatHighScore');
      if (saved) {
        setHighScore(parseInt(saved, 10));
      }
    } catch (e) {
      console.error("Storage access failed", e);
    }
  }, []);

  const handleStartGame = () => {
    setCurrentScore(0);
    setGameState(GameState.PLAYING);
  };

  const handleGameOver = (finalScore: number) => {
    setCurrentScore(finalScore);
    setGameState(GameState.GAME_OVER);
    
    if (finalScore > highScore) {
      setHighScore(finalScore);
      try {
        localStorage.setItem('smartCatHighScore', finalScore.toString());
      } catch (e) {}
    }
  };

  const renderScreen = () => {
    switch (gameState) {
      case GameState.MENU:
        return <StartScreen onStart={handleStartGame} highScore={highScore} />;
      case GameState.PLAYING:
        return (
          <GameScreen 
            onGameOver={handleGameOver} 
            gameDuration={GAME_DURATION_SECONDS} 
          />
        );
      case GameState.GAME_OVER:
        return (
          <GameOverScreen 
            score={currentScore} 
            highScore={highScore} 
            onRestart={handleStartGame} 
          />
        );
      default:
        return null;
    }
  };

  return (
    // 适配全屏，移除固定高度限制，增加安全区 padding
    <div className="fixed inset-0 bg-orange-50 flex flex-col overflow-hidden safe-top safe-bottom">
      <div className="relative flex-1 w-full max-w-lg mx-auto bg-white shadow-none sm:shadow-2xl overflow-hidden flex flex-col">
        {/* 背景渐变装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 opacity-50 pointer-events-none"></div>
        <div className="relative flex-1 z-10 flex flex-col h-full">
          {renderScreen()}
        </div>
      </div>
    </div>
  );
};

export default App;
