import { useEffect } from "react";
import { useLocation } from "wouter";
import { GameSetup } from "@/components/GameSetup";
import { RulesModal } from "@/components/RulesModal";
import { useGameContext } from "@/context/GameContext";

export default function Home() {
  const [, setLocation] = useLocation();
  const { gameState, resetGame, isRulesModalOpen, setIsRulesModalOpen } = useGameContext();
  
  useEffect(() => {
    // Reset game when coming to the home page
    resetGame();
  }, [resetGame]);
  
  useEffect(() => {
    // Redirect if a game is already in progress
    if (gameState.gameStarted && gameState.players.length > 0) {
      setLocation("/game");
    }
  }, [gameState.gameStarted, gameState.players.length, setLocation]);

  return (
    <div className="animate-fade-in">
      <GameSetup />
      
      {isRulesModalOpen && (
        <RulesModal 
          onClose={() => setIsRulesModalOpen(false)} 
        />
      )}
    </div>
  );
}
