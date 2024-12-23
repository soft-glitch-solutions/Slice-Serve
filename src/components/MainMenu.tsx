import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Settings, Trophy, ShoppingCart, Star } from "lucide-react";
import Store from './Store';

interface MainMenuProps {
  onStartGame: () => void;
}

const MainMenu = ({ onStartGame }: MainMenuProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [highScores] = useState(() => {
    const saved = localStorage.getItem('highScores');
    return saved ? JSON.parse(saved) : [
      { name: "Player 1", score: 1000 },
      { name: "Player 2", score: 800 },
      { name: "Player 3", score: 600 },
    ];
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      {!showSettings && !showStore && (
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-orange-600 mb-4">Food Slicer</h1>
            <p className="text-xl text-orange-700">
              Slice food into equal portions to feed hungry people!
            </p>
            <p className="text-orange-500">
              Each level is a unique challenge with its own story!
            </p>
          </div>
          
          <div className="food-icons flex gap-4 justify-center my-8">
            {['🍕', '🍰', '🥧', '🍉', '🥪'].map((emoji, index) => (
              <span 
                key={index} 
                className="text-4xl animate-bounce" 
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {emoji}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <Button 
              onClick={onStartGame}
              className="text-2xl px-8 py-6 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg transform transition hover:scale-105 flex items-center justify-center gap-2"
            >
              <Play className="w-6 h-6" />
              Start Slicing!
            </Button>
            
            <Button 
              onClick={() => setShowStore(true)}
              className="text-xl px-6 py-4 bg-orange-400 hover:bg-orange-500 text-white rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Store
            </Button>
            
            <Button 
              onClick={() => setShowSettings(true)}
              className="text-xl px-6 py-4 bg-orange-300 hover:bg-orange-400 text-white rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Button>
          </div>

          <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-orange-600">High Scores</h2>
            </div>
            <div className="space-y-3">
              {highScores.map((score: { name: string; score: number }, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-orange-700">{score.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold">{score.score}</span>
                    <Star className="w-4 h-4 text-yellow-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="text-center space-y-6 p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-orange-600">Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-orange-700">Sound Effects</span>
              <input type="checkbox" className="toggle" />
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-orange-700">Music</span>
              <input type="checkbox" className="toggle" />
            </div>
          </div>
          <Button 
            onClick={() => setShowSettings(false)}
            className="mt-6 bg-orange-500 hover:bg-orange-600 text-white"
          >
            Back to Menu
          </Button>
        </div>
      )}

      {showStore && <Store onClose={() => setShowStore(false)} />}
    </div>
  );
};

export default MainMenu;