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

  // Load high score from local storage
  useEffect(() => {
    const saved = localStorage.getItem('smartCatHighScore');
    if (saved) {
      setHighScore(parseInt(saved, 10));
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
      localStorage.setItem('smartCatHighScore', finalScore.toString());
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
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
      {/* Mobile container constraint */}
      <div className="w-full max-w-md h-[800px] max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-white ring-4 ring-orange-100 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 opacity-50 pointer-events-none"></div>
        <div className="relative h-full z-10">
          {renderScreen()}
        </div>
      </div>
    </div>
  );
};

export default App;