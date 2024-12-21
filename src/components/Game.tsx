import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface GameProps {
  onGameOver: (score: number) => void;
}

const FOODS = [
  { name: 'pizza', color: '#FF6B6B', minSlices: 4, maxSlices: 8 },
  { name: 'cake', color: '#FFE66D', minSlices: 6, maxSlices: 12 },
  { name: 'pie', color: '#4ECDC4', minSlices: 3, maxSlices: 6 },
  { name: 'sandwich', color: '#F4A261', minSlices: 2, maxSlices: 4 },
  { name: 'watermelon', color: '#E76F51', minSlices: 8, maxSlices: 16 }
];

const Game = ({ onGameOver }: GameProps) => {
  const [rotation, setRotation] = useState('clockwise');
  const [slices, setSlices] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [currentFood] = useState(() => FOODS[Math.floor(Math.random() * FOODS.length)]);
  const [requiredSlices] = useState(() => 
    Math.floor(Math.random() * (currentFood.maxSlices - currentFood.minSlices + 1)) + currentFood.minSlices
  );
  const containerRef = useRef<HTMLDivElement>(null);

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
      onGameOver(score + 100);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-orange-800">Score: {score}</h2>
        <p className="text-orange-600">People need food! Make equal portions!</p>
        <p className="text-sm text-orange-500">Current slices: {slices.length}</p>
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
      
      <p className="mt-8 text-lg text-orange-700 font-medium">
        Slice the {currentFood.name} carefully!
      </p>
    </div>
  );
};

export default Game;