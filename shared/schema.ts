import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Game schema
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  gameId: text("game_id").notNull().unique(),
  civilianWord: text("civilian_word").notNull(),
  undercoverWord: text("undercover_word").notNull(),
  round: integer("round").notNull().default(1),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull(),
});

// Players schema
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  gameId: text("game_id").notNull(),
  playerId: text("player_id").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  word: text("word"),
  isEliminated: boolean("is_eliminated").notNull().default(false),
  color: text("color").notNull(),
});

// Game logs schema
export const gameLogs = pgTable("game_logs", {
  id: serial("id").primaryKey(),
  gameId: text("game_id").notNull(),
  round: integer("round").notNull(),
  playerId: text("player_id").notNull(),
  playerName: text("player_name").notNull(),
  role: text("role").notNull(),
  word: text("word"),
  timestamp: text("timestamp").notNull(),
});

// Word pairs schema
export const wordPairs = pgTable("word_pairs", {
  id: serial("id").primaryKey(),
  word1: text("word1").notNull(),
  word2: text("word2").notNull(),
});

// Insert schemas
export const insertGameSchema = createInsertSchema(games).omit({ id: true });
export const insertPlayerSchema = createInsertSchema(players).omit({ id: true });
export const insertGameLogSchema = createInsertSchema(gameLogs).omit({ id: true });
export const insertWordPairSchema = createInsertSchema(wordPairs).omit({ id: true });

// Types
export type InsertGame = z.infer<typeof insertGameSchema>;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type InsertGameLog = z.infer<typeof insertGameLogSchema>;
export type InsertWordPair = z.infer<typeof insertWordPairSchema>;

export type Game = typeof games.$inferSelect;
export type Player = typeof players.$inferSelect;
export type GameLog = typeof gameLogs.$inferSelect;
export type WordPair = typeof wordPairs.$inferSelect;

// Users schema (keeping existing user schema)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
