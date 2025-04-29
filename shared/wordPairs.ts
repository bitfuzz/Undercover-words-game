// Word pairs for the Undercover game
// Pairs are loaded from a JSON file

export interface WordPair {
  word1: string;
  word2: string;
}

// A cache for word pairs once loaded
let loadedWordPairs: WordPair[] = [];

// Function to load word pairs from JSON file
async function loadWordPairs(): Promise<WordPair[]> {
  try {
    // Only load once if already loaded
    if (loadedWordPairs.length > 0) {
      return loadedWordPairs;
    }

    // Fetch word pairs from JSON file
    const response = await fetch('/wordPairs.json');
    
    if (!response.ok) {
      throw new Error(`Failed to load word pairs: ${response.status} ${response.statusText}`);
    }
    
    // Parse the JSON data from the format [[word1, word2], [word1, word2], ...]
    const pairsArray: string[][] = await response.json();
    
    // Convert to WordPair objects
    loadedWordPairs = pairsArray.map(pair => ({
      word1: pair[0],
      word2: pair[1]
    }));
    
    return loadedWordPairs;
  } catch (error) {
    console.error('Error loading word pairs:', error);
    // Fallback to default pairs if loading fails
    return defaultWordPairs();
  }
}

// Default word pairs as fallback
function defaultWordPairs(): WordPair[] {
  return [
    { word1: "Apple", word2: "Banana" },
    { word1: "Dog", word2: "Cat" },
    { word1: "Sun", word2: "Moon" },
    { word1: "Coffee", word2: "Tea" },
    { word1: "Car", word2: "Bus" }
  ];
}

// Function to get a random word pair
export async function getRandomWordPair(): Promise<WordPair> {
  const pairs = await loadWordPairs();
  const randomIndex = Math.floor(Math.random() * pairs.length);
  return pairs[randomIndex];
}

// Function to get a specific word pair by index
export async function getWordPairByIndex(index: number): Promise<WordPair> {
  const pairs = await loadWordPairs();
  if (index < 0 || index >= pairs.length) {
    throw new Error(`Index out of range: ${index}. Valid range is 0-${pairs.length - 1}`);
  }
  return pairs[index];
}

// Function to get all word pairs
export async function getAllWordPairs(): Promise<WordPair[]> {
  return await loadWordPairs();
}

// Synchronous version to get all word pairs (will return empty array if not loaded yet)
export function getLoadedWordPairs(): WordPair[] {
  return loadedWordPairs;
}

// Function to add a new word pair to memory (not persisted to JSON)
export function addWordPair(word1: string, word2: string): void {
  loadedWordPairs.push({ word1, word2 });
}
