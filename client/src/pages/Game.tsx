import { useEffect } from "react";
import { useLocation } from "wouter";
import { useGameContext } from "@/context/GameContext";
import { ActiveGame } from "@/components/ActiveGame";
import { RoleRevealModal } from "@/components/RoleRevealModal";
import { EliminationModal } from "@/components/EliminationModal";
import { RevealResultModal } from "@/components/RevealResultModal";
import { MrWhiteGuessModal } from "@/components/MrWhiteGuessModal";
import { GameOverModal } from "@/components/GameOverModal";
import { RulesModal } from "@/components/RulesModal";

export default function Game() {
  const [, setLocation] = useLocation();
  const { 
    gameState, 
    isRoleRevealModalOpen,
    isEliminationModalOpen,
    isRevealResultModalOpen,
    isMrWhiteGuessModalOpen,
    isGameOverModalOpen,
    isRulesModalOpen,
    setIsRulesModalOpen
  } = useGameContext();
  
  useEffect(() => {
    // If no game is in progress, redirect to home
    if (!gameState.gameStarted || gameState.players.length === 0) {
      setLocation("/");
    }
  }, [gameState.gameStarted, gameState.players.length, setLocation]);

  return (
    <div className="animate-fade-in">
      <ActiveGame />
      
      {isRoleRevealModalOpen && <RoleRevealModal />}
      {isEliminationModalOpen && <EliminationModal />}
      {isRevealResultModalOpen && <RevealResultModal />}
      {isMrWhiteGuessModalOpen && <MrWhiteGuessModal />}
      {isGameOverModalOpen && <GameOverModal />}
      {isRulesModalOpen && <RulesModal onClose={() => setIsRulesModalOpen(false)} />}
    </div>
  );
}
