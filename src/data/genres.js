/**
 * Music genres data for Suno AI prompt optimization
 * Organized by main genre categories with sub-genres and related keywords
 */

const genres = [
  {
    id: "pop",
    name: "POP",
    subGenres: ["synthpop", "dance-pop", "electropop", "indie pop", "teen pop", "k-pop", "j-pop"],
    keywords: ["catchy", "melodic", "commercial", "hook", "verse", "chorus", "radio-friendly"],
    description: "Popular music with catchy melodies and hooks",
    examples: ["POP, Upbeat Dance Track", "POP, Melodic Ballad with powerful vocals"]
  },
  {
    id: "rock",
    name: "ROCK",
    subGenres: ["alt-rock", "hard rock", "indie rock", "punk rock", "classic rock", "progressive rock", "post-rock"],
    keywords: ["guitar", "drums", "band", "riff", "solo", "electric", "distortion"],
    description: "Guitar-driven music with a strong rhythmic element",
    examples: ["ROCK, Distorted Guitar Riffs", "ROCK, Powerful Anthem with guitar solos"]
  },
  {
    id: "hiphop",
    name: "HIP HOP",
    subGenres: ["trap", "boom bap", "conscious rap", "drill", "cloud rap", "mumble rap", "gangsta rap"],
    keywords: ["rap", "bars", "flow", "beat", "rhymes", "mc", "spitting"],
    description: "Rhythmic vocal delivery over beats",
    examples: ["HIP HOP, Heavy 808 Bass", "HIP HOP, Old School Boom Bap Beat"]
  },
  {
    id: "rnb",
    name: "R&B",
    subGenres: ["soul", "contemporary r&b", "neo-soul", "quiet storm", "new jack swing", "funk"],
    keywords: ["smooth", "soulful", "groove", "rhythm", "blues", "vocal", "urban"],
    description: "Rhythm and blues with emotional vocals and steady grooves",
    examples: ["R&B, Soulful Grooves", "R&B, Smooth Vocal Harmonies"]
  },
  {
    id: "electronic",
    name: "ELECTRONIC",
    subGenres: ["house", "techno", "trance", "dubstep", "drum and bass", "ambient", "edm", "idm"],
    keywords: ["beat", "drop", "synth", "dj", "electronic", "dance", "club", "bpm"],
    description: "Computer-generated music with electronic instruments",
    examples: ["ELECTRONIC, Deep House Groove", "ELECTRONIC, Bass-heavy Dubstep"]
  },
  {
    id: "jazz",
    name: "JAZZ",
    subGenres: ["bebop", "swing", "fusion", "smooth jazz", "modal jazz", "free jazz", "big band"],
    keywords: ["improvisation", "swing", "blue note", "saxophone", "trumpet", "piano", "bass"],
    description: "Complex harmony and rhythm with improvisation",
    examples: ["JAZZ, Smooth Saxophone Solo", "JAZZ, Upbeat Big Band Arrangement"]
  },
  {
    id: "classical",
    name: "CLASSICAL",
    subGenres: ["baroque", "romantic", "contemporary classical", "opera", "chamber music", "symphony", "concerto"],
    keywords: ["orchestra", "symphony", "concerto", "sonata", "composer", "strings", "piano"],
    description: "Traditional Western music from the classical tradition",
    examples: ["CLASSICAL, Orchestral Arrangement", "CLASSICAL, Piano Sonata Style"]
  },
  {
    id: "country",
    name: "COUNTRY",
    subGenres: ["contemporary country", "bluegrass", "country rock", "outlaw country", "country pop", "americana"],
    keywords: ["twang", "guitar", "fiddle", "banjo", "rural", "heartland", "folk", "western"],
    description: "American folk music with rural roots and storytelling",
    examples: ["COUNTRY, Nashville Sound with slide guitar", "COUNTRY, Modern Pop Country"]
  },
  {
    id: "folk",
    name: "FOLK",
    subGenres: ["singer-songwriter", "indie folk", "traditional folk", "folk rock", "freak folk", "contemporary folk"],
    keywords: ["acoustic", "storytelling", "guitar", "banjo", "fiddle", "traditional", "ballad"],
    description: "Acoustic music with emphasis on storytelling",
    examples: ["FOLK, Acoustic Guitar Ballad", "FOLK, Traditional Storytelling with fingerpicking"]
  },
  {
    id: "metal",
    name: "METAL",
    subGenres: ["heavy metal", "death metal", "black metal", "thrash metal", "power metal", "doom metal", "metalcore"],
    keywords: ["heavy", "distortion", "headbanging", "guitar solo", "double bass", "growl", "scream"],
    description: "Heavy, guitar-driven music with aggressive elements",
    examples: ["METAL, Double Bass Drum with distorted guitars", "METAL, Fast Guitar Riffs"]
  },
  {
    id: "blues",
    name: "BLUES",
    subGenres: ["delta blues", "chicago blues", "electric blues", "jump blues", "blues rock", "soul blues"],
    keywords: ["12-bar", "guitar", "harmonica", "soul", "melancholy", "expression", "feeling"],
    description: "Expressive music with blue notes and specific chord progressions",
    examples: ["BLUES, Soulful Guitar Solo", "BLUES, Chicago Style with harmonica"]
  },
  {
    id: "reggae",
    name: "REGGAE",
    subGenres: ["dub", "roots reggae", "dancehall", "ska", "rocksteady", "reggaeton"],
    keywords: ["jamaica", "caribbean", "offbeat", "skank", "one drop", "bass", "island"],
    description: "Rhythmic Jamaican style with emphasized offbeats",
    examples: ["REGGAE, Island Groove with offbeat guitar", "REGGAE, Roots Style with prominent bass"]
  },
  {
    id: "funk",
    name: "FUNK",
    subGenres: ["p-funk", "deep funk", "funk rock", "jazz-funk", "electro-funk", "disco funk"],
    keywords: ["groove", "rhythm", "bass", "syncopation", "dance", "soul", "horn section"],
    description: "Rhythm-driven style with emphasis on groove and bass",
    examples: ["FUNK, Groovy Bassline", "FUNK, Horn Section with syncopated rhythm"]
  },
  {
    id: "ambient",
    name: "AMBIENT",
    subGenres: ["dark ambient", "drone", "space ambient", "atmospheric", "new age", "ambient techno"],
    keywords: ["atmospheric", "texture", "soundscape", "calm", "spacious", "background", "meditative"],
    description: "Atmospheric music focused on tone and texture",
    examples: ["AMBIENT, Atmospheric Soundscape", "AMBIENT, Drone Textures with subtle movement"]
  },
  {
    id: "world",
    name: "WORLD",
    subGenres: ["afrobeat", "latin", "indian classical", "celtic", "middle eastern", "asian traditional", "african"],
    keywords: ["ethnic", "traditional", "global", "cultural", "indigenous", "fusion", "regional"],
    description: "Music from diverse global cultures and traditions",
    examples: ["WORLD, African Percussion", "WORLD, Indian Raga with traditional instruments"]
  }
];

export default genres;

/**
 * Helper functions for genre processing
 */
 
export const getGenreByName = (name) => {
  const normalizedName = name.trim().toLowerCase();
  return genres.find(genre => 
    genre.name.toLowerCase() === normalizedName ||
    genre.subGenres.some(subGenre => subGenre.toLowerCase() === normalizedName) ||
    genre.keywords.some(keyword => keyword.toLowerCase() === normalizedName)
  );
};

export const getGenreByKeyword = (keyword) => {
  const normalizedKeyword = keyword.trim().toLowerCase();
  return genres.find(genre => 
    genre.keywords.some(k => normalizedKeyword.includes(k.toLowerCase())) ||
    genre.subGenres.some(s => normalizedKeyword.includes(s.toLowerCase())) ||
    normalizedKeyword.includes(genre.name.toLowerCase())
  );
};

export const getGenreNames = () => {
  return genres.map(genre => genre.name);
};

export const getAllSubGenres = () => {
  return genres.flatMap(genre => genre.subGenres);
};

export const getAllGenreKeywords = () => {
  return genres.flatMap(genre => genre.keywords);
};