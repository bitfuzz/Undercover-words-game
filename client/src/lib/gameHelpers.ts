import { v4 as uuidv4 } from "uuid";
import { getRandomWordPair } from "@shared/wordPairs";

// Define player colors
const playerColors = [
  "primary", 
  "secondary", 
  "purple-500", 
  "indigo-500", 
  "blue-500", 
  "green-500", 
  "yellow-500", 
  "orange-500", 
  "red-500", 
  "pink-500"
];

// Game types
export type PlayerRole = "Civilian" | "Undercover" | "Mr. White";

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  word?: string;
  isEliminated: boolean;
  color: string;
}

export interface GameLog {
  round: number;
  playerName: string;
  role: PlayerRole;
  word?: string;
  roleColor: string;
}

export interface GameState {
  gameStarted: boolean;
  players: Player[];
  round: number;
  civilianWord: string;
  undercoverWord: string;
  gameLog: GameLog[];
}

export interface Winner {
  role: PlayerRole;
  reason: "elimination" | "guess" | "survival";
}

// Generate a new game
export const generateGame = (
  playerCount: number, 
  roleDistribution: { civilians: number; undercover: number; mrWhite: number },
  customNames: string[] = []
) => {
  // Generate random word pair
  const { word1, word2 } = getRandomWordPair();
  
  // Create players array
  let players: Player[] = [];
  
  // Use custom names if provided, otherwise generate random names
  let playerNames = customNames.length === playerCount 
    ? customNames 
    : generatePlayerNames(playerCount);
  
  // Assign roles
  let roles: PlayerRole[] = [];
  
  // Add civilians
  for (let i = 0; i < roleDistribution.civilians; i++) {
    roles.push("Civilian");
  }
  
  // Add undercover
  for (let i = 0; i < roleDistribution.undercover; i++) {
    roles.push("Undercover");
  }
  
  // Add Mr. White
  for (let i = 0; i < roleDistribution.mrWhite; i++) {
    roles.push("Mr. White");
  }
  
  // Shuffle roles
  roles = shuffleArray(roles);
  
  // Create players with assigned roles
  for (let i = 0; i < playerCount; i++) {
    const role = roles[i];
    const color = playerColors[i % playerColors.length];
    
    players.push({
      id: `${i + 1}-${uuidv4()}`,
      name: playerNames[i],
      role,
      word: role === "Civilian" ? word1 : role === "Undercover" ? word2 : undefined,
      isEliminated: false,
      color
    });
  }
  
  return {
    players,
    civilianWord: word1,
    undercoverWord: word2
  };
};

// Determine winner (if any)
export const checkWinner = (players: Player[]): Winner | null => {
  const activePlayers = players.filter(p => !p.isEliminated);
  
  // Only 1 player left
  if (activePlayers.length === 1) {
    return {
      role: activePlayers[0].role,
      reason: "survival"
    };
  }
  
  // Only 2 players left, and one is Mr. White
  if (activePlayers.length === 2 && activePlayers.some(p => p.role === "Mr. White")) {
    return {
      role: "Mr. White",
      reason: "survival"
    };
  }
  
  // Check if Civilians win (no Undercover or Mr. White left)
  const hasUndercover = activePlayers.some(p => p.role === "Undercover");
  const hasMrWhite = activePlayers.some(p => p.role === "Mr. White");
  
  if (!hasUndercover && !hasMrWhite && activePlayers.length > 0) {
    return {
      role: "Civilian",
      reason: "elimination"
    };
  }
  
  // Check if Undercover win (equal or outnumber Civilians, and no Mr. White)
  const civilianCount = activePlayers.filter(p => p.role === "Civilian").length;
  const undercoverCount = activePlayers.filter(p => p.role === "Undercover").length;
  
  if (!hasMrWhite && undercoverCount > 0 && undercoverCount >= civilianCount) {
    return {
      role: "Undercover",
      reason: "elimination"
    };
  }
  
  return null;
};

// Helper function to shuffle an array
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate player names
const generatePlayerNames = (count: number): string[] => {
  const firstNames = [
    "John", "Jane", "Alex", "Sam", "Mike", "Sarah", "David", "Emma", 
    "Chris", "Lisa", "Tom", "Anna", "Mark", "Laura", "James", "Amy", 
    "Daniel", "Olivia", "Ryan", "Emily"
  ];
  
  const lastNames = [
    "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller",
    "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White",
    "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson"
  ];
  
  let names: string[] = [];
  const usedIndices = new Set<number>();
  
  for (let i = 0; i < count; i++) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * firstNames.length);
    } while (usedIndices.has(randomIndex));
    
    usedIndices.add(randomIndex);
    
    const firstName = firstNames[randomIndex];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    names.push(`${firstName} ${lastName}`);
  }
  
  return names;
};
