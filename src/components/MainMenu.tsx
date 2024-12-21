import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MainMenuProps {
  onStartGame: () => void;
}

const MainMenu = ({ onStartGame }: MainMenuProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showHighScores, setShowHighScores] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      {!showSettings && !showHighScores && (
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
              className="text-2xl px-8 py-6 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg transform transition hover:scale-105"
            >
              Start Slicing!
            </Button>
            
            <Button 
              onClick={() => setShowHighScores(true)}
              className="text-xl px-6 py-4 bg-orange-400 hover:bg-orange-500 text-white rounded-xl shadow-md"
            >
              High Scores
            </Button>
            
            <Button 
              onClick={() => setShowSettings(true)}
              className="text-xl px-6 py-4 bg-orange-300 hover:bg-orange-400 text-white rounded-xl shadow-md"
            >
              Settings
            </Button>
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

      {showHighScores && (
        <div className="text-center space-y-6 p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-orange-600">High Scores</h2>
          <div className="space-y-4">
            {[
              { name: "Player 1", score: 1000 },
              { name: "Player 2", score: 800 },
              { name: "Player 3", score: 600 },
            ].map((score, index) => (
              <div key={index} className="flex justify-between gap-8 text-orange-700">
                <span>{score.name}</span>
                <span>{score.score}</span>
              </div>
            ))}
          </div>
          <Button 
            onClick={() => setShowHighScores(false)}
            className="mt-6 bg-orange-500 hover:bg-orange-600 text-white"
          >
            Back to Menu
          </Button>
        </div>
      )}
    </div>
  );
};

export default MainMenu;