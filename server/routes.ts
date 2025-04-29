import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getRandomWordPair } from "@shared/wordPairs";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  app.get("/api/game/word-pairs", async (req, res) => {
    try {
      const wordPair = getRandomWordPair();
      res.json(wordPair);
    } catch (error) {
      console.error("Error getting word pair:", error);
      res.status(500).json({ message: "Failed to get word pair" });
    }
  });

  app.post("/api/game/create", async (req, res) => {
    try {
      const { playerCount, roleDistribution } = req.body;
      
      if (!playerCount || !roleDistribution) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const gameId = await storage.createGame(playerCount, roleDistribution);
      res.json({ gameId });
    } catch (error) {
      console.error("Error creating game:", error);
      res.status(500).json({ message: "Failed to create game" });
    }
  });

  app.get("/api/game/:gameId", async (req, res) => {
    try {
      const { gameId } = req.params;
      const game = await storage.getGame(gameId);
      
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      res.json(game);
    } catch (error) {
      console.error("Error getting game:", error);
      res.status(500).json({ message: "Failed to get game" });
    }
  });

  app.post("/api/game/:gameId/eliminate", async (req, res) => {
    try {
      const { gameId } = req.params;
      const { playerId } = req.body;
      
      if (!playerId) {
        return res.status(400).json({ message: "Missing player ID" });
      }
      
      const result = await storage.eliminatePlayer(gameId, playerId);
      res.json(result);
    } catch (error) {
      console.error("Error eliminating player:", error);
      res.status(500).json({ message: "Failed to eliminate player" });
    }
  });

  app.post("/api/game/:gameId/mr-white-guess", async (req, res) => {
    try {
      const { gameId } = req.params;
      const { playerId, guess } = req.body;
      
      if (!playerId || !guess) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const result = await storage.handleMrWhiteGuess(gameId, playerId, guess);
      res.json(result);
    } catch (error) {
      console.error("Error handling Mr. White guess:", error);
      res.status(500).json({ message: "Failed to process Mr. White guess" });
    }
  });

  app.get("/api/game/:gameId/player/:playerId", async (req, res) => {
    try {
      const { gameId, playerId } = req.params;
      const player = await storage.getPlayer(gameId, playerId);
      
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      res.json(player);
    } catch (error) {
      console.error("Error getting player:", error);
      res.status(500).json({ message: "Failed to get player" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
