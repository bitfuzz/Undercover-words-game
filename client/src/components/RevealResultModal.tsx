import { useGameContext } from "@/context/GameContext";
import { Button } from "@/components/ui/button";

export function RevealResultModal() {
  const { 
    gameState, 
    eliminatedPlayer,
    closeRevealResultModal
  } = useGameContext();

  if (!eliminatedPlayer) return null;

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

  const civilianCount = gameState.players.filter(p => !p.isEliminated && p.role === "Civilian").length;
  const undercoverCount = gameState.players.filter(p => !p.isEliminated && p.role === "Undercover").length;
  const mrWhiteCount = gameState.players.filter(p => !p.isEliminated && p.role === "Mr. White").length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-neutral max-w-md w-full mx-4 rounded-lg overflow-hidden shadow-xl animate-slide-in">
        <div className="p-6 text-center">
          <h3 className="font-display font-bold text-2xl mb-4">Player Eliminated!</h3>
          
          <div className="py-6">
            <div className={`w-24 h-24 mx-auto ${roleStyles[eliminatedPlayer.role].bg} rounded-full flex items-center justify-center mb-4`}>
              <span className="text-white font-display font-bold text-xl">{eliminatedPlayer.role}</span>
            </div>
            <div className="text-lg mb-1">{eliminatedPlayer.name} was</div>
            <div className={`font-display font-bold text-3xl ${roleStyles[eliminatedPlayer.role].text} mb-4`}>
              {eliminatedPlayer.role}
            </div>
            
            {eliminatedPlayer.role !== "Mr. White" && (
              <>
                <div className="text-lg mb-2">Their secret word was:</div>
                <div className="text-2xl font-display font-bold bg-gray-100 dark:bg-neutral py-3 rounded-lg mb-6">
                  {eliminatedPlayer.word}
                </div>
              </>
            )}
            
            <div className="bg-gray-50 dark:bg-neutral-light p-4 rounded-lg text-left">
              <div className="font-medium mb-1">Game Status:</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Civilians remaining:</span>
                  <span className="font-medium">{civilianCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Undercover remaining:</span>
                  <span className="font-medium">{undercoverCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mr. White remaining:</span>
                  <span className="font-medium">{mrWhiteCount}</span>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            className="py-3 px-6 bg-primary hover:bg-primary-dark text-white font-display font-medium"
            onClick={closeRevealResultModal}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
