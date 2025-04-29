import { useGameContext } from "@/context/GameContext";
import { Button } from "@/components/ui/button";

export function GameOverModal() {
  const { 
    gameState, 
    winner,
    closeGameOverModal,
    startNewGame,
    showGameDetails
  } = useGameContext();

  if (!winner) return null;

  const roleStyles = {
    Civilian: {
      bg: "bg-civilian",
      text: "text-civilian"
    },
    Undercover: {
      bg: "bg-undercover",
      text: "text-undercover"
    },
    "Mr. White": {
      bg: "bg-mrwhite",
      text: "text-mrwhite"
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-neutral max-w-md w-full mx-4 rounded-lg overflow-hidden shadow-xl animate-slide-in">
        <div className="p-6 text-center">
          <h3 className="font-display font-bold text-2xl mb-4">Game Over!</h3>
          
          <div className="py-6">
            <div className={`w-24 h-24 mx-auto ${roleStyles[winner.role].bg} rounded-full flex items-center justify-center mb-4`}>
              <span className="text-white font-display font-bold text-xl">{winner.role}s</span>
            </div>
            <div className={`font-display font-bold text-3xl mb-4 ${roleStyles[winner.role].text}`}>
              {winner.role}s Win!
            </div>
            <p className="mb-6">
              {winner.role === "Civilian" && "All Undercover and Mr. White players have been eliminated!"}
              {winner.role === "Undercover" && "The Undercover players have successfully outnumbered the Civilians!"}
              {winner.role === "Mr. White" && winner.reason === "guess" 
                ? "Mr. White correctly guessed the Civilian's word!" 
                : "Mr. White survived to the final two players!"}
            </p>
            
            <div className="bg-gray-50 dark:bg-neutral-light p-4 rounded-lg mb-6">
              <div className="font-medium mb-2">Game Summary:</div>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Total Rounds:</span>
                  <span className="font-medium">{gameState.round}</span>
                </div>
                <div className="flex justify-between">
                  <span>Civilians Word:</span>
                  <span className="font-medium">{gameState.civilianWord}</span>
                </div>
                <div className="flex justify-between">
                  <span>Undercover Word:</span>
                  <span className="font-medium">{gameState.undercoverWord}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 font-display font-medium"
              onClick={showGameDetails}
            >
              Show Details
            </Button>
            <Button 
              className="bg-primary hover:bg-primary-dark text-white font-display font-medium"
              onClick={startNewGame}
            >
              New Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
