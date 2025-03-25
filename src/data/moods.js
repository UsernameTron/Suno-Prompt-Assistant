/**
 * Music moods data for Suno AI prompt optimization
 * Each mood has related keywords and examples of usage in prompts
 */

const moods = [
  {
    id: "happy",
    name: "Happy",
    keywords: ["joyful", "upbeat", "cheerful", "bright", "sunny", "optimistic", "euphoric", "gleeful", "uplifting"],
    description: "Positive and joyful emotional tone",
    examples: ["Happy upbeat rhythm", "Joyful celebration music"]
  },
  {
    id: "sad",
    name: "Sad",
    keywords: ["melancholic", "sorrowful", "gloomy", "downbeat", "depressing", "somber", "mournful", "tearful", "wistful"],
    description: "Expressing sorrow or unhappiness",
    examples: ["Sad piano ballad", "Melancholic emotional piece"]
  },
  {
    id: "angry",
    name: "Angry",
    keywords: ["aggressive", "intense", "furious", "rage", "hostile", "fierce", "violent", "wrathful", "stormy"],
    description: "Expressing anger or aggression",
    examples: ["Angry guitar riffs", "Aggressive tone with intense drums"]
  },
  {
    id: "calm",
    name: "Calm",
    keywords: ["peaceful", "serene", "tranquil", "gentle", "soothing", "relaxing", "mellow", "placid", "quiet"],
    description: "Peaceful and free from tension",
    examples: ["Calm atmospheric pads", "Peaceful meditation soundtrack"]
  },
  {
    id: "energetic",
    name: "Energetic",
    keywords: ["lively", "vigorous", "dynamic", "spirited", "vibrant", "exciting", "powerful", "driving", "animated"],
    description: "Full of energy and enthusiasm",
    examples: ["Energetic dance track", "Lively upbeat tempo"]
  },
  {
    id: "romantic",
    name: "Romantic",
    keywords: ["passionate", "loving", "tender", "affectionate", "sensual", "intimate", "warm", "heartfelt", "amorous"],
    description: "Expressing or evoking love",
    examples: ["Romantic string arrangement", "Passionate love ballad"]
  },
  {
    id: "mysterious",
    name: "Mysterious",
    keywords: ["enigmatic", "cryptic", "eerie", "intriguing", "secretive", "dark", "shadowy", "puzzling", "suspenseful"],
    description: "Difficult to understand, puzzling",
    examples: ["Mysterious ambient textures", "Enigmatic soundscape"]
  },
  {
    id: "nostalgic",
    name: "Nostalgic",
    keywords: ["reminiscent", "retro", "sentimental", "wistful", "longing", "yearning", "reflective", "vintage", "memory"],
    description: "Evoking fond memories of the past",
    examples: ["Nostalgic 80s synthwave", "Sentimental memories"]
  },
  {
    id: "epic",
    name: "Epic",
    keywords: ["grandiose", "majestic", "monumental", "grand", "magnificent", "heroic", "triumphant", "dramatic", "imposing"],
    description: "Impressively large and grand",
    examples: ["Epic orchestral buildup", "Triumphant heroic theme"]
  },
  {
    id: "playful",
    name: "Playful",
    keywords: ["fun", "whimsical", "lighthearted", "carefree", "quirky", "mischievous", "jaunty", "silly", "humorous"],
    description: "Full of fun and high spirits",
    examples: ["Playful bouncy rhythm", "Whimsical childlike melody"]
  },
  {
    id: "dreamy",
    name: "Dreamy",
    keywords: ["ethereal", "surreal", "hazy", "floating", "otherworldly", "hypnotic", "trancelike", "enchanting", "magical"],
    description: "Having a magical or dreamlike quality",
    examples: ["Dreamy ambient pads", "Ethereal floating soundscape"]
  },
  {
    id: "tense",
    name: "Tense",
    keywords: ["anxious", "nervous", "suspenseful", "edgy", "uneasy", "apprehensive", "jittery", "stressed", "agitated"],
    description: "Causing or feeling emotional strain",
    examples: ["Tense thriller soundtrack", "Anxious building suspense"]
  },
  {
    id: "dark",
    name: "Dark",
    keywords: ["gloomy", "ominous", "sinister", "brooding", "menacing", "bleak", "somber", "grim", "foreboding"],
    description: "Lacking light or having a threatening quality",
    examples: ["Dark atmospheric bass", "Ominous drone textures"]
  },
  {
    id: "triumphant",
    name: "Triumphant",
    keywords: ["victorious", "celebratory", "glorious", "exultant", "jubilant", "conquering", "successful", "winning", "proud"],
    description: "Expressing or celebrating victory or success",
    examples: ["Triumphant brass fanfare", "Victorious celebratory theme"]
  },
  {
    id: "ethereal",
    name: "Ethereal",
    keywords: ["celestial", "heavenly", "delicate", "gossamer", "airy", "light", "refined", "angelic", "transcendent"],
    description: "Extremely delicate and light, seemingly not of this world",
    examples: ["Ethereal ambient soundscape", "Celestial choir arrangements"]
  }
];

export default moods;

/**
 * Helper functions for mood processing
 */

export const getMoodByName = (name) => {
  const normalizedName = name.trim().toLowerCase();
  return moods.find(mood => 
    mood.name.toLowerCase() === normalizedName || 
    mood.keywords.some(keyword => keyword.toLowerCase() === normalizedName)
  );
};

export const getMoodByKeyword = (keyword) => {
  const normalizedKeyword = keyword.trim().toLowerCase();
  return moods.find(mood => 
    mood.keywords.some(k => normalizedKeyword.includes(k.toLowerCase())) ||
    normalizedKeyword.includes(mood.name.toLowerCase())
  );
};

export const getMoodNames = () => {
  return moods.map(mood => mood.name);
};

export const getAllMoodKeywords = () => {
  return moods.flatMap(mood => mood.keywords);
};