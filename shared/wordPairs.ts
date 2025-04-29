// Word pairs for the Undercover game
// Each pair consists of related but different words

export interface WordPair {
  word1: string;
  word2: string;
}

export const wordPairs: WordPair[] = [
  { word1: "Apple", word2: "Banana" },
  { word1: "Dog", word2: "Cat" },
  { word1: "Sun", word2: "Moon" },
  { word1: "Coffee", word2: "Tea" },
  { word1: "Car", word2: "Bus" },
  { word1: "Beach", word2: "Mountain" },
  { word1: "Book", word2: "Magazine" },
  { word1: "Guitar", word2: "Piano" },
  { word1: "Sneakers", word2: "Sandals" },
  { word1: "Pencil", word2: "Pen" },
  { word1: "Phone", word2: "Computer" },
  { word1: "River", word2: "Lake" },
  { word1: "Winter", word2: "Summer" },
  { word1: "Fork", word2: "Spoon" },
  { word1: "Chair", word2: "Sofa" },
  { word1: "Soccer", word2: "Basketball" },
  { word1: "Shirt", word2: "Jacket" },
  { word1: "Camera", word2: "Binoculars" },
  { word1: "Butterfly", word2: "Bee" },
  { word1: "Train", word2: "Subway" },
  { word1: "Pizza", word2: "Burger" },
  { word1: "Hotel", word2: "Motel" },
  { word1: "Violin", word2: "Cello" },
  { word1: "Theater", word2: "Cinema" },
  { word1: "Doctor", word2: "Nurse" },
  { word1: "Painting", word2: "Drawing" },
  { word1: "Ocean", word2: "Sea" },
  { word1: "Airplane", word2: "Helicopter" },
  { word1: "Sweater", word2: "Hoodie" },
  { word1: "Strawberry", word2: "Raspberry" },
  { word1: "Milk", word2: "Juice" },
  { word1: "Mouse", word2: "Rat" },
  { word1: "Breakfast", word2: "Dinner" },
  { word1: "Sky", word2: "Cloud" },
  { word1: "Keyboard", word2: "Mouse" },
  { word1: "Map", word2: "Globe" },
  { word1: "Fire", word2: "Smoke" },
  { word1: "Hospital", word2: "Clinic" },
  { word1: "Backpack", word2: "Suitcase" },
  { word1: "Bicycle", word2: "Motorcycle" },
  { word1: "Socks", word2: "Gloves" },
  { word1: "Watch", word2: "Clock" },
  { word1: "Bowl", word2: "Plate" },
  { word1: "Elephant", word2: "Giraffe" },
  { word1: "Diamond", word2: "Ruby" },
  { word1: "Scissors", word2: "Knife" },
  { word1: "Hammer", word2: "Screwdriver" },
  { word1: "Shower", word2: "Bath" },
  { word1: "Glasses", word2: "Contacts" },
  { word1: "Football", word2: "Rugby" }
];

// Function to get a random word pair
export function getRandomWordPair(): WordPair {
  const randomIndex = Math.floor(Math.random() * wordPairs.length);
  return wordPairs[randomIndex];
}

// Function to get a specific word pair by index
export function getWordPairByIndex(index: number): WordPair {
  if (index < 0 || index >= wordPairs.length) {
    throw new Error(`Index out of range: ${index}. Valid range is 0-${wordPairs.length - 1}`);
  }
  return wordPairs[index];
}

// Function to add a new word pair (useful for server-side expansion)
export function addWordPair(word1: string, word2: string): void {
  wordPairs.push({ word1, word2 });
}
