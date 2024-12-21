import { Button } from "@/components/ui/button";

interface MainMenuProps {
  onStartGame: () => void;
}

const MainMenu = ({ onStartGame }: MainMenuProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-6xl font-bold text-primary mb-8">Food Slicer</h1>
      <Button 
        onClick={onStartGame}
        className="text-2xl px-8 py-6 bg-secondary hover:bg-secondary/90"
      >
        Start Game
      </Button>
    </div>
  );
};

export default MainMenu;