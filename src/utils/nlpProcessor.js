/**
 * Natural Language Processing engine for extracting musical components from text
 */

import genres, { getGenreByKeyword, getAllGenreKeywords } from '../data/genres';
import moods, { getMoodByKeyword, getAllMoodKeywords } from '../data/moods';
import decades, { getDecadeByKeyword, getAllDecadeKeywords } from '../data/decades';
import instruments, { getInstrumentByKeyword, getAllInstrumentKeywords, getAllInstrumentVariants } from '../data/instruments';

/**
 * Extracts musical components from natural language text
 * @param {string} text - The input text to analyze
 * @returns {Object} - Extracted components (genre, mood, tempo, instruments, decade, description)
 */
export const extractComponents = (text) => {
  if (!text || typeof text !== 'string') {
    return {
      genre: '',
      mood: '',
      tempo: '',
      instruments: [],
      decade: '',
      description: ''
    };
  }

  // Normalize the text
  const normalizedText = text.toLowerCase().trim();
  
  // Initialize component containers
  let extractedGenre = '';
  let extractedMood = '';
  let extractedTempo = '';
  let extractedInstruments = [];
  let extractedDecade = '';
  
  // Split text into sentences and words for analysis
  const sentences = normalizedText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = normalizedText.split(/\s+/);
  
  // Extract genre
  extractedGenre = extractGenre(normalizedText);
  
  // Extract mood
  extractedMood = extractMood(normalizedText);
  
  // Extract decade/era
  extractedDecade = extractDecade(normalizedText);
  
  // Extract tempo
  extractedTempo = extractTempo(normalizedText);
  
  // Extract instruments
  extractedInstruments = extractInstruments(normalizedText);

  // Construct a filtered description by removing identified components
  const description = constructDescription(normalizedText, {
    genre: extractedGenre,
    mood: extractedMood,
    tempo: extractedTempo,
    instruments: extractedInstruments,
    decade: extractedDecade
  });
  
  return {
    genre: extractedGenre,
    mood: extractedMood,
    tempo: extractedTempo,
    instruments: extractedInstruments,
    decade: extractedDecade,
    description: description
  };
};

/**
 * Extract genre from text
 * @param {string} text - Normalized input text
 * @returns {string} - Extracted genre name or empty string
 */
const extractGenre = (text) => {
  // Check for direct genre mentions
  for (const genre of genres) {
    if (text.includes(genre.name.toLowerCase())) {
      return genre.name;
    }
    
    // Check sub-genres
    for (const subGenre of genre.subGenres) {
      if (text.includes(subGenre.toLowerCase())) {
        return genre.name; // Return main genre name
      }
    }
  }
  
  // Check for keyword matches if no direct mention found
  const genreMatch = getGenreByKeyword(text);
  return genreMatch ? genreMatch.name : '';
};

/**
 * Extract mood from text
 * @param {string} text - Normalized input text
 * @returns {string} - Extracted mood name or empty string
 */
const extractMood = (text) => {
  // Check for direct mood mentions
  for (const mood of moods) {
    if (text.includes(mood.name.toLowerCase())) {
      return mood.name;
    }
    
    // Check mood keywords
    for (const keyword of mood.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        return mood.name;
      }
    }
  }
  
  // Check for keyword matches if no direct mention found
  const moodMatch = getMoodByKeyword(text);
  return moodMatch ? moodMatch.name : '';
};

/**
 * Extract decade/era from text
 * @param {string} text - Normalized input text
 * @returns {string} - Extracted decade name or empty string
 */
const extractDecade = (text) => {
  // Check for decade mentions like "80s" or "1980s"
  const decadeRegex = /(\d{2}s|\d{4}s)/g;
  const decadeMatches = text.match(decadeRegex);
  
  if (decadeMatches && decadeMatches.length > 0) {
    // Convert format (80s → 1980s)
    const decade = decadeMatches[0];
    if (decade.length === 3) {
      return `19${decade}`;
    }
    return decade;
  }
  
  // Check for direct decade mentions
  for (const decade of decades) {
    if (text.includes(decade.name.toLowerCase())) {
      return decade.name;
    }
    
    // Check decade styles
    for (const style of decade.styles) {
      if (text.includes(style.toLowerCase())) {
        return decade.name;
      }
    }
  }
  
  // Check for keyword matches
  const decadeMatch = getDecadeByKeyword(text);
  return decadeMatch ? decadeMatch.name : '';
};

/**
 * Extract tempo information from text
 * @param {string} text - Normalized input text
 * @returns {string} - Extracted tempo description or empty string
 */
const extractTempo = (text) => {
  // Common tempo descriptions
  const tempoKeywords = [
    { keywords: ['slow', 'slowest', 'downtempo', 'sluggish', 'adagio', 'lento', 'laid back', 'laid-back'], value: 'slow' },
    { keywords: ['medium', 'moderate', 'andante', 'moderato', 'walking pace'], value: 'medium' },
    { keywords: ['fast', 'quick', 'rapid', 'allegro', 'upbeat', 'uptempo', 'up-tempo', 'energetic', 'swift'], value: 'fast' },
    { keywords: ['very fast', 'fastest', 'presto', 'prestissimo', 'blazing', 'lightning'], value: 'very fast' }
  ];
  
  // Check for BPM mentions (e.g., "120 BPM", "120bpm")
  const bpmRegex = /(\d{2,3})\s*(?:bpm|beats\s*per\s*minute)/i;
  const bpmMatch = text.match(bpmRegex);
  if (bpmMatch) {
    return `${bpmMatch[1]} BPM`;
  }
  
  // Check for tempo keywords
  for (const tempo of tempoKeywords) {
    for (const keyword of tempo.keywords) {
      if (text.includes(keyword)) {
        return tempo.value;
      }
    }
  }
  
  return '';
};

/**
 * Extract instruments from text
 * @param {string} text - Normalized input text
 * @returns {string[]} - Array of extracted instrument names
 */
const extractInstruments = (text) => {
  const foundInstruments = new Set();
  
  // Check for direct instrument mentions
  for (const instrument of instruments) {
    if (text.includes(instrument.name.toLowerCase())) {
      foundInstruments.add(instrument.name);
    }
    
    // Check instrument variants
    for (const variant of instrument.variants) {
      if (text.includes(variant.toLowerCase())) {
        foundInstruments.add(instrument.name); // Add base instrument name
      }
    }
  }
  
  // If no direct mentions, try keyword matching
  if (foundInstruments.size === 0) {
    // Split text into words for better matching
    const words = text.split(/\s+/);
    
    instruments.forEach(instrument => {
      // Check if any keywords are present
      const hasKeyword = instrument.keywords.some(keyword => 
        words.some(word => word.includes(keyword.toLowerCase()))
      );
      
      if (hasKeyword) {
        foundInstruments.add(instrument.name);
      }
    });
  }
  
  return Array.from(foundInstruments);
};

/**
 * Constructs a filtered description by removing identified components
 * @param {string} text - Original normalized text
 * @param {Object} components - Extracted components to exclude
 * @returns {string} - Filtered and cleaned description
 */
const constructDescription = (text, components) => {
  // Start with the original text
  let filteredText = text;
  
  // Create a list of terms to remove
  const termsToRemove = [];
  
  // Add genre terms
  if (components.genre) {
    termsToRemove.push(components.genre.toLowerCase());
    const genreObj = genres.find(g => g.name.toLowerCase() === components.genre.toLowerCase());
    if (genreObj) {
      termsToRemove.push(...genreObj.subGenres.map(s => s.toLowerCase()));
      termsToRemove.push(...genreObj.keywords.map(k => k.toLowerCase()));
    }
  }
  
  // Add mood terms
  if (components.mood) {
    termsToRemove.push(components.mood.toLowerCase());
    const moodObj = moods.find(m => m.name.toLowerCase() === components.mood.toLowerCase());
    if (moodObj) {
      termsToRemove.push(...moodObj.keywords.map(k => k.toLowerCase()));
    }
  }
  
  // Add decade terms
  if (components.decade) {
    termsToRemove.push(components.decade.toLowerCase());
    const decadeObj = decades.find(d => d.name.toLowerCase() === components.decade.toLowerCase());
    if (decadeObj) {
      termsToRemove.push(...decadeObj.styles.map(s => s.toLowerCase()));
      termsToRemove.push(...decadeObj.keywords.map(k => k.toLowerCase()));
    }
  }
  
  // Add tempo terms
  if (components.tempo) {
    termsToRemove.push(components.tempo.toLowerCase());
    // Add common tempo phrases
    if (components.tempo === 'slow') {
      termsToRemove.push(...['slow', 'downtempo', 'adagio', 'lento']);
    } else if (components.tempo === 'medium') {
      termsToRemove.push(...['medium tempo', 'moderate', 'andante', 'moderato']);
    } else if (components.tempo === 'fast') {
      termsToRemove.push(...['fast', 'uptempo', 'upbeat', 'allegro']);
    } else if (components.tempo === 'very fast') {
      termsToRemove.push(...['very fast', 'prestissimo', 'presto']);
    }
    // BPM pattern
    if (components.tempo.includes('BPM')) {
      const bpmRegex = /(\d{2,3})\s*(?:bpm|beats\s*per\s*minute)/gi;
      filteredText = filteredText.replace(bpmRegex, '');
    }
  }
  
  // Add instrument terms
  if (components.instruments && components.instruments.length > 0) {
    components.instruments.forEach(instrumentName => {
      termsToRemove.push(instrumentName.toLowerCase());
      const instrumentObj = instruments.find(i => i.name.toLowerCase() === instrumentName.toLowerCase());
      if (instrumentObj) {
        termsToRemove.push(...instrumentObj.variants.map(v => v.toLowerCase()));
      }
    });
  }
  
  // Remove terms from text, being careful with word boundaries
  termsToRemove.forEach(term => {
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedTerm}\\b`, 'gi');
    filteredText = filteredText.replace(regex, '');
  });
  
  // Clean up the text: remove multiple spaces, commas and trim
  filteredText = filteredText
    .replace(/\s+/g, ' ')              // Replace multiple spaces with single space
    .replace(/,\s*,+/g, ',')           // Replace multiple consecutive commas
    .replace(/^\s*,\s*|\s*,\s*$/g, '') // Remove commas at start/end
    .trim();
  
  // Check if the filter removed too much
  if (filteredText.length < 5 && text.length > 10) {
    // If too much was removed, return a cleaned version of the original
    return text.trim();
  }
  
  return filteredText;
};

/**
 * Validates a prompt for Suno AI formatting rules
 * @param {string} prompt - The prompt to validate
 * @returns {Object} - Validation result {isValid, errors}
 */
export const validatePrompt = (prompt) => {
  if (!prompt || typeof prompt !== 'string') {
    return {
      isValid: false,
      errors: ['Prompt cannot be empty']
    };
  }
  
  const errors = [];
  
  // Check for minimum length
  if (prompt.length < 10) {
    errors.push('Prompt is too short (minimum 10 characters)');
  }
  
  // Check for maximum length
  if (prompt.length > 200) {
    errors.push('Prompt is too long (maximum 200 characters)');
  }
  
  // Check if genre is in ALL CAPS
  const components = prompt.split(',').map(c => c.trim());
  const possibleGenre = components[0];
  
  if (possibleGenre) {
    const matchedGenre = genres.find(g => 
      g.name.toLowerCase() === possibleGenre.toLowerCase() ||
      g.subGenres.some(s => s.toLowerCase() === possibleGenre.toLowerCase())
    );
    
    if (matchedGenre && possibleGenre !== possibleGenre.toUpperCase()) {
      errors.push('Genre should be in ALL CAPS');
    }
  }
  
  // Check if mood is in Title Case (if it's the second component)
  if (components.length > 1) {
    const possibleMood = components[1];
    const matchedMood = moods.find(m => 
      m.name.toLowerCase() === possibleMood.toLowerCase() ||
      m.keywords.some(k => k.toLowerCase() === possibleMood.toLowerCase())
    );
    
    if (matchedMood) {
      const wordPattern = /\b\w+\b/g;
      const words = possibleMood.match(wordPattern) || [];
      
      const isTitleCase = words.every(word => {
        if (word.length <= 2) return true; // Skip small words
        return word[0] === word[0].toUpperCase() && word.slice(1) === word.slice(1).toLowerCase();
      });
      
      if (!isTitleCase) {
        errors.push('Mood should be in Title Case');
      }
    }
  }
  
  // Check for overly specific technical instructions
  const technicalTerms = ['eq', 'reverb', 'compression', 'db', 'decibel', 'mix', 'master'];
  const hasTechnicalTerms = technicalTerms.some(term => prompt.toLowerCase().includes(term));
  if (hasTechnicalTerms) {
    errors.push('Avoid technical production terms (EQ, reverb, etc.)');
  }
  
  // Suggest adding more components if prompt is too basic
  if (components.length < 3 && prompt.length < 50) {
    errors.push('Consider adding more descriptive elements to your prompt');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Optimizes a prompt by applying Suno AI's formatting rules
 * @param {Object} components - The prompt components
 * @returns {string} - Optimized prompt
 */
export const optimizePrompt = (components) => {
  const { genre, mood, tempo, instruments, decade, description } = components;
  
  // Create components array, filtering out empty values
  const promptParts = [];
  
  // Add genre in ALL CAPS if provided
  if (genre) {
    promptParts.push(genre.toUpperCase());
  }
  
  // Add mood with Title Case if provided
  if (mood) {
    promptParts.push(titleCase(mood));
  }
  
  // Add tempo if provided
  if (tempo) {
    promptParts.push(tempo);
  }
  
  // Add instruments in lowercase if provided
  if (instruments && instruments.length > 0) {
    promptParts.push(instruments.join(', ').toLowerCase());
  }
  
  // Add decade if provided
  if (decade) {
    promptParts.push(decade);
  }
  
  // Add description if provided
  if (description) {
    promptParts.push(description);
  }
  
  // Fill in missing components with intelligent defaults if prompt is too basic
  if (promptParts.length < 3) {
    // If no genre, suggest a default based on other components
    if (!genre && (mood || decade || instruments.length > 0)) {
      // Logic to suggest genre based on other fields
      const suggestedGenre = suggestGenre({ mood, decade, instruments });
      if (suggestedGenre) {
        // Insert genre at beginning
        promptParts.unshift(suggestedGenre.toUpperCase());
      }
    }
    
    // If no mood, suggest a default
    if (!mood && promptParts.length < 3) {
      // Logic to suggest mood based on other fields
      const suggestedMood = suggestMood({ genre, tempo, decade });
      if (suggestedMood) {
        // Insert mood after genre or at beginning
        const genreIndex = genre ? 1 : 0;
        promptParts.splice(genreIndex, 0, titleCase(suggestedMood));
      }
    }
  }
  
  // Combine all parts with proper formatting
  return promptParts.join(', ');
};

/**
 * Helper function to convert string to Title Case
 * @param {string} str - String to convert
 * @returns {string} - String in Title Case
 */
const titleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Suggests a genre based on other components
 * @param {Object} components - Available components
 * @returns {string|null} - Suggested genre or null
 */
const suggestGenre = ({ mood, decade, instruments }) => {
  // If there are instruments, use them to suggest a genre
  if (instruments && instruments.length > 0) {
    if (instruments.includes('guitar') && instruments.includes('drums')) {
      return 'ROCK';
    }
    if (instruments.includes('synthesizer') || instruments.includes('808')) {
      return 'ELECTRONIC';
    }
    if (instruments.includes('piano') && !instruments.includes('drums')) {
      return 'CLASSICAL';
    }
    if (instruments.includes('saxophone') || instruments.includes('trumpet')) {
      return 'JAZZ';
    }
  }
  
  // If there's a decade, use it to suggest a genre
  if (decade) {
    if (decade === '1950s') return 'ROCK';
    if (decade === '1960s') return 'ROCK';
    if (decade === '1970s') return 'ROCK';
    if (decade === '1980s') return 'POP';
    if (decade === '1990s') return 'POP';
    if (decade === '2000s') return 'POP';
    if (decade === '2010s') return 'POP';
    if (decade === '2020s') return 'POP';
    if (decade === 'Classical Era') return 'CLASSICAL';
    if (decade === 'Baroque Era') return 'CLASSICAL';
    if (decade === 'Medieval Era') return 'CLASSICAL';
  }
  
  // If there's a mood, use it to suggest a genre
  if (mood) {
    if (['Energetic', 'Happy', 'Triumphant'].includes(mood)) return 'POP';
    if (['Dark', 'Angry', 'Tense'].includes(mood)) return 'ROCK';
    if (['Calm', 'Peaceful', 'Ethereal'].includes(mood)) return 'AMBIENT';
    if (['Romantic', 'Nostalgic'].includes(mood)) return 'JAZZ';
    if (['Mysterious', 'Dreamy'].includes(mood)) return 'ELECTRONIC';
  }
  
  // Default genre if no suggestions worked
  return 'POP';
};

/**
 * Suggests a mood based on other components
 * @param {Object} components - Available components
 * @returns {string|null} - Suggested mood or null
 */
const suggestMood = ({ genre, tempo, decade }) => {
  // Use genre to suggest mood
  if (genre) {
    if (genre === 'POP') return 'Upbeat';
    if (genre === 'ROCK') return 'Energetic';
    if (genre === 'HIP HOP') return 'Confident';
    if (genre === 'JAZZ') return 'Smooth';
    if (genre === 'ELECTRONIC') return 'Dynamic';
    if (genre === 'CLASSICAL') return 'Elegant';
    if (genre === 'AMBIENT') return 'Peaceful';
    if (genre === 'METAL') return 'Intense';
    if (genre === 'COUNTRY') return 'Heartfelt';
    if (genre === 'BLUES') return 'Soulful';
    if (genre === 'FOLK') return 'Authentic';
  }
  
  // Use tempo to suggest mood
  if (tempo) {
    if (tempo === 'slow' || tempo.includes('slow')) return 'Mellow';
    if (tempo === 'medium' || tempo.includes('medium')) return 'Smooth';
    if (tempo === 'fast' || tempo.includes('fast')) return 'Energetic';
    if (tempo === 'very fast' || tempo.includes('very fast')) return 'Intense';
  }
  
  // Use decade to suggest mood
  if (decade) {
    if (decade === '1950s') return 'Nostalgic';
    if (decade === '1960s') return 'Psychedelic';
    if (decade === '1970s') return 'Groovy';
    if (decade === '1980s') return 'Energetic';
    if (decade === '1990s') return 'Rebellious';
    if (decade === '2000s') return 'Confident';
    if (decade === '2010s') return 'Modern';
    if (decade === '2020s') return 'Contemporary';
  }
  
  // Default mood
  return 'Upbeat';
};