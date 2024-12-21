import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

const GameOver = ({ score, onRestart }: GameOverProps) => {
  const [countdown, setCountdown] = useState(5);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center space-y-6 max-w-md mx-4">
        <h2 className="text-4xl font-bold text-orange-600 mb-4">Game Over!</h2>
        <p className="text-2xl text-orange-800 mb-4">Score: {score}</p>
        
        {!showSkip && (
          <div className="text-orange-500">
            Skip available in {countdown} seconds...
          </div>
        )}

        <div className="space-y-4">
          {showSkip && (
            <>
              <Button 
                onClick={() => {/* Ad logic would go here */}}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
              >
                Watch Ad to Continue
              </Button>
              
              <Button 
                onClick={onRestart}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3"
              >
                Skip to Menu
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameOver;