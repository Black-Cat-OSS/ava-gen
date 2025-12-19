/**
 * Generate random mnemonic seed phrase for avatar generation
 * Creates a memorable phrase from adjectives and nouns with a random number
 */
export const generateMnemonicSeed = (): string => {
  const adjectives = [
    'bright', 'dark', 'happy', 'sad', 'fast', 'slow', 'big', 'small',
    'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown',
    'cool', 'warm', 'hot', 'cold', 'soft', 'hard', 'smooth', 'rough',
    'loud', 'quiet', 'high', 'low', 'deep', 'shallow', 'wide', 'narrow',
  ];

  const nouns = [
    'cat', 'dog', 'bird', 'fish', 'tree', 'flower', 'star', 'moon',
    'sun', 'cloud', 'mountain', 'river', 'ocean', 'forest', 'desert', 'castle',
    'house', 'car', 'bike', 'book', 'music', 'dance', 'dream', 'magic',
    'light', 'shadow', 'fire', 'ice', 'wind', 'earth', 'sky',
  ];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 999) + 1;

  return `${adjective}-${noun}-${number}`.substring(0, 32);
};