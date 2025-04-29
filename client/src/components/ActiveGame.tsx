import { useGameContext } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { PlayerItem } from "@/components/PlayerItem";
import { 
  QuestionMarkCircledIcon, 
  LightningBoltIcon,
  ReloadIcon, 
  Cross2Icon
} from "@radix-ui/react-icons";

export function ActiveGame() {
  const { 
    gameState, 
    openRoleRevealModal, 
    openEliminationModal,
    openRulesModal,
    openMrWhiteGuessModal,
    startNewGame,
    endGame
  } = useGameContext();

  const activePlayers = gameState.players.filter(player => !player.isEliminated);
  const civilianCount = activePlayers.filter(p => p.role === "Civilian").length;
  const undercoverCount = activePlayers.filter(p => p.role === "Undercover").length;
  const mrWhiteCount = activePlayers.filter(p => p.role === "Mr. White").length;
  
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left Panel: Game Controls */}
      <div className="md:w-1/3">
        <div className="bg-white dark:bg-neutral rounded-lg shadow-md p-6 mb-6">
          <h2 className="font-display font-bold text-xl mb-4">Game Status</h2>
          
          <div className="flex justify-between mb-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Round</div>
              <div className="font-bold text-2xl">{gameState.round}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Players Remaining</div>
              <div className="font-bold text-2xl">{activePlayers.length}/{gameState.players.length}</div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-neutral-lighter pt-4 mb-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Active Roles</div>
            <div className="flex space-x-2 flex-wrap">
              <div className="bg-gray-100 dark:bg-neutral-light py-1 px-3 rounded-full text-sm mb-2">
                <span className="font-medium text-civilian">Civilians:</span> {civilianCount}
              </div>
              <div className="bg-gray-100 dark:bg-neutral-light py-1 px-3 rounded-full text-sm mb-2">
                <span className="font-medium text-undercover">Undercover:</span> {undercoverCount}
              </div>
              <div className="bg-gray-100 dark:bg-neutral-light py-1 px-3 rounded-full text-sm mb-2">
                <span className="font-medium text-mrwhite">Mr. White:</span> {mrWhiteCount}
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-display font-bold rounded-lg mb-3 transition-colors"
            onClick={openRoleRevealModal}
          >
            Reveal My Role
          </Button>
          
          <Button 
            variant="outline"
            className="w-full py-3 border border-primary text-primary hover:bg-primary/10 font-display font-bold rounded-lg transition-colors"
            onClick={openEliminationModal}
          >
            Eliminate Player
          </Button>
        </div>
        
        <div className="bg-white dark:bg-neutral rounded-lg shadow-md p-6">
          <h2 className="font-display font-bold text-xl mb-4">Game Actions</h2>
          <div className="space-y-2">
            <button 
              className="w-full py-2 text-left px-3 bg-gray-100 dark:bg-neutral-light hover:bg-gray-200 dark:hover:bg-neutral-lighter rounded transition-colors flex items-center"
              onClick={openRulesModal}
            >
              <span className="w-6 h-6 inline-flex items-center justify-center mr-2 bg-gray-200 dark:bg-neutral rounded-full text-xs">
                <QuestionMarkCircledIcon className="h-4 w-4" />
              </span>
              Show Game Rules
            </button>
            <button 
              className="w-full py-2 text-left px-3 bg-gray-100 dark:bg-neutral-light hover:bg-gray-200 dark:hover:bg-neutral-lighter rounded transition-colors flex items-center"
              onClick={openMrWhiteGuessModal}
            >
              <span className="w-6 h-6 inline-flex items-center justify-center mr-2 bg-gray-200 dark:bg-neutral rounded-full text-xs">
                <LightningBoltIcon className="h-4 w-4" />
              </span>
              Mr. White Guess
            </button>
            <button 
              className="w-full py-2 text-left px-3 bg-gray-100 dark:bg-neutral-light hover:bg-gray-200 dark:hover:bg-neutral-lighter rounded transition-colors flex items-center"
              onClick={startNewGame}
            >
              <span className="w-6 h-6 inline-flex items-center justify-center mr-2 bg-gray-200 dark:bg-neutral rounded-full text-xs">
                <ReloadIcon className="h-4 w-4" />
              </span>
              New Game
            </button>
            <button 
              className="w-full py-2 text-left px-3 bg-gray-100 dark:bg-neutral-light hover:bg-gray-200 dark:hover:bg-neutral-lighter rounded transition-colors flex items-center"
              onClick={endGame}
            >
              <span className="w-6 h-6 inline-flex items-center justify-center mr-2 bg-gray-200 dark:bg-neutral rounded-full text-xs">
                <Cross2Icon className="h-4 w-4" />
              </span>
              End Game
            </button>
          </div>
        </div>
      </div>
      
      {/* Right Panel: Players */}
      <div className="md:w-2/3">
        <div className="bg-white dark:bg-neutral rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display font-bold text-xl">Players</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">Tap to select for elimination</div>
          </div>
          
          <div className="space-y-3">
            {gameState.players.map((player) => (
              <PlayerItem 
                key={player.id} 
                player={player} 
                onClick={() => {}} 
              />
            ))}
          </div>
        </div>
        
        <div className="bg-white dark:bg-neutral rounded-lg shadow-md p-6">
          <h2 className="font-display font-bold text-xl mb-4">Game History</h2>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {gameState.gameLog.map((log, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-neutral-light rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  {log.round}
                </div>
                <div>
                  <p className="text-sm mb-1">
                    <span className="font-medium">{log.playerName}</span> was eliminated - Role: <span className={`text-${log.roleColor} font-medium`}>{log.role}</span>
                  </p>
                  {log.word && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">Word: <span className="font-medium">{log.word}</span></p>
                  )}
                </div>
              </div>
            ))}
            
            {gameState.gameLog.length > 0 && (
              <div className="border-t border-gray-100 dark:border-neutral-lighter pt-2"></div>
            )}
            
            <div className="text-sm text-gray-500 dark:text-gray-400 italic text-center">
              Game started with {gameState.players.length} players
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
