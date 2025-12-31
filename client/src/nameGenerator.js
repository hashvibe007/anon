const adjectives = [
  'Swift', 'Brave', 'Clever', 'Mystic', 'Silent', 'Cosmic', 'Golden', 'Silver',
  'Mighty', 'Noble', 'Fancy', 'Lucky', 'Happy', 'Jolly', 'Wild', 'Cool',
  'Epic', 'Bold', 'Bright', 'Calm', 'Daring', 'Eager', 'Fierce', 'Gentle',
  'Wise', 'Witty', 'Zesty', 'Quirky', 'Bouncy', 'Sneaky', 'Shiny', 'Fuzzy',
  'Turbo', 'Ninja', 'Pixel', 'Neon', 'Electric', 'Cyber', 'Stellar', 'Arctic'
];

const nouns = [
  'Panda', 'Tiger', 'Eagle', 'Dragon', 'Phoenix', 'Wolf', 'Fox', 'Lion',
  'Hawk', 'Bear', 'Shark', 'Falcon', 'Otter', 'Raven', 'Lynx', 'Cobra',
  'Jaguar', 'Panther', 'Sparrow', 'Owl', 'Dolphin', 'Penguin', 'Koala',
  'Raccoon', 'Squirrel', 'Badger', 'Hedgehog', 'Flamingo', 'Unicorn', 'Wizard',
  'Knight', 'Warrior', 'Nomad', 'Voyager', 'Explorer', 'Ranger', 'Hunter',
  'Sage', 'Mystic', 'Shadow'
];

export const generateRandomName = () => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 100);
  return `${adjective}${noun}${number}`;
};

export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return 'Name cannot be empty';
  }
  if (name.trim().length > 20) {
    return 'Name must be 20 characters or less';
  }
  if (!/^[a-zA-Z0-9_]+$/.test(name.trim())) {
    return 'Name can only contain letters, numbers, and underscores';
  }
  return null;
};
