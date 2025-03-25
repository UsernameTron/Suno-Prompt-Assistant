/**
 * Music decades and eras data for Suno AI prompt optimization
 * Each decade includes characteristic styles, artists and keywords
 */

const decades = [
  {
    id: "1950s",
    name: "1950s",
    styles: ["early rock and roll", "doo-wop", "rockabilly", "cool jazz", "traditional pop"],
    artists: ["Elvis Presley", "Chuck Berry", "Buddy Holly", "Frank Sinatra", "Little Richard"],
    keywords: ["rock and roll", "jukebox", "diner", "sock hop", "bebop", "crooner", "rockabilly"],
    description: "The birth of rock and roll, doo-wop vocal groups, and cool jazz",
    examples: ["1950s Rock and Roll", "1950s Doo-Wop with vocal harmonies"]
  },
  {
    id: "1960s",
    name: "1960s",
    styles: ["psychedelic rock", "motown", "british invasion", "folk rock", "surf rock"],
    artists: ["The Beatles", "The Rolling Stones", "Bob Dylan", "Jimi Hendrix", "The Beach Boys"],
    keywords: ["psychedelic", "counterculture", "motown", "beatlemania", "folk revival", "surf"],
    description: "The British Invasion, psychedelic rock, and Motown soul",
    examples: ["1960s Psychedelic Rock", "1960s Motown Soul with horns"]
  },
  {
    id: "1970s",
    name: "1970s",
    styles: ["disco", "punk", "progressive rock", "funk", "soft rock", "glam rock"],
    artists: ["Led Zeppelin", "Pink Floyd", "David Bowie", "Donna Summer", "The Ramones"],
    keywords: ["disco", "punk", "prog rock", "album-oriented", "glam", "funk", "arena rock"],
    description: "Era of disco, punk rock rebellion, and progressive rock experimentation",
    examples: ["1970s Disco Beat", "1970s Progressive Rock with synthesizers"]
  },
  {
    id: "1980s",
    name: "1980s",
    styles: ["new wave", "synthpop", "hair metal", "hip hop", "post-punk", "pop"],
    artists: ["Michael Jackson", "Madonna", "Prince", "Duran Duran", "Run DMC"],
    keywords: ["new wave", "synthpop", "mtv", "hair metal", "early hip hop", "drum machine"],
    description: "The MTV era with new wave, synthpop, and early hip hop",
    examples: ["1980s Synthwave", "1980s New Wave with analog synths"]
  },
  {
    id: "1990s",
    name: "1990s",
    styles: ["grunge", "alternative rock", "gangsta rap", "eurodance", "pop", "r&b"],
    artists: ["Nirvana", "Dr. Dre", "Backstreet Boys", "Mariah Carey", "Pearl Jam"],
    keywords: ["grunge", "alt-rock", "gangsta rap", "boy band", "eurodance", "trip hop"],
    description: "Era of grunge, gangsta rap, and teen pop",
    examples: ["1990s Grunge Rock", "1990s Eurodance with electronic beats"]
  },
  {
    id: "2000s",
    name: "2000s",
    styles: ["emo", "pop punk", "crunk", "indie rock", "r&b", "post-grunge"],
    artists: ["Eminem", "Britney Spears", "Linkin Park", "Beyoncé", "Coldplay"],
    keywords: ["emo", "pop punk", "ringtone rap", "auto-tune", "indie", "post-grunge"],
    description: "Time of emo, pop punk, and early digital music production",
    examples: ["2000s Pop Punk", "2000s R&B with auto-tune"]
  },
  {
    id: "2010s",
    name: "2010s",
    styles: ["edm", "trap", "indie pop", "k-pop", "mumble rap", "tropical house"],
    artists: ["Drake", "Taylor Swift", "BTS", "Ed Sheeran", "Ariana Grande"],
    keywords: ["edm", "trap", "streaming", "social media", "mumble rap", "drops"],
    description: "The streaming era with EDM, trap beats, and global pop",
    examples: ["2010s Trap Beat", "2010s EDM Drop with vocal chops"]
  },
  {
    id: "2020s",
    name: "2020s",
    styles: ["hyperpop", "drill", "bedroom pop", "afrobeats", "synthwave revival"],
    artists: ["The Weeknd", "Billie Eilish", "Bad Bunny", "Olivia Rodrigo", "Doja Cat"],
    keywords: ["hyperpop", "drill", "tiktok", "bedroom pop", "pandemic", "lofi"],
    description: "Current era of genre fusion, TikTok trends, and bedroom production",
    examples: ["2020s Hyperpop", "2020s Lo-fi Bedroom Pop"]
  },
  {
    id: "classical",
    name: "Classical Era",
    styles: ["symphony", "opera", "chamber music", "sonata"],
    artists: ["Mozart", "Haydn", "Beethoven", "Schubert"],
    keywords: ["symphony", "chamber", "orchestra", "piano sonata", "concerto", "opera"],
    description: "1750-1820, characterized by elegance, balance and clarity",
    examples: ["Classical Era Symphony", "Classical Era Piano Sonata"]
  },
  {
    id: "baroque",
    name: "Baroque Era",
    styles: ["concerto grosso", "fugue", "oratorio", "suite"],
    artists: ["Bach", "Vivaldi", "Handel", "Telemann"],
    keywords: ["baroque", "harpsichord", "fugue", "ornate", "counterpoint", "basso continuo"],
    description: "1600-1750, known for ornate, dramatic and grandiose compositions",
    examples: ["Baroque Fugue Style", "Baroque Concerto"]
  },
  {
    id: "medieval",
    name: "Medieval Era",
    styles: ["gregorian chant", "troubadour songs", "early polyphony"],
    artists: ["Hildegard von Bingen", "Guillaume de Machaut", "Leonin", "Perotin"],
    keywords: ["medieval", "gregorian", "monophonic", "plainchant", "early music"],
    description: "500-1400, characterized by plainchant and early polyphony",
    examples: ["Medieval Chant", "Medieval Troubadour Style"]
  }
];

export default decades;

/**
 * Helper functions for decade processing
 */

export const getDecadeByName = (name) => {
  const normalizedName = name.trim().toLowerCase();
  return decades.find(decade => 
    decade.name.toLowerCase() === normalizedName ||
    decade.styles.some(style => style.toLowerCase() === normalizedName)
  );
};

export const getDecadeByKeyword = (keyword) => {
  const normalizedKeyword = keyword.trim().toLowerCase();
  return decades.find(decade => 
    decade.keywords.some(k => normalizedKeyword.includes(k.toLowerCase())) ||
    decade.styles.some(s => normalizedKeyword.includes(s.toLowerCase())) ||
    normalizedKeyword.includes(decade.name.toLowerCase())
  );
};

export const getDecadeNames = () => {
  return decades.map(decade => decade.name);
};

export const getAllDecadeKeywords = () => {
  return decades.flatMap(decade => decade.keywords);
};