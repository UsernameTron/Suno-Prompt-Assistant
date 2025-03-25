/**
 * Validation utilities for Suno AI prompts
 * Ensures that prompts follow Suno's recommended guidelines and format
 */

import promptData from '../data/genres.json';

/**
 * Validate a Suno AI prompt against formatting guidelines
 * @param {string} prompt - The prompt to validate
 * @returns {Object} - Validation result with score and feedback
 */
export const validatePrompt = (prompt) => {
  if (!prompt || typeof prompt !== 'string') {
    return {
      isValid: false,
      score: 0,
      feedback: [
        { type: 'error', message: 'Prompt cannot be empty' }
      ],
      suggestions: [
        'Start with a genre in ALL CAPS',
        'Include a mood in Title Case',
        'Add specific instruments'
      ]
    };
  }

  const components = prompt.split(',').map(c => c.trim());
  const feedback = [];
  const suggestions = [];
  let score = 100; // Start with perfect score and deduct for issues

  // Check length
  if (prompt.length < 15) {
    score -= 20;
    feedback.push({ type: 'error', message: 'Prompt is too short and may not generate good results' });
    suggestions.push('Expand your prompt with more details');
  } else if (prompt.length > 250) {
    score -= 10;
    feedback.push({ type: 'warning', message: 'Prompt is very long; consider being more concise' });
    suggestions.push('Focus on the most important musical elements');
  }

  // Check number of components
  if (components.length < 3) {
    score -= 15;
    feedback.push({ type: 'warning', message: 'Prompt has few components' });
    suggestions.push('Add more elements separated by commas (genre, mood, instruments, etc.)');
  }

  // Check first component (should be genre in ALL CAPS)
  if (components.length > 0) {
    const firstComponent = components[0];
    
    // Check if it's a recognizable genre
    const isKnownGenre = promptData.genres.some(genre => 
      genre.toUpperCase() === firstComponent.toUpperCase()
    );
    
    if (isKnownGenre) {
      // Check if it's in ALL CAPS
      if (firstComponent !== firstComponent.toUpperCase()) {
        score -= 15;
        feedback.push({ type: 'error', message: 'First component (genre) should be in ALL CAPS' });
        suggestions.push(`Change "${firstComponent}" to "${firstComponent.toUpperCase()}"`);
      }
    } else {
      score -= 10;
      feedback.push({ type: 'warning', message: 'First component does not appear to be a recognized genre' });
      suggestions.push('Start prompt with a music genre in ALL CAPS');
    }
  }

  // Check second component (should be mood in Title Case)
  if (components.length > 1) {
    const secondComponent = components[1];
    
    // Check if it's a recognizable mood
    const isKnownMood = promptData.moods.some(mood => 
      mood.toLowerCase() === secondComponent.toLowerCase()
    );
    
    if (isKnownMood) {
      // Check if it's in Title Case
      if (!isInTitleCase(secondComponent)) {
        score -= 10;
        feedback.push({ type: 'error', message: 'Second component (mood) should be in Title Case' });
        suggestions.push(`Change "${secondComponent}" to "${toTitleCase(secondComponent)}"`);
      }
    } else {
      // Not critical, but worth noting
      score -= 5;
      feedback.push({ type: 'info', message: 'Second component does not appear to be a recognized mood' });
      suggestions.push('Consider adding a mood descriptor in Title Case as the second component');
    }
  }

  // Check for instruments (should be lowercase)
  const potentialInstruments = components.slice(2);
  const instrumentPatterns = [
    /\b(guitar|piano|drums|bass|synth|violin|trumpet|sax|flute|cello|harp|organ)\b/i,
    /\b(percussion|synthesizer|saxophone|keyboard|orchestra|choir|ensemble|strings)\b/i
  ];
  
  const instrumentComponents = potentialInstruments.filter(component => 
    instrumentPatterns.some(pattern => pattern.test(component))
  );
  
  if (instrumentComponents.length > 0) {
    const nonLowercaseInstruments = instrumentComponents.filter(
      component => component !== component.toLowerCase()
    );
    
    if (nonLowercaseInstruments.length > 0) {
      score -= 5;
      feedback.push({ 
        type: 'warning', 
        message: 'Instrument components should be in lowercase' 
      });
      suggestions.push('Convert instrument names to lowercase');
    }
  } else {
    // Suggest adding instruments if none found
    if (components.length >= 2) {
      score -= 5;
      feedback.push({ type: 'info', message: 'No specific instruments detected' });
      suggestions.push('Add specific instruments for better results (e.g., guitar, piano, drums)');
    }
  }

  // Check for very repetitive terms
  const words = prompt.toLowerCase().split(/[\s,]+/);
  const wordCounts = {};
  
  words.forEach(word => {
    if (word.length > 3) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  });
  
  const repeatedWords = Object.entries(wordCounts)
    .filter(([_, count]) => count > 2)
    .map(([word]) => word);
  
  if (repeatedWords.length > 0) {
    score -= 5;
    feedback.push({ 
      type: 'warning', 
      message: `Prompt contains repetitive terms: ${repeatedWords.join(', ')}` 
    });
    suggestions.push('Avoid repeating the same terms multiple times');
  }

  // Additional quality checks
  if (!prompt.includes(',')) {
    score -= 15;
    feedback.push({ type: 'error', message: 'Missing commas to separate prompt components' });
    suggestions.push('Use commas to separate different musical elements');
  }

  // Add general suggestions based on missing elements
  if (!instrumentComponents.length && !suggestions.includes('Add specific instruments for better results (e.g., guitar, piano, drums)')) {
    suggestions.push('Add specific instruments for better results');
  }
  
  if (!components.some(c => /\b(1\d{3}|20\d{2}|\d{2}s|century)\b/i.test(c))) {
    suggestions.push('Consider adding a decade or era reference (e.g., 1980s, 2010s)');
  }

  // Ensure score stays within 0-100 range
  score = Math.max(0, Math.min(100, Math.round(score)));
  
  return {
    isValid: score >= 70,
    score: score,
    feedback: feedback,
    suggestions: suggestions.slice(0, 3) // Limit to top 3 suggestions
  };
};

/**
 * Check if text is in Title Case format
 * @param {string} text - Text to check
 * @returns {boolean} - Whether text is in Title Case
 */
const isInTitleCase = (text) => {
  const words = text.split(/\s+/);
  
  return words.every((word, index) => {
    // Skip checking articles, conjunctions, and prepositions after the first word
    if (index > 0 && /^(a|an|the|and|but|or|for|nor|on|at|to|by|with|in)$/i.test(word)) {
      return true;
    }
    
    return word.charAt(0) === word.charAt(0).toUpperCase() && 
           word.substr(1) === word.substr(1).toLowerCase();
  });
};

/**
 * Convert text to Title Case format
 * @param {string} text - Text to convert
 * @returns {string} - Text in Title Case
 */
const toTitleCase = (text) => {
  const smallWords = /^(a|an|the|and|but|or|for|nor|on|at|to|by|with|in)$/i;
  
  return text.split(/\s+/)
    .map((word, index) => {
      // Don't capitalize small words unless it's the first word
      if (index > 0 && smallWords.test(word)) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    })
    .join(' ');
};

/**
 * Analyze a prompt to highlight component structure
 * @param {string} prompt - Prompt to analyze
 * @returns {Object[]} - Array of component objects with type and text
 */
export const analyzePromptStructure = (prompt) => {
  if (!prompt) return [];
  
  const components = prompt.split(',').map(c => c.trim());
  const result = [];
  
  components.forEach((component, index) => {
    if (index === 0) {
      // First component should be genre
      const isGenre = promptData.genres.some(genre => 
        genre.toUpperCase() === component.toUpperCase()
      );
      
      result.push({
        type: isGenre ? 'genre' : 'unknown',
        text: component,
        isFormatted: component === component.toUpperCase()
      });
    } 
    else if (index === 1) {
      // Second component should be mood
      const isMood = promptData.moods.some(mood => 
        mood.toLowerCase() === component.toLowerCase()
      );
      
      result.push({
        type: isMood ? 'mood' : 'unknown',
        text: component,
        isFormatted: isInTitleCase(component)
      });
    }
    else {
      // Identify other components
      if (/\b(slow|fast|moderate|tempo|bpm|beats|rhythm)\b/i.test(component)) {
        result.push({
          type: 'tempo',
          text: component,
          isFormatted: true // No specific formatting for tempo
        });
      }
      else if (promptData.decades.some(decade => decade.toLowerCase() === component.toLowerCase())) {
        result.push({
          type: 'decade',
          text: component,
          isFormatted: true // No specific formatting for decades
        });
      }
      else if (/\b(guitar|piano|drums|bass|synth|violin|trumpet|sax|flute)\b/i.test(component)) {
        result.push({
          type: 'instruments',
          text: component,
          isFormatted: component === component.toLowerCase()
        });
      }
      else if (promptData.regions.some(region => region.toLowerCase() === component.toLowerCase())) {
        result.push({
          type: 'region',
          text: component,
          isFormatted: true
        });
      }
      else if (promptData.vocals.some(vocal => vocal.toLowerCase() === component.toLowerCase())) {
        result.push({
          type: 'vocals',
          text: component,
          isFormatted: component === component.toLowerCase()
        });
      }
      else {
        // If can't identify, assume it's a descriptor
        result.push({
          type: 'descriptor',
          text: component,
          isFormatted: isInTitleCase(component)
        });
      }
    }
  });
  
  return result;
};

/**
 * Check if a component is missing from the prompt
 * @param {string} prompt - The prompt to check
 * @returns {Object} - Object with flags for missing components
 */
export const checkMissingComponents = (prompt) => {
  const components = prompt.split(',').map(c => c.trim());
  
  // Initialize with everything missing
  const missing = {
    genre: true,
    mood: true,
    tempo: true,
    instruments: true,
    decade: true
  };
  
  // First component should be genre
  if (components.length > 0) {
    const isGenre = promptData.genres.some(genre => 
      genre.toUpperCase() === components[0].toUpperCase()
    );
    
    if (isGenre) {
      missing.genre = false;
    }
  }
  
  // Second component should be mood
  if (components.length > 1) {
    const isMood = promptData.moods.some(mood => 
      mood.toLowerCase() === components[1].toLowerCase()
    );
    
    if (isMood) {
      missing.mood = false;
    }
  }
  
  // Check remaining components
  for (let i = 2; i < components.length; i++) {
    const component = components[i];
    
    // Check for tempo
    if (/\b(slow|fast|moderate|tempo|bpm|beats|rhythm)\b/i.test(component)) {
      missing.tempo = false;
    }
    
    // Check for instruments
    if (/\b(guitar|piano|drums|bass|synth|violin|trumpet|sax|flute)\b/i.test(component)) {
      missing.instruments = false;
    }
    
    // Check for decade
    if (promptData.decades.some(decade => decade.toLowerCase() === component.toLowerCase())) {
      missing.decade = false;
    }
  }
  
  return {
    missingComponents: missing,
    missingCount: Object.values(missing).filter(Boolean).length
  };
};

export default {
  validatePrompt,
  analyzePromptStructure,
  checkMissingComponents
};