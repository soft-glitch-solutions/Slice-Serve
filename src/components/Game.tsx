import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface GameProps {
  onGameOver: (score: number) => void;
}

const FOODS = [
  { name: 'pizza', color: '#FF6B6B' },
  { name: 'cake', color: '#FFE66D' },
  { name: 'pie', color: '#4ECDC4' }
];

const Game = ({ onGameOver }: GameProps) => {
  const [rotation, setRotation] = useState('clockwise');
  const [slices, setSlices] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [currentFood] = useState(() => FOODS[Math.floor(Math.random() * FOODS.length)]);
  const containerRef = useRef<HTMLDivElement>(null);
  const requiredSlices = 4;

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev === 'clockwise' ? 'counterclockwise' : 'clockwise');
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const degrees = (angle * 180) / Math.PI + 180;

    // Check if slice is too close to existing slices
    const tooClose = slices.some(slice => {
      const diff = Math.abs(degrees - slice);
      return diff < 20 || diff > 340;
    });

    if (tooClose) {
      toast.error("Too close to existing slice!");
      onGameOver(score);
      return;
    }

    setSlices(prev => [...prev, degrees]);
    setScore(prev => prev + 100);

    if (slices.length + 1 === requiredSlices) {
      toast.success("Level Complete!");
      // Here you would typically advance to next level
      onGameOver(score + 100);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Score: {score}</h2>
        <p>Slices: {slices.length}/{requiredSlices}</p>
      </div>
      
      <div 
        ref={containerRef}
        className="food-container"
        onClick={handleClick}
      >
        <div 
          className={`food-item rotate-${rotation}`}
          style={{ 
            backgroundColor: currentFood.color,
            borderRadius: '50%'
          }}
        />
        {slices.map((angle, i) => (
          <div
            key={i}
            className="slice-line"
            style={{
              width: '100%',
              transform: `rotate(${angle}deg)`,
              top: '50%',
            }}
          />
        ))}
      </div>
      
      <p className="mt-8 text-lg">
        Tap to slice the {currentFood.name}!
      </p>
    </div>
  );
};

export default Game;