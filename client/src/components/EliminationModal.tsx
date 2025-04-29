import { useGameContext } from "@/context/GameContext";
import { Button } from "@/components/ui/button";

export function EliminationModal() {
  const { 
    gameState, 
    closeEliminationModal, 
    selectedPlayerForElimination,
    setSelectedPlayerForElimination,
    eliminatePlayer
  } = useGameContext();

  const activePlayers = gameState.players.filter(player => !player.isEliminated);

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayerForElimination(playerId);
  };

  const handleEliminate = () => {
    if (selectedPlayerForElimination) {
      eliminatePlayer(selectedPlayerForElimination);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-neutral max-w-md w-full mx-4 rounded-lg overflow-hidden shadow-xl animate-slide-in">
        <div className="p-6">
          <h3 className="font-display font-bold text-xl mb-4">Eliminate Player</h3>
          <p className="mb-4 text-gray-600 dark:text-gray-300">Select a player to eliminate from the game:</p>
          
          <div className="max-h-56 overflow-y-auto mb-4 space-y-2">
            {activePlayers.map((player) => (
              <button 
                key={player.id}
                className={`w-full text-left px-4 py-3 bg-gray-50 dark:bg-neutral-light hover:bg-gray-100 dark:hover:bg-neutral-lighter rounded-lg transition-colors flex items-center ${
                  selectedPlayerForElimination === player.id ? 'border-2 border-primary' : ''
                }`}
                onClick={() => handlePlayerSelect(player.id)}
              >
                <div className={`w-8 h-8 rounded-full bg-${player.color} text-white flex items-center justify-center font-bold mr-3`}>
                  {player.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <span>{player.name}</span>
              </button>
            ))}
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={closeEliminationModal}
              className="border-gray-300 dark:border-neutral-lighter text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-light"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleEliminate}
              disabled={!selectedPlayerForElimination}
            >
              Eliminate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
