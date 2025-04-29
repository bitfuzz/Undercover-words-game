// Word pairs for the Undercover game
// Instead of loading from JSON, we'll hardcode the data here for now
// This is temporary until we can fix the JSON loading issue

export interface WordPair {
  word1: string;
  word2: string;
}

// Predefined word pairs array to mimic what we'd get from the JSON
const WORD_PAIRS_DATA: [string, string][] = [
  ["Apple", "Banana"],
  ["Dog", "Cat"],
  ["Sun", "Moon"],
  ["Coffee", "Tea"],
  ["Car", "Bus"],
  ["Beach", "Mountain"],
  ["Book", "Magazine"],
  ["Guitar", "Piano"],
  ["Sneakers", "Sandals"],
  ["Pencil", "Pen"],
  ["Phone", "Computer"],
  ["River", "Lake"],
  ["Winter", "Summer"],
  ["Fork", "Spoon"],
  ["Chair", "Sofa"],
  ["Soccer", "Basketball"],
  ["Shirt", "Jacket"],
  ["Camera", "Binoculars"],
  ["Butterfly", "Bee"],
  ["Train", "Subway"],
  ["Pizza", "Burger"],
  ["Hotel", "Motel"],
  ["Violin", "Cello"],
  ["Theater", "Cinema"],
  ["Doctor", "Nurse"],
  ["Painting", "Drawing"],
  ["Ocean", "Sea"],
  ["Airplane", "Helicopter"],
  ["Sweater", "Hoodie"],
  ["Strawberry", "Raspberry"],
  ["Milk", "Juice"],
  ["Mouse", "Rat"],
  ["Breakfast", "Dinner"],
  ["Sky", "Cloud"],
  ["Keyboard", "Mouse"],
  ["Map", "Globe"],
  ["Fire", "Smoke"],
  ["Hospital", "Clinic"],
  ["Backpack", "Suitcase"],
  ["Bicycle", "Motorcycle"],
  ["Socks", "Gloves"],
  ["Watch", "Clock"],
  ["Bowl", "Plate"],
  ["Elephant", "Giraffe"],
  ["Diamond", "Ruby"],
  ["Scissors", "Knife"],
  ["Hammer", "Screwdriver"],
  ["Shower", "Bath"],
  ["Glasses", "Contacts"],
  ["Football", "Rugby"],
  ["Lion", "Tiger"]
];

// Convert the raw array data to WordPair objects
const loadedWordPairs: WordPair[] = WORD_PAIRS_DATA.map(([word1, word2]) => ({
  word1,
  word2
}));

// Function to load word pairs - now returns synchronously since we have the data already
async function loadWordPairs(): Promise<WordPair[]> {
  console.log('Using internal word pairs list with', loadedWordPairs.length, 'pairs');
  return Promise.resolve(loadedWordPairs);
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
