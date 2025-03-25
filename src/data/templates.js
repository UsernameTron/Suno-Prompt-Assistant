/**
 * Template gallery for Suno AI prompt optimization
 * Predefined templates for different music styles and compositions
 */

const templates = [
  {
    id: "pop_upbeat",
    name: "Upbeat Pop",
    description: "Energetic and catchy pop song with modern sound",
    components: {
      genre: "POP",
      mood: "Energetic",
      tempo: "medium-fast",
      instruments: "synth bass, electronic drums, piano",
      decade: "2020s",
      vocals: "Female vocals",
      descriptors: "Catchy, Commercial",
      description: "with driving rhythm and memorable chorus"
    },
    example: "POP, Energetic, medium-fast, synth bass, electronic drums, piano, 2020s, Female vocals, Catchy, Commercial, with driving rhythm and memorable chorus"
  },
  {
    id: "ambient_chill",
    name: "Ambient Chill",
    description: "Relaxing atmospheric music for focus or meditation",
    components: {
      genre: "AMBIENT",
      mood: "Calm",
      tempo: "slow",
      instruments: "synthesizer, piano, pad sounds",
      vocals: "Instrumental (no vocals)",
      descriptors: "Ethereal, Atmospheric",
      description: "with gentle evolving textures and subtle melodies"
    },
    example: "AMBIENT, Calm, slow, synthesizer, piano, pad sounds, Instrumental (no vocals), Ethereal, Atmospheric, with gentle evolving textures and subtle melodies"
  },
  {
    id: "rock_anthemic",
    name: "Anthemic Rock",
    description: "Powerful arena rock with big sound",
    components: {
      genre: "ROCK",
      mood: "Epic",
      tempo: "medium",
      instruments: "electric guitar, drums, bass, power chords",
      decade: "1980s",
      vocals: "Male vocals",
      structure: "Verse-Chorus",
      descriptors: "Powerful, Anthemic",
      description: "with soaring chorus and guitar solo"
    },
    example: "ROCK, Epic, medium, electric guitar, drums, bass, power chords, 1980s, Male vocals, Verse-Chorus, Powerful, Anthemic, with soaring chorus and guitar solo"
  },
  {
    id: "jazz_smooth",
    name: "Smooth Jazz",
    description: "Relaxing jazz with sophisticated harmonies",
    components: {
      genre: "JAZZ",
      mood: "Relaxed",
      tempo: "medium-slow",
      instruments: "saxophone, piano, upright bass, brushed drums",
      decade: "1990s",
      vocals: "Instrumental (no vocals)",
      descriptors: "Smooth, Sophisticated",
      description: "with gentle saxophone melody and warm piano chords"
    },
    example: "JAZZ, Relaxed, medium-slow, saxophone, piano, upright bass, brushed drums, 1990s, Instrumental (no vocals), Smooth, Sophisticated, with gentle saxophone melody and warm piano chords"
  },
  {
    id: "hiphop_trap",
    name: "Modern Trap",
    description: "Contemporary trap beat with heavy bass",
    components: {
      genre: "HIP HOP",
      mood: "Dark",
      tempo: "slow",
      instruments: "808, hi-hats, synth bass, sampler",
      decade: "2020s",
      vocals: "Male vocals",
      region: "American",
      descriptors: "Moody, Heavy",
      description: "with rolling hi-hats and deep 808 bass"
    },
    example: "HIP HOP, Dark, slow, 808, hi-hats, synth bass, sampler, 2020s, Male vocals, American, Moody, Heavy, with rolling hi-hats and deep 808 bass"
  },
  {
    id: "electronic_dance",
    name: "EDM Dance",
    description: "Club-ready electronic dance track with big drop",
    components: {
      genre: "ELECTRONIC",
      mood: "Energetic",
      tempo: "128 BPM",
      instruments: "synthesizer, drum machine, sampler, bass",
      decade: "2010s",
      vocals: "Female vocals",
      structure: "Build-Drop",
      descriptors: "Euphoric, Driving",
      description: "with progressive build and powerful drop"
    },
    example: "ELECTRONIC, Energetic, 128 BPM, synthesizer, drum machine, sampler, bass, 2010s, Female vocals, Build-Drop, Euphoric, Driving, with progressive build and powerful drop"
  },
  {
    id: "classical_emotional",
    name: "Emotional Piano",
    description: "Emotional piano composition with string accompaniment",
    components: {
      genre: "CLASSICAL",
      mood: "Melancholic",
      tempo: "slow",
      instruments: "piano, strings, violin",
      structure: "Through-composed",
      descriptors: "Emotional, Intimate",
      description: "with expressive piano melody and subtle string accompaniment"
    },
    example: "CLASSICAL, Melancholic, slow, piano, strings, violin, Through-composed, Emotional, Intimate, with expressive piano melody and subtle string accompaniment"
  },
  {
    id: "folk_acoustic",
    name: "Acoustic Folk",
    description: "Intimate folk song with acoustic instruments",
    components: {
      genre: "FOLK",
      mood: "Nostalgic",
      tempo: "medium",
      instruments: "acoustic guitar, banjo, violin, upright bass",
      decade: "1970s",
      vocals: "Male vocals",
      region: "American",
      descriptors: "Intimate, Rustic",
      description: "with finger-picked guitar and storytelling lyrics"
    },
    example: "FOLK, Nostalgic, medium, acoustic guitar, banjo, violin, upright bass, 1970s, Male vocals, American, Intimate, Rustic, with finger-picked guitar and storytelling lyrics"
  },
  {
    id: "synthwave_80s",
    name: "80s Synthwave",
    description: "Retro-futuristic 80s inspired electronic music",
    components: {
      genre: "ELECTRONIC",
      mood: "Nostalgic",
      tempo: "medium",
      instruments: "analog synth, drum machine, bass synth",
      decade: "1980s",
      structure: "Verse-Chorus",
      descriptors: "Retro, Cinematic",
      description: "with pulsing synth arpeggios and gated reverb drums"
    },
    example: "ELECTRONIC, Nostalgic, medium, analog synth, drum machine, bass synth, 1980s, Verse-Chorus, Retro, Cinematic, with pulsing synth arpeggios and gated reverb drums"
  },
  {
    id: "lofi_chill",
    name: "Lo-Fi Chill",
    description: "Relaxing lo-fi beats for studying or chilling",
    components: {
      genre: "HIP HOP",
      mood: "Calm",
      tempo: "slow",
      instruments: "vinyl crackle, piano samples, mellow drums, bass",
      decade: "2010s",
      vocals: "Instrumental (no vocals)",
      descriptors: "Mellow, Relaxing",
      description: "with jazzy chord progressions and vinyl texture"
    },
    example: "HIP HOP, Calm, slow, vinyl crackle, piano samples, mellow drums, bass, 2010s, Instrumental (no vocals), Mellow, Relaxing, with jazzy chord progressions and vinyl texture"
  },
  {
    id: "country_modern",
    name: "Modern Country",
    description: "Contemporary country with pop influences",
    components: {
      genre: "COUNTRY",
      mood: "Uplifting",
      tempo: "medium",
      instruments: "acoustic guitar, electric guitar, drums, banjo",
      decade: "2020s",
      vocals: "Male vocals",
      region: "American",
      structure: "Verse-Chorus-Bridge",
      descriptors: "Contemporary, Catchy",
      description: "with storytelling lyrics and acoustic-electric blend"
    },
    example: "COUNTRY, Uplifting, medium, acoustic guitar, electric guitar, drums, banjo, 2020s, Male vocals, American, Verse-Chorus-Bridge, Contemporary, Catchy, with storytelling lyrics and acoustic-electric blend"
  },
  {
    id: "cinematic_epic",
    name: "Epic Cinematic",
    description: "Hollywood-style orchestral music for trailers",
    components: {
      genre: "CLASSICAL",
      mood: "Epic",
      tempo: "slow to fast",
      instruments: "orchestra, percussion, brass section, strings",
      structure: "Progressive",
      descriptors: "Cinematic, Powerful",
      description: "with dramatic build and powerful climax"
    },
    example: "CLASSICAL, Epic, slow to fast, orchestra, percussion, brass section, strings, Progressive, Cinematic, Powerful, with dramatic build and powerful climax"
  }
];

export default templates;

/**
 * Get all templates
 * @returns {Array} - Array of all templates
 */
export const getAllTemplates = () => {
  return templates;
};

/**
 * Get template by ID
 * @param {string} id - Template ID
 * @returns {Object|null} - Template object or null if not found
 */
export const getTemplateById = (id) => {
  return templates.find(template => template.id === id) || null;
};

/**
 * Get templates by genre
 * @param {string} genre - Genre to filter by
 * @returns {Array} - Array of templates matching the genre
 */
export const getTemplatesByGenre = (genre) => {
  if (!genre) return [];
  const normalizedGenre = genre.toUpperCase();
  return templates.filter(template => 
    template.components.genre && 
    template.components.genre.toUpperCase() === normalizedGenre
  );
};

/**
 * Get templates by mood
 * @param {string} mood - Mood to filter by
 * @returns {Array} - Array of templates matching the mood
 */
export const getTemplatesByMood = (mood) => {
  if (!mood) return [];
  const normalizedMood = mood.toLowerCase();
  return templates.filter(template => 
    template.components.mood && 
    template.components.mood.toLowerCase() === normalizedMood
  );
};

/**
 * Get recommended templates based on components
 * @param {Object} components - Current prompt components
 * @returns {Array} - Array of recommended templates (up to 3)
 */
export const getRecommendedTemplates = (components) => {
  if (!components) return [];
  
  let matches = [];
  
  // If there's a genre, match on that first
  if (components.genre) {
    const genreMatches = getTemplatesByGenre(components.genre);
    matches = [...genreMatches];
  }
  
  // If there's a mood and we need more matches, add those too
  if (components.mood && matches.length < 3) {
    const moodMatches = getTemplatesByMood(components.mood);
    
    // Filter out any we already have
    const newMoodMatches = moodMatches.filter(
      moodTemplate => !matches.some(m => m.id === moodTemplate.id)
    );
    
    matches = [...matches, ...newMoodMatches];
  }
  
  // If we still need more, add some other popular templates
  if (matches.length < 3) {
    const popularIds = ['pop_upbeat', 'electronic_dance', 'lofi_chill', 'cinematic_epic'];
    const additionalMatches = popularIds
      .map(id => getTemplateById(id))
      .filter(template => template && !matches.some(m => m.id === template.id));
    
    matches = [...matches, ...additionalMatches];
  }
  
  // Return up to 3 matches
  return matches.slice(0, 3);
};