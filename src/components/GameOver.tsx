import { Button } from "@/components/ui/button";

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

const GameOver = ({ score, onRestart }: GameOverProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h2 className="text-4xl font-bold text-destructive mb-4">Game Over!</h2>
      <p className="text-2xl mb-8">Score: {score}</p>
      <Button 
        onClick={onRestart}
        className="text-xl px-6 py-4 bg-secondary hover:bg-secondary/90"
      >
        Play Again
      </Button>
    </div>
  );
};

export default GameOver;