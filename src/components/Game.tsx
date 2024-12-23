import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import Confetti from 'react-confetti';

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
  const [peopleToFeed] = useState(() => Math.floor(Math.random() * 5) + 2);
  const [showWinOverlay, setShowWinOverlay] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
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
    return slicesCount + 1;
  };

  const getAngleFromPoints = (x1: number, y1: number, x2: number, y2: number, centerX: number, centerY: number) => {
    const angle1 = Math.atan2(y1 - centerY, x1 - centerX);
    const angle2 = Math.atan2(y2 - centerY, x2 - centerX);
    return ((angle2 - angle1) * 180) / Math.PI;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setIsDragging(true);
    setStartPoint({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !startPoint || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const currentPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    const angle = getAngleFromPoints(
      startPoint.x,
      startPoint.y,
      currentPoint.x,
      currentPoint.y,
      centerX,
      centerY
    );

    const tooClose = slices.some(existingAngle => {
      const diff = Math.abs(angle - existingAngle);
      return diff < 20 || diff > 340;
    });

    if (tooClose) {
      toast.error("Too close to existing slice!");
      onGameOver(score);
      return;
    }

    setStartPoint(currentPoint);
  };

  const handleMouseUp = () => {
    if (!isDragging || !startPoint || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const angle = Math.atan2(startPoint.y - centerY, startPoint.x - centerX);
    const degrees = ((angle * 180) / Math.PI + 360) % 360;
    
    setSlices(prev => [...prev, degrees]);
    handleSlice(degrees);
    setIsDragging(false);
    setStartPoint(null);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    setIsDragging(true);
    setStartPoint({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !startPoint || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const currentPoint = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
    setStartPoint(currentPoint);
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  const handleSlice = (angle: number) => {
    const splitDirection = angle > 180 ? '10px' : '-10px';
    if (containerRef.current) {
      const foodItem = containerRef.current.querySelector('.food-item') as HTMLDivElement;
      if (foodItem) {
        foodItem.style.setProperty('--split-direction', splitDirection);
        foodItem.classList.add('food-split');
        setTimeout(() => {
          foodItem.classList.remove('food-split');
        }, 500);
      }
    }
  };

  const handleSubmit = () => {
    const currentPieces = calculatePieces(slices.length);
    if (currentPieces === peopleToFeed) {
      setShowWinOverlay(true);
      setScore(prev => prev + 100);
    } else {
      toast.error(`Wrong number of pieces! You made ${currentPieces} pieces but needed ${peopleToFeed}`);
      onGameOver(score);
    }
  };

  const handleNextLevel = () => {
    setShowWinOverlay(false);
    setSlices([]);
    setTimeLeft(30);
    setCurrentFood(FOODS[Math.floor(Math.random() * FOODS.length)]);
  };

  const getFoodClassName = () => {
    return `food-item ${currentFood.name} ${rotation === 'clockwise' ? 'rotate-clockwise' : 'rotate-counterclockwise'}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 px-4">
      {showWinOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Confetti />
          <div className="bg-white p-8 rounded-xl text-center space-y-4">
            <h2 className="text-3xl font-bold text-orange-600">Level Complete!</h2>
            <p className="text-lg text-orange-500">Perfect slicing!</p>
            <Button 
              onClick={handleNextLevel}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl text-lg font-semibold"
            >
              Next Challenge
            </Button>
          </div>
        </div>
      )}

      <div className="mb-8 text-center space-y-4">
        <h2 className="text-2xl font-bold text-orange-800">Score: {score}</h2>
        <p className="text-orange-600 text-lg">{story}</p>
        <p className="text-orange-600">Feed {peopleToFeed} people!</p>
        <p className="text-sm text-orange-500">Current pieces: {calculatePieces(slices.length)}</p>
        <p className="text-lg font-semibold text-orange-700">Time left: {timeLeft}s</p>
      </div>
      
      <div 
        ref={containerRef}
        className="food-container relative mb-8 touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className={getFoodClassName()}
          style={{ 
            borderRadius: currentFood.shape === 'circle' ? '50%' : '0%'
          }}
        />
        {slices.map((angle, i) => (
          <div
            key={i}
            className="slice-line"
            style={{
              width: '150%',
              transform: `rotate(${angle}deg)`,
              top: '50%',
              left: '-25%',
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
