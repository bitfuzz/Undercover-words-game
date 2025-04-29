import { v4 as uuidv4 } from 'uuid';
import { getRandomWordPair } from '@shared/wordPairs';

// Game types
export type PlayerRole = "Civilian" | "Undercover" | "Mr. White";

export interface Player {
  id: string;
  gameId: string;
  name: string;
  role: PlayerRole;
  word?: string;
  isEliminated: boolean;
  color: string;
}

export interface GameLog {
  gameId: string;
  round: number;
  playerId: string;
  playerName: string;
  role: PlayerRole;
  word?: string;
  timestamp: string;
}

export interface Game {
  id: string;
  civilianWord: string;
  undercoverWord: string;
  round: number;
  status: "active" | "completed";
  players: Player[];
  gameLogs: GameLog[];
  createdAt: string;
}

export interface EliminationResult {
  eliminatedPlayer: Player;
  gameStatus: {
    round: number;
    activePlayers: number;
    totalPlayers: number;
    civilianCount: number;
    undercoverCount: number;
    mrWhiteCount: number;
  };
  winner?: {
    role: PlayerRole;
    reason: "elimination" | "guess" | "survival";
  };
}

export interface MrWhiteGuessResult {
  isCorrect: boolean;
  word?: string;
  winner?: {
    role: PlayerRole;
    reason: "guess";
  };
}

export interface IStorage {
  createGame(playerCount: number, roleDistribution: { civilians: number; undercover: number; mrWhite: number }): Promise<string>;
  getGame(gameId: string): Promise<Game | undefined>;
  getPlayer(gameId: string, playerId: string): Promise<Player | undefined>;
  eliminatePlayer(gameId: string, playerId: string): Promise<EliminationResult>;
  handleMrWhiteGuess(gameId: string, playerId: string, guess: string): Promise<MrWhiteGuessResult>;
  
  // User methods (from original)
  getUser(id: number): Promise<any>;
  getUserByUsername(username: string): Promise<any>;
  createUser(user: any): Promise<any>;
}

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

export class MemStorage implements IStorage {
  private users: Map<number, any>;
  private games: Map<string, Game>;
  userCurrentId: number;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.userCurrentId = 1;
  }

  // Game Methods
  async createGame(
    playerCount: number, 
    roleDistribution: { civilians: number; undercover: number; mrWhite: number }
  ): Promise<string> {
    // Generate game ID
    const gameId = uuidv4();
    
    // Generate word pair
    const { word1, word2 } = getRandomWordPair();
    
    // Generate player names
    const playerNames = this.generatePlayerNames(playerCount);
    
    // Create roles array
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
    roles = this.shuffleArray(roles);
    
    // Create players
    const players: Player[] = [];
    
    for (let i = 0; i < playerCount; i++) {
      const role = roles[i];
      const color = playerColors[i % playerColors.length];
      
      players.push({
        id: `${i + 1}-${uuidv4()}`,
        gameId,
        name: playerNames[i],
        role,
        word: role === "Civilian" ? word1 : role === "Undercover" ? word2 : undefined,
        isEliminated: false,
        color
      });
    }
    
    // Create game
    const game: Game = {
      id: gameId,
      civilianWord: word1,
      undercoverWord: word2,
      round: 1,
      status: "active",
      players,
      gameLogs: [],
      createdAt: new Date().toISOString()
    };
    
    // Store game
    this.games.set(gameId, game);
    
    return gameId;
  }

  async getGame(gameId: string): Promise<Game | undefined> {
    return this.games.get(gameId);
  }

  async getPlayer(gameId: string, playerId: string): Promise<Player | undefined> {
    const game = this.games.get(gameId);
    if (!game) return undefined;
    
    return game.players.find(p => p.id === playerId);
  }

  async eliminatePlayer(gameId: string, playerId: string): Promise<EliminationResult> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error("Game not found");
    }
    
    // Find player
    const playerIndex = game.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) {
      throw new Error("Player not found");
    }
    
    // Check if player is already eliminated
    if (game.players[playerIndex].isEliminated) {
      throw new Error("Player is already eliminated");
    }
    
    // Eliminate player
    const playerToEliminate = { ...game.players[playerIndex], isEliminated: true };
    game.players[playerIndex] = playerToEliminate;
    
    // Add to game log
    const gameLog: GameLog = {
      gameId,
      round: game.round,
      playerId: playerToEliminate.id,
      playerName: playerToEliminate.name,
      role: playerToEliminate.role,
      word: playerToEliminate.word,
      timestamp: new Date().toISOString()
    };
    
    game.gameLogs.push(gameLog);
    
    // Increment round
    game.round += 1;
    
    // Count remaining players by role
    const activePlayers = game.players.filter(p => !p.isEliminated);
    const civilianCount = activePlayers.filter(p => p.role === "Civilian").length;
    const undercoverCount = activePlayers.filter(p => p.role === "Undercover").length;
    const mrWhiteCount = activePlayers.filter(p => p.role === "Mr. White").length;
    
    // Check for winner
    let winner = undefined;
    
    // Only 1 player left
    if (activePlayers.length === 1) {
      winner = {
        role: activePlayers[0].role,
        reason: "survival" as const
      };
      game.status = "completed";
    }
    
    // Only 2 players left, and one is Mr. White
    if (activePlayers.length === 2 && activePlayers.some(p => p.role === "Mr. White")) {
      winner = {
        role: "Mr. White",
        reason: "survival" as const
      };
      game.status = "completed";
    }
    
    // Check if Civilians win (no Undercover or Mr. White left)
    if (!undercoverCount && !mrWhiteCount && civilianCount > 0) {
      winner = {
        role: "Civilian",
        reason: "elimination" as const
      };
      game.status = "completed";
    }
    
    // Check if Undercover win (equal or outnumber Civilians, and no Mr. White)
    if (!mrWhiteCount && undercoverCount > 0 && undercoverCount >= civilianCount) {
      winner = {
        role: "Undercover",
        reason: "elimination" as const
      };
      game.status = "completed";
    }
    
    // Save updated game
    this.games.set(gameId, game);
    
    return {
      eliminatedPlayer: playerToEliminate,
      gameStatus: {
        round: game.round,
        activePlayers: activePlayers.length,
        totalPlayers: game.players.length,
        civilianCount,
        undercoverCount,
        mrWhiteCount
      },
      winner
    };
  }

  async handleMrWhiteGuess(gameId: string, playerId: string, guess: string): Promise<MrWhiteGuessResult> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error("Game not found");
    }
    
    // Find player
    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error("Player not found");
    }
    
    // Check if player is Mr. White and is eliminated
    if (player.role !== "Mr. White" || !player.isEliminated) {
      throw new Error("Only an eliminated Mr. White can guess");
    }
    
    // Check if guess is correct
    const isCorrect = guess.toLowerCase().trim() === game.civilianWord.toLowerCase().trim();
    
    // If correct, Mr. White wins
    if (isCorrect) {
      game.status = "completed";
      
      // Save updated game
      this.games.set(gameId, game);
      
      return {
        isCorrect: true,
        word: game.civilianWord,
        winner: {
          role: "Mr. White",
          reason: "guess"
        }
      };
    }
    
    return {
      isCorrect: false
    };
  }

  // Helper methods
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private generatePlayerNames(count: number): string[] {
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
  }

  // User methods (from original template)
  async getUser(id: number): Promise<any> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = this.userCurrentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
