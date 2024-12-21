import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';

interface GameProps {
  onGameOver: (score: number) => void;
}

const FOODS = [
  { name: 'pizza', color: '#FF6B6B', minSlices: 4, maxSlices: 8, shape: 'circle' },
  { name: 'cake', color: '#FFE66D', minSlices: 6, maxSlices: 12, shape: 'circle' },
  { name: 'pie', color: '#4ECDC4', minSlices: 3, maxSlices: 6, shape: 'circle' },
  { name: 'sandwich', color: '#F4A261', minSlices: 2, maxSlices: 4, shape: 'square' },
  { name: 'watermelon', color: '#E76F51', minSlices: 8, maxSlices: 16, shape: 'circle' }
];

const STORIES = [
  "Timmy's having a birthday party and invited 4 friends!",
  "Sarah's hosting a tea party for her dolls!",
  "The basketball team just finished practice!",
  "The book club is having their monthly meeting!",
  "The neighborhood kids are having a playdate!"
];

const Game = ({ onGameOver }: GameProps) => {
  const [rotation, setRotation] = useState('clockwise');
  const [slices, setSlices] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentFood, setCurrentFood] = useState(() => FOODS[Math.floor(Math.random() * FOODS.length)]);
  const [story] = useState(() => STORIES[Math.floor(Math.random() * STORIES.length)]);
  const [requiredSlices] = useState(() => 
    Math.floor(Math.random() * (currentFood.maxSlices - currentFood.minSlices + 1)) + currentFood.minSlices
  );
  const [peopleToFeed] = useState(() => Math.floor(Math.random() * 5) + 2);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setRotation(prev => prev === 'clockwise' ? 'counterclockwise' : 'clockwise');
    }, 4000);

    return () => clearInterval(rotationInterval);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      onGameOver(score);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onGameOver, score]);

  const calculatePieces = (slicesCount: number) => {
    // Each slice adds one more piece than the slice number
    // For example: 1 slice = 2 pieces, 2 slices = 3 pieces, etc.
    return slicesCount + 1;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || timeLeft <= 0) return;

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
  };

  const handleSubmit = () => {
    const currentPieces = calculatePieces(slices.length);
    if (currentPieces === requiredSlices) {
      toast.success("Perfect slicing! Next level!");
      setScore(prev => prev + 100);
      // Reset for next level
      setSlices([]);
      setTimeLeft(30);
      setCurrentFood(FOODS[Math.floor(Math.random() * FOODS.length)]);
    } else {
      toast.error("Wrong number of pieces!");
      onGameOver(score);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      <div className="mb-8 text-center space-y-4">
        <h2 className="text-2xl font-bold text-orange-800">Score: {score}</h2>
        <p className="text-orange-600 text-lg">{story}</p>
        <p className="text-orange-600">Feed {peopleToFeed} people!</p>
        <p className="text-sm text-orange-500">Current pieces: {calculatePieces(slices.length)}</p>
        <p className="text-lg font-semibold text-orange-700">Time left: {timeLeft}s</p>
      </div>
      
      <div 
        ref={containerRef}
        className="food-container relative mb-8"
        onClick={handleClick}
      >
        <div 
          className={`food-item rotate-${rotation}`}
          style={{ 
            backgroundColor: currentFood.color,
            borderRadius: currentFood.shape === 'circle' ? '50%' : '0%'
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

      <Button 
        onClick={handleSubmit}
        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl text-lg font-semibold"
      >
        Submit Slices
      </Button>
      
      <p className="mt-8 text-lg text-orange-700 font-medium">
        Slice the {currentFood.name} carefully!
      </p>
    </div>
  );
};

export default Game;