import { useState } from 'react';
import MainMenu from '@/components/MainMenu';
import Game from '@/components/Game';
import GameOver from '@/components/GameOver';

const Index = () => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameOver'>('menu');
  const [finalScore, setFinalScore] = useState(0);

  const handleStartGame = () => {
    setGameState('playing');
  };

  const handleGameOver = (score: number) => {
    setFinalScore(score);
    setGameState('gameOver');
  };

  const handleRestart = () => {
    setGameState('menu');
    setFinalScore(0);
  };

  return (
    <div className="min-h-screen bg-background">
      {gameState === 'menu' && <MainMenu onStartGame={handleStartGame} />}
      {gameState === 'playing' && <Game onGameOver={handleGameOver} />}
      {gameState === 'gameOver' && <GameOver score={finalScore} onRestart={handleRestart} />}
    </div>
  );
};

export default Index;