/**
 * Prompt validator utility for Suno AI
 * Ensures prompts follow Suno's formatting guidelines
 */

import genres from '../data/genres';
import moods from '../data/moods';

/**
 * Validates a formatted prompt according to Suno AI guidelines
 * @param {string} prompt - The prompt to validate
 * @returns {Object} - Validation result with feedback
 */
export const validatePrompt = (prompt) => {
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return {
      isValid: false,
      score: 0,
      feedback: [
        {
          type: 'error',
          message: 'Prompt cannot be empty'
        }
      ],
      suggestions: [
        'Start with a genre in ALL CAPS (e.g., POP, ROCK, HIP HOP)',
        'Add a mood or emotion in Title Case'
      ]
    };
  }

  const components = prompt.split(',').map(c => c.trim());
  const feedback = [];
  const suggestions = [];
  let score = 100; // Start with perfect score and deduct points for issues

  // Check for minimum components
  if (components.length < 2) {
    score -= 20;
    feedback.push({
      type: 'warning',
      message: 'Prompt is very basic. Consider adding more descriptive elements.'
    });
    suggestions.push('Add more components separated by commas');
  }

  // Check for genre formatting (should be ALL CAPS)
  const firstComponent = components[0] || '';
  const potentialGenre = genres.find(g => 
    g.name.toLowerCase() === firstComponent.toLowerCase() ||
    g.subGenres.some(sg => sg.toLowerCase() === firstComponent.toLowerCase())
  );

  if (potentialGenre) {
    if (firstComponent !== firstComponent.toUpperCase()) {
      score -= 15;
      feedback.push({
        type: 'error',
        message: 'Genre should be in ALL CAPS'
      });
      suggestions.push(`Change "${firstComponent}" to "${firstComponent.toUpperCase()}"`);
    }
  } else if (components.length > 0) {
    score -= 10;
    feedback.push({
      type: 'warning',
      message: 'First component is not a recognized genre'
    });
    suggestions.push('Start with a genre in ALL CAPS (e.g., POP, ROCK, HIP HOP)');
  }

  // Check for mood formatting (should be Title Case)
  if (components.length > 1) {
    const secondComponent = components[1];
    const potentialMood = moods.find(m => 
      m.name.toLowerCase() === secondComponent.toLowerCase() ||
      m.keywords.some(k => k.toLowerCase() === secondComponent.toLowerCase())
    );

    if (potentialMood) {
      const isTitleCase = isInTitleCase(secondComponent);
      if (!isTitleCase) {
        score -= 10;
        feedback.push({
          type: 'error',
          message: 'Mood should be in Title Case'
        });
        suggestions.push(`Change "${secondComponent}" to "${toTitleCase(secondComponent)}"`);
      }
    }
  }

  // Check for instrument formatting (should be lowercase)
  const instrumentKeywords = ['guitar', 'piano', 'drums', 'bass', 'synth', 'violin', 'saxophone', 'trumpet'];
  components.forEach((component, index) => {
    if (index < 2) return; // Skip genre and mood components

    const containsInstrument = instrumentKeywords.some(instrument => 
      component.toLowerCase().includes(instrument)
    );

    if (containsInstrument && component !== component.toLowerCase()) {
      score -= 5;
      feedback.push({
        type: 'warning',
        message: `Component "${component}" contains instruments and should be lowercase`
      });
      suggestions.push(`Change "${component}" to "${component.toLowerCase()}"`);
    }
  });

  // Check prompt length
  if (prompt.length < 15) {
    score -= 15;
    feedback.push({
      type: 'warning',
      message: 'Prompt is too short and may not generate good results'
    });
    suggestions.push('Add more descriptive elements to your prompt');
  } else if (prompt.length > 200) {
    score -= 10;
    feedback.push({
      type: 'warning',
      message: 'Prompt is very long. Suno works best with concise prompts.'
    });
    suggestions.push('Consider shortening your prompt to be more concise');
  }

  // Check for overuse of commas
  const commaCount = (prompt.match(/,/g) || []).length;
  if (commaCount > 8) {
    score -= 5;
    feedback.push({
      type: 'warning',
      message: 'Prompt has too many commas. Consider consolidating similar ideas.'
    });
  }

  // Check for unnecessary repetition
  const wordCounts = {};
  const words = prompt.toLowerCase().split(/[\s,]+/);
  words.forEach(word => {
    if (word.length > 3) { // Only check substantial words
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  });

  const repeatedWords = Object.entries(wordCounts)
    .filter(([word, count]) => count > 1)
    .map(([word]) => word);

  if (repeatedWords.length > 0) {
    score -= 5;
    feedback.push({
      type: 'warning',
      message: `Repeated words: ${repeatedWords.join(', ')}`
    });
    suggestions.push('Avoid repeating the same words in your prompt');
  }

  // Add additional suggestions based on score
  if (score < 70) {
    suggestions.push('Review Suno AI prompt guidelines for better results');
  }

  // Limit score to 0-100 range
  score = Math.max(0, Math.min(100, score));

  return {
    isValid: score >= 70, // Consider valid if score is 70 or above
    score,
    feedback,
    suggestions
  };
};

/**
 * Checks if a string is in Title Case
 * @param {string} text - Text to check
 * @returns {boolean} - Whether text is in Title Case
 */
const isInTitleCase = (text) => {
  const words = text.split(/\s+/);
  return words.every((word, index) => {
    // Skip small prepositions, articles, and conjunctions if not first word
    if (index > 0 && ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'in', 'at', 'to', 'by', 'with'].includes(word.toLowerCase())) {
      return true;
    }
    return word.charAt(0) === word.charAt(0).toUpperCase() && 
           word.substring(1) === word.substring(1).toLowerCase();
  });
};

/**
 * Converts text to Title Case
 * @param {string} text - Text to convert
 * @returns {string} - Text in Title Case
 */
const toTitleCase = (text) => {
  return text.replace(/\w\S*/g, (word, index) => {
    // Skip small prepositions, articles, and conjunctions if not first word
    if (index > 0 && ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'in', 'at', 'to', 'by', 'with'].includes(word.toLowerCase())) {
      return word.toLowerCase();
    }
    return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
  });
};

/**
 * Get feedback on how to improve a prompt
 * @param {Object} components - Current prompt components
 * @returns {Object} - Feedback with suggestions for improvement
 */
export const getPromptImprovementSuggestions = (components) => {
  const { genre, mood, tempo, instruments, decade, description } = components;
  const suggestions = [];

  // Check for missing essential components
  if (!genre) {
    suggestions.push({
      type: 'essential',
      message: 'Add a genre to your prompt',
      examples: ['POP', 'ROCK', 'HIP HOP', 'ELECTRONIC']
    });
  }

  if (!mood) {
    suggestions.push({
      type: 'essential',
      message: 'Add a mood or emotion to your prompt',
      examples: ['Upbeat', 'Melancholic', 'Energetic', 'Peaceful']
    });
  }

  // Suggest adding instruments if missing
  if (!instruments || instruments.length === 0) {
    suggestions.push({
      type: 'enhancement',
      message: 'Specify instruments to get more accurate sound',
      examples: ['piano, guitar', 'synth bass, drums', 'violin, cello']
    });
  }

  // Suggest adding tempo if missing
  if (!tempo) {
    suggestions.push({
      type: 'enhancement',
      message: 'Add tempo information for better rhythm',
      examples: ['slow', 'medium', 'fast', '120 BPM']
    });
  }

  // Suggest adding decade if missing
  if (!decade) {
    suggestions.push({
      type: 'style',
      message: 'Add a decade or era for historical style',
      examples: ['1980s', '1990s', '2000s']
    });
  }

  // Suggest adding more description if too short
  if (!description || description.length < 10) {
    suggestions.push({
      type: 'detail',
      message: 'Add more descriptive elements to your prompt',
      examples: ['with driving rhythm', 'featuring lush harmonies', 'with a catchy chorus']
    });
  }

  // Provide format recommendation
  const formatSuggestion = {
    type: 'format',
    message: 'For best results, follow this format:',
    example: 'GENRE, Mood, tempo, instruments, decade, additional description'
  };

  return {
    hasEssentialComponents: !!genre && !!mood,
    componentsScore: calculateComponentsScore({ genre, mood, tempo, instruments, decade, description }),
    formatRecommendation: formatSuggestion,
    suggestions
  };
};

/**
 * Calculate a score based on the completeness of prompt components
 * @param {Object} components - Prompt components
 * @returns {number} - Score from 0-100
 */
const calculateComponentsScore = ({ genre, mood, tempo, instruments, decade, description }) => {
  let score = 0;
  
  // Essential components are worth more points
  if (genre) score += 30;
  if (mood) score += 20;
  
  // Additional components add smaller improvements
  if (tempo) score += 15;
  if (instruments && instruments.length > 0) score += 15;
  if (decade) score += 10;
  
  // Description quality affects score
  if (description) {
    if (description.length < 10) score += 5;
    else if (description.length < 30) score += 10;
    else score += 15;
  }
  
  // Bonus for having a well-rounded prompt
  if (genre && mood && tempo && instruments && instruments.length > 0 && decade) {
    score += 5; // Bonus for complete prompt
  }
  
  return Math.min(100, score); // Cap at 100
};