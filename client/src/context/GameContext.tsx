import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { generateGame, checkWinner, type GameState, type Player, type Winner } from "@/lib/gameHelpers";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface GameContextType {
  gameState: GameState;
  currentPlayerRole: string;
  currentPlayerWord?: string;
  currentPlayerName: string;
  playerNames: string[];
  eliminatedPlayer: Player | null;
  selectedPlayerForElimination: string | null;
  winner: Winner | null;
  isRoleRevealModalOpen: boolean;
  isEliminationModalOpen: boolean;
  isRevealResultModalOpen: boolean;
  isMrWhiteGuessModalOpen: boolean;
  isGameOverModalOpen: boolean;
  isRulesModalOpen: boolean;
  resetGame: () => void;
  startGame: (playerCount: number, roleDistribution: { civilians: number; undercover: number; mrWhite: number }, customNames: string[]) => void;
  openRoleRevealModal: () => void;
  closeRoleRevealModal: () => void;
  openEliminationModal: () => void;
  closeEliminationModal: () => void;
  setSelectedPlayerForElimination: (playerId: string) => void;
  eliminatePlayer: (playerId: string) => void;
  closeRevealResultModal: () => void;
  openMrWhiteGuessModal: () => void;
  closeMrWhiteGuessModal: () => void;
  handleMrWhiteGuess: (guess: string) => void;
  closeGameOverModal: () => void;
  startNewGame: () => void;
  endGame: () => void;
  showGameDetails: () => void;
  setIsRulesModalOpen: (isOpen: boolean) => void;
  openRulesModal: () => void;
}

const initialGameState: GameState = {
  gameStarted: false,
  players: [],
  round: 1,
  civilianWord: "",
  undercoverWord: "",
  gameLog: []
};

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Game state
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [currentPlayerRole, setCurrentPlayerRole] = useState<string>("");
  const [currentPlayerWord, setCurrentPlayerWord] = useState<string>("");
  const [currentPlayerName, setCurrentPlayerName] = useState<string>("");
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [eliminatedPlayer, setEliminatedPlayer] = useState<Player | null>(null);
  const [selectedPlayerForElimination, setSelectedPlayerForElimination] = useState<string | null>(null);
  const [winner, setWinner] = useState<Winner | null>(null);
  
  // Modal states
  const [isRoleRevealModalOpen, setIsRoleRevealModalOpen] = useState(false);
  const [isEliminationModalOpen, setIsEliminationModalOpen] = useState(false);
  const [isRevealResultModalOpen, setIsRevealResultModalOpen] = useState(false);
  const [isMrWhiteGuessModalOpen, setIsMrWhiteGuessModalOpen] = useState(false);
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  
  // Game actions
  const resetGame = useCallback(() => {
    setGameState(initialGameState);
    setCurrentPlayerRole("");
    setCurrentPlayerWord("");
    setCurrentPlayerName("");
    setPlayerNames([]);
    setEliminatedPlayer(null);
    setSelectedPlayerForElimination(null);
    setWinner(null);
    setIsRoleRevealModalOpen(false);
    setIsEliminationModalOpen(false);
    setIsRevealResultModalOpen(false);
    setIsMrWhiteGuessModalOpen(false);
    setIsGameOverModalOpen(false);
  }, []);
  
  const startGame = useCallback((
    playerCount: number, 
    roleDistribution: { civilians: number; undercover: number; mrWhite: number },
    customNames: string[] = []
  ) => {
    const { players, civilianWord, undercoverWord } = generateGame(playerCount, roleDistribution, customNames);
    
    // Save the player names for future use
    setPlayerNames(players.map(player => player.name));
    
    setGameState({
      gameStarted: true,
      players,
      round: 1,
      civilianWord,
      undercoverWord,
      gameLog: []
    });
  }, []);
  
  const openRoleRevealModal = useCallback(() => {
    // Randomly select a player and show their role
    if (gameState.players.length > 0) {
      const randomIndex = Math.floor(Math.random() * gameState.players.length);
      const player = gameState.players[randomIndex];
      
      setCurrentPlayerRole(player.role);
      setCurrentPlayerWord(player.word || "");
      setCurrentPlayerName(player.name);
      setIsRoleRevealModalOpen(true);
    }
  }, [gameState.players]);
  
  const closeRoleRevealModal = useCallback(() => {
    setIsRoleRevealModalOpen(false);
  }, []);
  
  const openEliminationModal = useCallback(() => {
    setIsEliminationModalOpen(true);
  }, []);
  
  const closeEliminationModal = useCallback(() => {
    setIsEliminationModalOpen(false);
    setSelectedPlayerForElimination(null);
  }, []);
  
  const eliminatePlayer = useCallback((playerId: string) => {
    setIsEliminationModalOpen(false);
    
    setGameState(prevState => {
      // Find the player to eliminate
      const playerIndex = prevState.players.findIndex(p => p.id === playerId);
      if (playerIndex === -1) return prevState;
      
      const playerToEliminate = { ...prevState.players[playerIndex], isEliminated: true };
      
      // Create updated players array
      const updatedPlayers = [...prevState.players];
      updatedPlayers[playerIndex] = playerToEliminate;
      
      // Add to game log
      const updatedGameLog = [
        ...prevState.gameLog,
        {
          round: prevState.round,
          playerName: playerToEliminate.name,
          role: playerToEliminate.role,
          word: playerToEliminate.word,
          roleColor: playerToEliminate.role === "Civilian" 
            ? "civilian" 
            : playerToEliminate.role === "Undercover" 
              ? "undercover" 
              : "mrwhite"
        }
      ];
      
      // Set the eliminated player for the result modal
      setEliminatedPlayer(playerToEliminate);
      
      // Update the round
      const nextRound = prevState.round + 1;
      
      // Check if Mr. White was eliminated
      if (playerToEliminate.role === "Mr. White") {
        setIsMrWhiteGuessModalOpen(true);
      }
      
      // Check for game winner
      const gameWinner = checkWinner(updatedPlayers);
      if (gameWinner) {
        setWinner(gameWinner);
        // Show game over after revealing the eliminated player
        setTimeout(() => {
          setIsRevealResultModalOpen(false);
          setIsGameOverModalOpen(true);
        }, 500);
      } else {
        // Otherwise, show the eliminated player result
        setIsRevealResultModalOpen(true);
      }
      
      return {
        ...prevState,
        players: updatedPlayers,
        round: nextRound,
        gameLog: updatedGameLog
      };
    });
  }, []);
  
  const closeRevealResultModal = useCallback(() => {
    setIsRevealResultModalOpen(false);
  }, []);
  
  const openMrWhiteGuessModal = useCallback(() => {
    setIsMrWhiteGuessModalOpen(true);
  }, []);
  
  const closeMrWhiteGuessModal = useCallback(() => {
    setIsMrWhiteGuessModalOpen(false);
  }, []);
  
  const handleMrWhiteGuess = useCallback((guess: string) => {
    setIsMrWhiteGuessModalOpen(false);
    
    // Check if guess matches the civilian word
    const isMrWhiteWin = guess.toLowerCase().trim() === gameState.civilianWord.toLowerCase().trim();
    
    if (isMrWhiteWin) {
      setWinner({
        role: "Mr. White",
        reason: "guess"
      });
      
      toast({
        title: "Mr. White Wins!",
        description: "Correct guess: " + gameState.civilianWord,
      });
      
      setIsGameOverModalOpen(true);
    } else {
      toast({
        title: "Incorrect Guess",
        description: "Mr. White's guess was wrong. The game continues.",
        variant: "destructive"
      });
      
      // Continue the game
      const gameWinner = checkWinner(gameState.players);
      if (gameWinner) {
        setWinner(gameWinner);
        setIsGameOverModalOpen(true);
      }
    }
  }, [gameState.civilianWord, gameState.players, toast]);
  
  const closeGameOverModal = useCallback(() => {
    setIsGameOverModalOpen(false);
  }, []);
  
  const startNewGame = useCallback(() => {
    resetGame();
    setLocation("/");
  }, [resetGame, setLocation]);
  
  const endGame = useCallback(() => {
    resetGame();
    setLocation("/");
  }, [resetGame, setLocation]);
  
  const showGameDetails = useCallback(() => {
    // Show game details or history
    setIsGameOverModalOpen(false);
  }, []);
  
  const openRulesModal = useCallback(() => {
    setIsRulesModalOpen(true);
  }, []);
  
  return (
    <GameContext.Provider
      value={{
        gameState,
        currentPlayerRole,
        currentPlayerWord,
        currentPlayerName,
        playerNames,
        eliminatedPlayer,
        selectedPlayerForElimination,
        winner,
        isRoleRevealModalOpen,
        isEliminationModalOpen,
        isRevealResultModalOpen,
        isMrWhiteGuessModalOpen,
        isGameOverModalOpen,
        isRulesModalOpen,
        resetGame,
        startGame,
        openRoleRevealModal,
        closeRoleRevealModal,
        openEliminationModal,
        closeEliminationModal,
        setSelectedPlayerForElimination,
        eliminatePlayer,
        closeRevealResultModal,
        openMrWhiteGuessModal,
        closeMrWhiteGuessModal,
        handleMrWhiteGuess,
        closeGameOverModal,
        startNewGame,
        endGame,
        showGameDetails,
        setIsRulesModalOpen,
        openRulesModal
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
