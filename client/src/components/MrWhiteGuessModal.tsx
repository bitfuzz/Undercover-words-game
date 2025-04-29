import { useState } from "react";
import { useGameContext } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MrWhiteGuessModal() {
  const { 
    gameState, 
    eliminatedPlayer,
    handleMrWhiteGuess,
    closeMrWhiteGuessModal
  } = useGameContext();

  const [guess, setGuess] = useState("");

  if (!eliminatedPlayer || eliminatedPlayer.role !== "Mr. White") return null;

  const handleSubmit = () => {
    if (guess.trim()) {
      handleMrWhiteGuess(guess);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-neutral max-w-md w-full mx-4 rounded-lg overflow-hidden shadow-xl animate-slide-in">
        <div className="p-6 text-center">
          <h3 className="font-display font-bold text-2xl mb-2">Mr. White's Guess</h3>
          
          <div className="py-6">
            <div className="w-24 h-24 mx-auto bg-mrwhite rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-display font-bold text-xl">Mr. White</span>
            </div>
            <p className="mb-6">
              <span className="font-medium">{eliminatedPlayer.name}</span> was Mr. White and has been eliminated.
              They now have one chance to guess the Civilian word to win the game!
            </p>
            
            <div className="mb-6">
              <label htmlFor="mrwhite-word-guess" className="block text-sm font-medium mb-1 text-left">Word Guess:</label>
              <Input 
                type="text" 
                id="mrwhite-word-guess" 
                className="w-full p-3 border border-gray-300 dark:border-neutral-lighter dark:bg-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" 
                placeholder="Enter your guess here"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline"
              className="border-gray-300 dark:border-neutral-lighter text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-light font-display font-medium"
              onClick={closeMrWhiteGuessModal}
            >
              Cancel
            </Button>
            <Button 
              className="bg-primary hover:bg-primary-dark text-white font-display font-medium"
              onClick={handleSubmit}
              disabled={!guess.trim()}
            >
              Submit Guess
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
