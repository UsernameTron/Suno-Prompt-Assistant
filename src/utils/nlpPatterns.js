/**
 * NLP Pattern Recognition for Suno AI prompt optimization
 * This file contains regex patterns and keyword dictionaries for identifying
 * musical components in natural language text input.
 */

// Genre detection patterns
export const genrePatterns = {
  // Direct genre mentions (e.g., "I want rock music")
  directMention: /\b(rock|pop|jazz|hip\s*hop|rap|classical|electronic|country|folk|metal|punk|blues|reggae|soul|funk|ambient|world)\b/i,
  
  // Genre modifiers (e.g., "something rocky", "poppy sound")
  genreModifier: /\b(rock(y|ish)|popp(y|ish)|jazz(y|ish)|electronic|country|folk(sy|ish)|metal(lic)|punk(ish)|blues(y)|reggae|soul(ful)|funk(y)|ambient)\b/i,
  
  // Sub-genre patterns
  subGenres: {
    rock: /\b(alt(ernative)?[-\s]?rock|hard[-\s]?rock|indie[-\s]?rock|classic[-\s]?rock|prog(ressive)?[-\s]?rock|soft[-\s]?rock|psychedelic[-\s]?rock|garage[-\s]?rock|punk[-\s]?rock|post[-\s]?rock)\b/i,
    pop: /\b(synth[-\s]?pop|electro[-\s]?pop|indie[-\s]?pop|dance[-\s]?pop|dream[-\s]?pop|k[-\s]?pop|j[-\s]?pop|chamber[-\s]?pop|art[-\s]?pop)\b/i,
    electronic: /\b(house|techno|trance|edm|dubstep|drum[-\s]?and[-\s]?bass|d&b|dnb|ambient|idm|electro|synthwave|retrowave|electronica)\b/i,
    hiphop: /\b(trap|boom[-\s]?bap|conscious[-\s]?rap|gangsta[-\s]?rap|drill|mumble[-\s]?rap|old[-\s]?school|east[-\s]?coast|west[-\s]?coast)\b/i,
    jazz: /\b(bebop|swing|fusion|smooth[-\s]?jazz|modal[-\s]?jazz|free[-\s]?jazz|cool[-\s]?jazz|hard[-\s]?bop|avant[-\s]?garde[-\s]?jazz)\b/i,
    metal: /\b(heavy[-\s]?metal|death[-\s]?metal|black[-\s]?metal|thrash[-\s]?metal|doom[-\s]?metal|power[-\s]?metal|symphonic[-\s]?metal|folk[-\s]?metal)\b/i
  }
};

// Mood detection patterns
export const moodPatterns = {
  // Direct mood mentions (e.g., "happy music", "sad song")
  directMention: /\b(happy|sad|energetic|calm|aggressive|peaceful|romantic|nostalgic|dreamy|dark|epic|playful|mysterious|uplifting|melancholic)\b/i,
  
  // Mood-related words and phrases
  relatedPhrases: {
    happy: /\b(joyful|cheerful|upbeat|bright|sunny|fun|light[-\s]?hearted|positive|optimistic|gleeful|merry)\b/i,
    sad: /\b(melancholic|depressing|gloomy|somber|down(beat)?|sorrowful|mournful|heartbreak|tearful|bittersweet)\b/i,
    energetic: /\b(lively|dynamic|vigorous|powerful|active|animated|driving|pulsing|intense|spirited|exciting|vibrant)\b/i,
    calm: /\b(peaceful|serene|tranquil|gentle|relaxing|soothing|mellow|easy[-\s]?going|chilled|quiet|soft)\b/i,
    aggressive: /\b(angry|intense|fierce|heavy|harsh|strong|powerful|violent|forceful|hard|brutal)\b/i,
    romantic: /\b(love|loving|passionate|intimate|emotional|tender|heartfelt|affectionate|sensual|ardent)\b/i,
    nostalgic: /\b(reminiscent|retro|throwback|memory|memories|sentimental|yearning|wistful|reflective|remembrance)\b/i,
    mysterious: /\b(intriguing|enigmatic|cryptic|suspenseful|spooky|eerie|strange|weird|unusual|curious|peculiar)\b/i
  }
};

// Decade/era detection patterns
export const decadePatterns = {
  // Specific decades (e.g., "80s", "1970s")
  specific: /\b((\d{1,2})s|(\d{4})s)\b/i,
  
  // Era references
  eras: {
    fifties: /\b(fifties|50s|1950s)\b/i,
    sixties: /\b(sixties|60s|1960s)\b/i,
    seventies: /\b(seventies|70s|1970s)\b/i,
    eighties: /\b(eighties|80s|1980s)\b/i,
    nineties: /\b(nineties|90s|1990s)\b/i,
    twoThousands: /\b(two[-\s]?thousands|00s|2000s|aughts|noughties)\b/i,
    twentyTens: /\b(twenty[-\s]?tens|2010s|10s)\b/i,
    twentyTwenties: /\b(twenty[-\s]?twenties|2020s|20s)\b/i,
    classical: /\b(classical[-\s]?era|classical[-\s]?period)\b/i,
    baroque: /\b(baroque[-\s]?era|baroque[-\s]?period)\b/i,
    medieval: /\b(medieval[-\s]?era|medieval[-\s]?period|middle[-\s]?ages)\b/i
  },
  
  // Cultural references that imply decades
  culturalReferences: {
    fifties: /\b(rock[-\s]?and[-\s]?roll|rockabilly|doo[-\s]?wop|bebop|early[-\s]?rock)\b/i,
    sixties: /\b(british[-\s]?invasion|psychedelic|woodstock|motown|counterculture|flower[-\s]?power)\b/i,
    seventies: /\b(disco|progressive[-\s]?rock|funk|glam[-\s]?rock|punk)\b/i,
    eighties: /\b(new[-\s]?wave|synthpop|hair[-\s]?metal|new[-\s]?romantic|early[-\s]?hip[-\s]?hop|mtv)\b/i,
    nineties: /\b(grunge|alt(ernative)?[-\s]?rock|britpop|eurodance|boy[-\s]?band|girl[-\s]?group|gangsta[-\s]?rap)\b/i,
    twoThousands: /\b(emo|pop[-\s]?punk|ringtone|autotune|electroclash|blog[-\s]?house|crunk)\b/i,
    twentyTens: /\b(edm|dubstep|trap|mumble[-\s]?rap|cloud[-\s]?rap|tropical[-\s]?house|k[-\s]?pop)\b/i,
    twentyTwenties: /\b(hyper[-\s]?pop|bedroom[-\s]?pop|drill|tiktok[-\s]?music|plugg)\b/i
  }
};

// Tempo detection patterns
export const tempoPatterns = {
  // BPM mentions (e.g., "120 BPM", "80bpm")
  bpm: /\b(\d{2,3})\s*(bpm|beats[-\s]?per[-\s]?minute)\b/i,
  
  // Tempo descriptions
  descriptions: {
    slow: /\b(slow|slowest|sluggish|laid[-\s]?back|adagio|lento|largo|grave)\b/i,
    medium: /\b(medium|moderate|andante|moderato|mid[-\s]?tempo)\b/i,
    fast: /\b(fast|quick|rapid|allegro|swift|up[-\s]?tempo|allegretto)\b/i,
    veryFast: /\b(very[-\s]?fast|fastest|presto|prestissimo|vivace|vivacissimo)\b/i
  },
  
  // Tempo modifiers
  modifiers: /\b(gradually|suddenly|moderately|extremely|somewhat|slightly|incredibly)\s+(slow|fast|quick|rapid|moderate)\b/i
};

// Instrument detection patterns
export const instrumentPatterns = {
  // String instruments
  strings: /\b(guitar|acoustic[-\s]?guitar|electric[-\s]?guitar|bass|violin|viola|cello|double[-\s]?bass|harp|banjo|mandolin|ukulele)\b/i,
  
  // Keyboard instruments
  keyboards: /\b(piano|grand[-\s]?piano|upright[-\s]?piano|keyboard|synth(esizer)?|electric[-\s]?piano|organ|harpsichord|clavinet|mellotron)\b/i,
  
  // Wind instruments
  winds: /\b(saxophone|sax|alto[-\s]?sax|tenor[-\s]?sax|trumpet|trombone|flute|clarinet|oboe|bassoon|harmonica)\b/i,
  
  // Percussion instruments
  percussion: /\b(drums|drum[-\s]?kit|percussion|congas|bongos|tabla|djembe|timpani|cymbals|hi[-\s]?hat|snare|kick[-\s]?drum|808)\b/i,
  
  // Electronic elements
  electronic: /\b(drum[-\s]?machine|sampler|sequencer|mpc|808|909|vocoder|looper|synthesizer|synth|arpeggiator|theremin)\b/i,
  
  // Vocal instruments
  vocals: /\b(vocals|voice|singing|choir|chorus|backing[-\s]?vocals|harmonies|a[-\s]?cappella|vocoder|auto[-\s]?tune)\b/i,
  
  // Ensembles
  ensembles: /\b(orchestra|band|string[-\s]?quartet|horn[-\s]?section|rhythm[-\s]?section|choir|ensemble|trio|quartet|quintet)\b/i
};

/**
 * Helper function to find the best match for genre based on patterns
 * @param {string} text - Input text to analyze
 * @returns {string|null} - Matched genre or null if no match
 */
export const findGenreMatch = (text) => {
  // Check for direct mentions first
  const directMatch = text.match(genrePatterns.directMention);
  if (directMatch) {
    return normalizeGenre(directMatch[0]);
  }
  
  // Check for modifier mentions
  const modifierMatch = text.match(genrePatterns.genreModifier);
  if (modifierMatch) {
    return normalizeGenre(modifierMatch[0]);
  }
  
  // Check for sub-genre matches
  for (const [genre, pattern] of Object.entries(genrePatterns.subGenres)) {
    if (pattern.test(text)) {
      return normalizeGenre(genre);
    }
  }
  
  return null;
};

/**
 * Helper function to find the best match for mood based on patterns
 * @param {string} text - Input text to analyze
 * @returns {string|null} - Matched mood or null if no match
 */
export const findMoodMatch = (text) => {
  // Check for direct mentions first
  const directMatch = text.match(moodPatterns.directMention);
  if (directMatch) {
    return directMatch[0].toLowerCase();
  }
  
  // Check for related phrases
  for (const [mood, pattern] of Object.entries(moodPatterns.relatedPhrases)) {
    if (pattern.test(text)) {
      return mood;
    }
  }
  
  return null;
};

/**
 * Helper function to find the best match for decade based on patterns
 * @param {string} text - Input text to analyze
 * @returns {string|null} - Matched decade or null if no match
 */
export const findDecadeMatch = (text) => {
  // Check for specific decades first
  const specificMatch = text.match(decadePatterns.specific);
  if (specificMatch) {
    const decade = specificMatch[0];
    // Convert 2-digit decades to 4-digit decades (e.g., 80s -> 1980s)
    if (decade.length <= 3) { // e.g., 80s, 90s
      const twoDigits = decade.match(/\d{1,2}/)[0];
      // Assume 20s-90s refers to 1900s, unless clearly recent context
      if (parseInt(twoDigits) < 30 && text.includes('202')) {
        return `20${twoDigits}s`;
      }
      return `19${twoDigits}s`;
    }
    return decade;
  }
  
  // Check for era names
  for (const [era, pattern] of Object.entries(decadePatterns.eras)) {
    if (pattern.test(text)) {
      switch (era) {
        case 'fifties': return '1950s';
        case 'sixties': return '1960s';
        case 'seventies': return '1970s';
        case 'eighties': return '1980s';
        case 'nineties': return '1990s';
        case 'twoThousands': return '2000s';
        case 'twentyTens': return '2010s';
        case 'twentyTwenties': return '2020s';
        case 'classical': return 'Classical Era';
        case 'baroque': return 'Baroque Era';
        case 'medieval': return 'Medieval Era';
        default: return null;
      }
    }
  }
  
  // Check for cultural references that imply decades
  for (const [era, pattern] of Object.entries(decadePatterns.culturalReferences)) {
    if (pattern.test(text)) {
      switch (era) {
        case 'fifties': return '1950s';
        case 'sixties': return '1960s';
        case 'seventies': return '1970s';
        case 'eighties': return '1980s';
        case 'nineties': return '1990s';
        case 'twoThousands': return '2000s';
        case 'twentyTens': return '2010s';
        case 'twentyTwenties': return '2020s';
        default: return null;
      }
    }
  }
  
  return null;
};

/**
 * Helper function to find the best match for tempo based on patterns
 * @param {string} text - Input text to analyze
 * @returns {string|null} - Matched tempo or null if no match
 */
export const findTempoMatch = (text) => {
  // Check for BPM mentions first
  const bpmMatch = text.match(tempoPatterns.bpm);
  if (bpmMatch) {
    return `${bpmMatch[1]} BPM`;
  }
  
  // Check for tempo descriptions
  for (const [tempo, pattern] of Object.entries(tempoPatterns.descriptions)) {
    if (pattern.test(text)) {
      return tempo;
    }
  }
  
  // Check for modifiers
  const modifierMatch = text.match(tempoPatterns.modifiers);
  if (modifierMatch) {
    return modifierMatch[0];
  }
  
  return null;
};

/**
 * Helper function to find all instrument matches based on patterns
 * @param {string} text - Input text to analyze
 * @returns {string[]} - Array of matched instruments
 */
export const findInstrumentMatches = (text) => {
  const instruments = new Set();
  
  // Check all instrument categories
  const allCategories = [
    instrumentPatterns.strings,
    instrumentPatterns.keyboards,
    instrumentPatterns.winds,
    instrumentPatterns.percussion,
    instrumentPatterns.electronic,
    instrumentPatterns.vocals,
    instrumentPatterns.ensembles
  ];
  
  allCategories.forEach(pattern => {
    const matches = text.match(new RegExp(pattern, 'gi')) || [];
    matches.forEach(match => instruments.add(match.toLowerCase()));
  });
  
  return Array.from(instruments);
};

/**
 * Normalize genre text to standard format
 * @param {string} genre - Raw genre text
 * @returns {string} - Normalized genre 
 */
const normalizeGenre = (genre) => {
  // Convert genre to standard format
  const genreMap = {
    'rock': 'ROCK',
    'pop': 'POP',
    'jazz': 'JAZZ',
    'hip hop': 'HIP HOP',
    'hip-hop': 'HIP HOP',
    'hiphop': 'HIP HOP',
    'rap': 'HIP HOP',
    'classical': 'CLASSICAL',
    'electronic': 'ELECTRONIC',
    'country': 'COUNTRY',
    'folk': 'FOLK',
    'metal': 'METAL',
    'punk': 'PUNK',
    'blues': 'BLUES',
    'reggae': 'REGGAE',
    'soul': 'SOUL',
    'funk': 'FUNK',
    'ambient': 'AMBIENT',
    'world': 'WORLD',
    // Handle modifiers
    'rocky': 'ROCK',
    'rockish': 'ROCK',
    'poppy': 'POP',
    'poppish': 'POP',
    'jazzy': 'JAZZ'
  };
  
  const normalized = genreMap[genre.toLowerCase()];
  return normalized || genre.toUpperCase();
};