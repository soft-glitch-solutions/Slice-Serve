import { Button } from "@/components/ui/button";

interface MainMenuProps {
  onStartGame: () => void;
}

const MainMenu = ({ onStartGame }: MainMenuProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-orange-600 mb-4">Food Slicer</h1>
          <p className="text-xl text-orange-700">
            Slice food into equal portions to feed hungry people!
          </p>
          <p className="text-orange-500">
            Each level is a unique challenge. How precise can you be?
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

        <Button 
          onClick={onStartGame}
          className="text-2xl px-8 py-6 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg transform transition hover:scale-105"
        >
          Start Slicing!
        </Button>
      </div>
    </div>
  );
};

export default MainMenu;