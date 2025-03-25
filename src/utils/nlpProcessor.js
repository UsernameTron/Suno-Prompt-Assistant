/**
 * Natural Language Processing Engine for Suno AI Prompt Optimization
 * Combines pattern matching, keyword analysis, and rule-based extraction
 * to convert natural language descriptions into structured prompt components.
 */

import promptData from '../data/genres.json';
import {
  findGenreMatch,
  findMoodMatch,
  findDecadeMatch,
  findTempoMatch,
  findInstrumentMatches
} from './nlpPatterns';

/**
 * Process natural language input to extract musical components
 * @param {string} input - Natural language text describing desired music
 * @returns {Object} - Extracted components for prompt construction
 */
export const processNaturalLanguage = (input) => {
  if (!input || typeof input !== 'string') {
    return {
      genre: '',
      mood: '',
      tempo: '',
      instruments: '',
      decade: '',
      region: '',
      vocals: '',
      structure: '',
      descriptors: '',
      description: ''
    };
  }

  // Normalize input text for consistent processing
  const normalizedInput = normalizeInput(input);
  
  // Extract components using pattern matching and keyword analysis
  const genre = extractGenre(normalizedInput);
  const mood = extractMood(normalizedInput);
  const tempo = extractTempo(normalizedInput);
  const instruments = extractInstruments(normalizedInput);
  const decade = extractDecade(normalizedInput);
  const region = extractRegion(normalizedInput);
  const vocals = extractVocals(normalizedInput);
  const structure = extractStructure(normalizedInput);
  const descriptors = extractDescriptors(normalizedInput);
  
  // Generate a filtered description by removing identified components
  const description = generateDescription(normalizedInput, {
    genre, mood, tempo, instruments, decade, region, vocals, structure, descriptors
  });
  
  return {
    genre,
    mood,
    tempo,
    instruments,
    decade, 
    region,
    vocals,
    structure,
    descriptors,
    description
  };
};

/**
 * Format extracted components into an optimized Suno AI prompt
 * @param {Object} components - Extracted musical components
 * @returns {string} - Formatted prompt following Suno AI guidelines
 */
export const formatPrompt = (components) => {
  const formattedComponents = [];
  
  // Add genre in ALL CAPS if provided
  if (components.genre) {
    formattedComponents.push(components.genre.toUpperCase());
  }
  
  // Add mood in Title Case if provided
  if (components.mood) {
    formattedComponents.push(toTitleCase(components.mood));
  }
  
  // Add tempo if provided
  if (components.tempo) {
    formattedComponents.push(components.tempo);
  }
  
  // Add instruments (lowercase, comma-separated) if provided
  if (components.instruments) {
    // Handle both string and array formats
    const instrumentsString = Array.isArray(components.instruments)
      ? components.instruments.join(', ').toLowerCase()
      : components.instruments.toLowerCase();
    
    if (instrumentsString.trim()) {
      formattedComponents.push(instrumentsString);
    }
  }
  
  // Add decade if provided
  if (components.decade) {
    formattedComponents.push(components.decade);
  }
  
  // Add vocals if provided
  if (components.vocals) {
    formattedComponents.push(components.vocals.toLowerCase());
  }
  
  // Add region if provided
  if (components.region) {
    formattedComponents.push(components.region);
  }
  
  // Add descriptors (Title Case) if provided
  if (components.descriptors) {
    const descriptorsList = components.descriptors
      .split(',')
      .map(d => toTitleCase(d.trim()))
      .filter(d => d)
      .join(', ');
    
    if (descriptorsList) {
      formattedComponents.push(descriptorsList);
    }
  }
  
  // Add structure if provided
  if (components.structure) {
    formattedComponents.push(components.structure);
  }
  
  // Add description if provided and not already covered by other components
  if (components.description && components.description.trim()) {
    formattedComponents.push(components.description);
  }
  
  // Join all components with commas
  return formattedComponents.join(', ');
};

/**
 * Extract genre from normalized input text
 * @param {string} input - Normalized input text
 * @returns {string} - Extracted genre or empty string
 */
const extractGenre = (input) => {
  // Use pattern matching from nlpPatterns
  const genreMatch = findGenreMatch(input);
  if (genreMatch) {
    return genreMatch;
  }
  
  // If no pattern match, search for genre keywords
  const genreKeywords = promptData.genres.map(g => g.toLowerCase());
  
  for (const keyword of genreKeywords) {
    if (input.includes(keyword.toLowerCase())) {
      return keyword.toUpperCase();
    }
  }
  
  return '';
};

/**
 * Extract mood from normalized input text
 * @param {string} input - Normalized input text
 * @returns {string} - Extracted mood or empty string
 */
const extractMood = (input) => {
  // Use pattern matching from nlpPatterns
  const moodMatch = findMoodMatch(input);
  if (moodMatch) {
    return toTitleCase(moodMatch);
  }
  
  // If no pattern match, search for mood keywords
  const moodKeywords = promptData.moods.map(m => m.toLowerCase());
  
  for (const keyword of moodKeywords) {
    if (input.includes(keyword.toLowerCase())) {
      return toTitleCase(keyword);
    }
  }
  
  return '';
};

/**
 * Extract tempo from normalized input text
 * @param {string} input - Normalized input text
 * @returns {string} - Extracted tempo or empty string
 */
const extractTempo = (input) => {
  // Use pattern matching from nlpPatterns
  const tempoMatch = findTempoMatch(input);
  if (tempoMatch) {
    return tempoMatch;
  }
  
  // If no pattern match, search for tempo descriptor keywords
  const tempoKeywords = promptData.tempo_descriptors.map(t => t.toLowerCase());
  
  for (const keyword of tempoKeywords) {
    if (input.includes(keyword.toLowerCase())) {
      return keyword;
    }
  }
  
  return '';
};

/**
 * Extract instruments from normalized input text
 * @param {string} input - Normalized input text
 * @returns {string} - Comma-separated list of instruments
 */
const extractInstruments = (input) => {
  // Use pattern matching from nlpPatterns
  const instrumentMatches = findInstrumentMatches(input);
  if (instrumentMatches.length > 0) {
    return instrumentMatches.join(', ');
  }
  
  // If no pattern match, search for instrument keywords
  const instrumentKeywords = promptData.common_instruments;
  
  const foundInstruments = instrumentKeywords.filter(instrument => 
    input.includes(instrument.toLowerCase())
  );
  
  return foundInstruments.join(', ');
};

/**
 * Extract decade/era from normalized input text
 * @param {string} input - Normalized input text
 * @returns {string} - Extracted decade or empty string
 */
const extractDecade = (input) => {
  // Use pattern matching from nlpPatterns
  const decadeMatch = findDecadeMatch(input);
  if (decadeMatch) {
    return decadeMatch;
  }
  
  // If no pattern match, search for decade keywords
  const decadeKeywords = promptData.decades.map(d => d.toLowerCase());
  
  for (const keyword of decadeKeywords) {
    if (input.includes(keyword.toLowerCase())) {
      return keyword;
    }
  }
  
  return '';
};

/**
 * Extract region from normalized input text
 * @param {string} input - Normalized input text
 * @returns {string} - Extracted region or empty string
 */
const extractRegion = (input) => {
  const regionKeywords = promptData.regions.map(r => r.toLowerCase());
  
  for (const keyword of regionKeywords) {
    if (input.includes(keyword.toLowerCase())) {
      return keyword;
    }
  }
  
  return '';
};

/**
 * Extract vocals from normalized input text
 * @param {string} input - Normalized input text
 * @returns {string} - Extracted vocals or empty string
 */
const extractVocals = (input) => {
  const vocalsKeywords = promptData.vocals.map(v => v.toLowerCase());
  
  for (const keyword of vocalsKeywords) {
    if (input.includes(keyword.toLowerCase())) {
      return keyword;
    }
  }
  
  return '';
};

/**
 * Extract structure from normalized input text
 * @param {string} input - Normalized input text
 * @returns {string} - Extracted structure or empty string
 */
const extractStructure = (input) => {
  const structureKeywords = promptData.structures.map(s => s.toLowerCase());
  
  for (const keyword of structureKeywords) {
    if (input.includes(keyword.toLowerCase())) {
      return keyword;
    }
  }
  
  return '';
};

/**
 * Extract descriptors from normalized input text
 * @param {string} input - Normalized input text
 * @returns {string} - Extracted descriptors as comma-separated list
 */
const extractDescriptors = (input) => {
  const descriptorKeywords = promptData.common_descriptors.map(d => d.toLowerCase());
  
  const foundDescriptors = descriptorKeywords.filter(descriptor => 
    input.includes(descriptor.toLowerCase())
  );
  
  return foundDescriptors.map(d => toTitleCase(d)).join(', ');
};

/**
 * Generate a filtered description by removing identified components
 * @param {string} input - Original normalized input
 * @param {Object} components - Extracted components to remove
 * @returns {string} - Filtered description
 */
const generateDescription = (input, components) => {
  let description = input;
  
  // Remove genre terms
  if (components.genre) {
    description = removeTermsFromText(description, [components.genre.toLowerCase()]);
  }
  
  // Remove mood terms
  if (components.mood) {
    description = removeTermsFromText(description, [components.mood.toLowerCase()]);
  }
  
  // Remove tempo terms
  if (components.tempo) {
    description = removeTermsFromText(description, [components.tempo.toLowerCase()]);
  }
  
  // Remove instrument terms
  if (components.instruments) {
    const instrumentTerms = components.instruments.split(',').map(i => i.trim().toLowerCase());
    description = removeTermsFromText(description, instrumentTerms);
  }
  
  // Remove decade terms
  if (components.decade) {
    description = removeTermsFromText(description, [components.decade.toLowerCase()]);
  }
  
  // Remove region terms
  if (components.region) {
    description = removeTermsFromText(description, [components.region.toLowerCase()]);
  }
  
  // Remove vocals terms
  if (components.vocals) {
    description = removeTermsFromText(description, [components.vocals.toLowerCase()]);
  }
  
  // Remove structure terms
  if (components.structure) {
    description = removeTermsFromText(description, [components.structure.toLowerCase()]);
  }
  
  // Remove descriptor terms
  if (components.descriptors) {
    const descriptorTerms = components.descriptors.split(',').map(d => d.trim().toLowerCase());
    description = removeTermsFromText(description, descriptorTerms);
  }
  
  // Clean up the description
  description = cleanDescription(description);
  
  return description;
};

/**
 * Remove specific terms from text
 * @param {string} text - Text to filter
 * @param {string[]} terms - Terms to remove
 * @returns {string} - Text with terms removed
 */
const removeTermsFromText = (text, terms) => {
  let result = text;
  
  terms.forEach(term => {
    if (term) {
      // Create a regex that matches the term with word boundaries
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      result = result.replace(regex, '');
    }
  });
  
  return result;
};

/**
 * Clean up description text after removing terms
 * @param {string} description - Description to clean
 * @returns {string} - Cleaned description
 */
const cleanDescription = (description) => {
  return description
    // Remove repeated spaces
    .replace(/\s+/g, ' ')
    // Remove repeated commas
    .replace(/,+/g, ',')
    // Remove commas at the beginning or end
    .replace(/^,|,$/g, '')
    // Remove common filler phrases
    .replace(/\b(i want|i need|please make|create|generate|a song|a track|a piece|music that is|music with|sounds like)\b/gi, '')
    // Final trim
    .trim();
};

/**
 * Normalize input text for consistent processing
 * @param {string} input - Raw input text
 * @returns {string} - Normalized text
 */
const normalizeInput = (input) => {
  return input
    .toLowerCase()
    .replace(/[^\w\s,'-]/g, ' ') // Replace special chars except those needed
    .replace(/\s+/g, ' ')        // Replace multiple spaces with single space
    .trim();
};

/**
 * Convert text to Title Case
 * @param {string} text - Text to convert
 * @returns {string} - Text in Title Case
 */
const toTitleCase = (text) => {
  return text.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
  );
};

// Export additional functions that were in the original nlpProcessor.js
export const extractComponents = processNaturalLanguage;
export const optimizePrompt = formatPrompt;