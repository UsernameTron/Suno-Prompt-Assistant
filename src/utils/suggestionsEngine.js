/**
 * AI-powered suggestions engine for Suno AI prompt optimization
 * Generates intelligent suggestions for improving music prompts
 */

import promptData from '../data/genres.json';
import templates, { getRecommendedTemplates } from '../data/templates';

/**
 * Generate suggestions for improving a prompt based on current components
 * @param {Object} components - Current prompt components
 * @returns {Object} - Suggestions for improvement
 */
export const generateSuggestions = (components) => {
  if (!components) return { suggestions: [] };
  
  const suggestions = [];
  
  // Suggest genre-specific elements
  if (components.genre) {
    const genreSuggestions = getGenreSuggestions(components.genre, components);
    suggestions.push(...genreSuggestions);
  }
  
  // Suggest mood-appropriate elements
  if (components.mood) {
    const moodSuggestions = getMoodSuggestions(components.mood, components);
    suggestions.push(...moodSuggestions);
  }
  
  // Suggest decade-appropriate elements
  if (components.decade) {
    const decadeSuggestions = getDecadeSuggestions(components.decade, components);
    suggestions.push(...decadeSuggestions);
  }
  
  // Recommend templates that match the current components
  const recommendedTemplates = getRecommendedTemplates(components);
  
  return {
    suggestions: deduplicateSuggestions(suggestions).slice(0, 5),
    recommendedTemplates
  };
};

/**
 * Get suggestions specific to a genre
 * @param {string} genre - Genre to get suggestions for
 * @param {Object} components - Current components
 * @returns {Array} - Suggestions for the genre
 */
const getGenreSuggestions = (genre, components) => {
  const suggestions = [];
  const normalizedGenre = genre.toUpperCase();
  
  // Genre-specific instrument suggestions
  const genreInstrumentMap = {
    'POP': ['synth', 'electric guitar', 'piano', 'drums', 'bass'],
    'ROCK': ['electric guitar', 'drums', 'bass', 'distorted guitar', 'power chords'],
    'HIP HOP': ['808', 'sampler', 'drum machine', 'bass', 'hi-hats'],
    'ELECTRONIC': ['synthesizer', 'drum machine', '808', 'sampler', 'arpeggiator'],
    'JAZZ': ['saxophone', 'piano', 'upright bass', 'trumpet', 'brushed drums'],
    'CLASSICAL': ['piano', 'violin', 'cello', 'orchestra', 'strings'],
    'COUNTRY': ['acoustic guitar', 'banjo', 'fiddle', 'steel guitar', 'harmonica'],
    'FOLK': ['acoustic guitar', 'banjo', 'mandolin', 'harmonica', 'upright bass'],
    'METAL': ['distorted guitar', 'double bass drum', 'heavy bass', 'power chords', 'electric guitar'],
    'BLUES': ['electric guitar', 'harmonica', 'piano', 'bass', 'drums'],
    'AMBIENT': ['synthesizer', 'pad sounds', 'atmospheric textures', 'reverb', 'piano']
  };
  
  // Genre-specific tempo suggestions
  const genreTempoMap = {
    'POP': ['medium-fast', '110-130 BPM'],
    'ROCK': ['medium', 'fast', '120-140 BPM'],
    'HIP HOP': ['slow to medium', '85-100 BPM'],
    'ELECTRONIC': ['fast', '120-140 BPM'],
    'JAZZ': ['medium-slow', 'varying tempo'],
    'CLASSICAL': ['varying tempo', 'dynamic tempo'],
    'COUNTRY': ['medium', '90-120 BPM'],
    'FOLK': ['slow to medium', '80-110 BPM'],
    'METAL': ['fast', 'very fast', '140-180 BPM'],
    'BLUES': ['slow to medium', '60-100 BPM'],
    'AMBIENT': ['slow', 'very slow', 'no distinct tempo']
  };
  
  // Get instruments for the genre if not already added
  if ((!components.instruments || components.instruments.length === 0) && genreInstrumentMap[normalizedGenre]) {
    suggestions.push({
      type: 'instruments',
      message: `Try adding these instruments common in ${normalizedGenre}:`,
      options: genreInstrumentMap[normalizedGenre].slice(0, 3)
    });
  }
  
  // Suggest tempo if not specified
  if (!components.tempo && genreTempoMap[normalizedGenre]) {
    suggestions.push({
      type: 'tempo',
      message: `Consider this tempo range for ${normalizedGenre}:`,
      options: genreTempoMap[normalizedGenre].slice(0, 1)
    });
  }
  
  // Suggest common structures for the genre
  const genreStructureMap = {
    'POP': 'Verse-Chorus',
    'ROCK': 'Verse-Chorus-Bridge',
    'HIP HOP': 'Verse-Hook-Verse-Hook',
    'ELECTRONIC': 'Intro-Build-Drop',
    'JAZZ': 'Head-Solo-Head',
    'CLASSICAL': 'Sonata form or Through-composed',
    'AMBIENT': 'Through-composed or Minimalist'
  };
  
  if (!components.structure && genreStructureMap[normalizedGenre]) {
    suggestions.push({
      type: 'structure',
      message: `Common structure for ${normalizedGenre}:`,
      options: [genreStructureMap[normalizedGenre]]
    });
  }
  
  return suggestions;
};

/**
 * Get suggestions specific to a mood
 * @param {string} mood - Mood to get suggestions for
 * @param {Object} components - Current components
 * @returns {Array} - Suggestions for the mood
 */
const getMoodSuggestions = (mood, components) => {
  const suggestions = [];
  const normalizedMood = mood.toLowerCase();
  
  // Mood-specific descriptor suggestions
  const moodDescriptorMap = {
    'energetic': ['Vibrant', 'Powerful', 'Dynamic', 'Driving'],
    'happy': ['Uplifting', 'Cheerful', 'Positive', 'Bright'],
    'sad': ['Melancholic', 'Emotional', 'Introspective', 'Wistful'],
    'calm': ['Peaceful', 'Soothing', 'Gentle', 'Mellow'],
    'dark': ['Intense', 'Brooding', 'Mysterious', 'Heavy'],
    'epic': ['Powerful', 'Cinematic', 'Dramatic', 'Grand'],
    'romantic': ['Emotional', 'Intimate', 'Warm', 'Passionate'],
    'nostalgic': ['Retro', 'Reminiscent', 'Sentimental', 'Yearning'],
    'dreamy': ['Ethereal', 'Atmospheric', 'Hazy', 'Floating'],
    'mysterious': ['Enigmatic', 'Cryptic', 'Intriguing', 'Dark']
  };
  
  // Suggest descriptors if not specified
  if (!components.descriptors && moodDescriptorMap[normalizedMood]) {
    suggestions.push({
      type: 'descriptors',
      message: `Descriptors that complement "${mood}":`,
      options: moodDescriptorMap[normalizedMood].slice(0, 2)
    });
  }
  
  // Mood-specific instrument suggestions
  const moodInstrumentMap = {
    'energetic': ['drums', 'electric guitar', 'synth', 'percussion'],
    'happy': ['piano', 'acoustic guitar', 'upbeat drums', 'brass section'],
    'sad': ['piano', 'cello', 'violin', 'acoustic guitar'],
    'calm': ['piano', 'acoustic guitar', 'gentle synth pads', 'subtle percussion'],
    'dark': ['deep bass', 'distorted sounds', 'minor chords', 'atmospheric elements'],
    'epic': ['orchestra', 'drums', 'brass section', 'strings'],
    'dreamy': ['reverb', 'synth pads', 'airy textures', 'gentle piano']
  };
  
  // Suggest instruments if not specified
  if ((!components.instruments || components.instruments.length === 0) && moodInstrumentMap[normalizedMood]) {
    suggestions.push({
      type: 'instruments',
      message: `Instruments that work well for ${mood} music:`,
      options: moodInstrumentMap[normalizedMood].slice(0, 3)
    });
  }
  
  return suggestions;
};

/**
 * Get suggestions specific to a decade
 * @param {string} decade - Decade to get suggestions for
 * @param {Object} components - Current components
 * @returns {Array} - Suggestions for the decade
 */
const getDecadeSuggestions = (decade, components) => {
  const suggestions = [];
  
  // Decade-specific instrument suggestions
  const decadeInstrumentMap = {
    '1950s': ['electric guitar', 'upright bass', 'saxophone', 'piano', 'drums'],
    '1960s': ['electric guitar', 'bass guitar', 'organ', 'drums', 'sitars'],
    '1970s': ['electric guitar', 'synthesizer', 'drums', 'bass', 'electric piano'],
    '1980s': ['synth', 'drum machine', 'electric guitar', 'bass synth', 'gated reverb drums'],
    '1990s': ['electric guitar', 'drums', 'bass', 'turntables', 'sampler'],
    '2000s': ['electric guitar', 'processed vocals', 'drums', 'bass', 'piano'],
    '2010s': ['synth', 'processed drums', '808 bass', 'vocal samples', 'digital effects'],
    '2020s': ['trap drums', 'auto-tune', 'synth bass', 'sampler', 'electronic elements']
  };
  
  // Suggest instruments if not specified
  if ((!components.instruments || components.instruments.length === 0) && decadeInstrumentMap[decade]) {
    suggestions.push({
      type: 'instruments',
      message: `Instruments common in ${decade} music:`,
      options: decadeInstrumentMap[decade].slice(0, 3)
    });
  }
  
  // Decade-specific genre suggestions if genre not specified
  const decadeGenreMap = {
    '1950s': ['ROCK', 'JAZZ', 'BLUES'],
    '1960s': ['ROCK', 'FOLK', 'SOUL'],
    '1970s': ['ROCK', 'DISCO', 'FUNK', 'PUNK'],
    '1980s': ['POP', 'ROCK', 'HIP HOP', 'ELECTRONIC'],
    '1990s': ['ROCK', 'HIP HOP', 'POP', 'ELECTRONIC'],
    '2000s': ['POP', 'HIP HOP', 'ROCK', 'R&B'],
    '2010s': ['POP', 'HIP HOP', 'ELECTRONIC', 'R&B'],
    '2020s': ['POP', 'HIP HOP', 'ELECTRONIC', 'R&B']
  };
  
  if (!components.genre && decadeGenreMap[decade]) {
    suggestions.push({
      type: 'genre',
      message: `Popular genres from the ${decade}:`,
      options: decadeGenreMap[decade].slice(0, 3)
    });
  }
  
  return suggestions;
};

/**
 * Remove duplicate suggestions
 * @param {Array} suggestions - Array of suggestions
 * @returns {Array} - Deduplicated suggestions
 */
const deduplicateSuggestions = (suggestions) => {
  const unique = [];
  const seen = new Set();
  
  suggestions.forEach(suggestion => {
    const key = `${suggestion.type}:${suggestion.message}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(suggestion);
    }
  });
  
  return unique;
};

/**
 * Generate creative ideas for a prompt based on components
 * @param {Object} components - Current prompt components
 * @returns {Array} - Creative ideas
 */
export const generateCreativeIdeas = (components) => {
  if (!components || !components.genre) return [];
  
  const ideas = [];
  const { genre, mood, decade } = components;
  
  // Genre fusion ideas
  const genreFusions = {
    'POP': ['Electronic Pop', 'Pop Rock', 'Pop with Hip Hop elements', 'Indie Pop'],
    'ROCK': ['Blues Rock', 'Funk Rock', 'Electronic Rock', 'Jazz-Rock Fusion'],
    'HIP HOP': ['Trap Soul', 'Jazz Rap', 'Electronic Hip Hop', 'Lo-fi Hip Hop'],
    'ELECTRONIC': ['Ambient Electronic', 'Glitch Hop', 'Industrial Electronic', 'Orchestral Electronic'],
    'JAZZ': ['Jazz Fusion', 'Electro-Swing', 'Nu-Jazz', 'Jazz with Hip Hop elements'],
    'CLASSICAL': ['Neoclassical with Electronic elements', 'Orchestral Rock', 'Cinematic Classical'],
    'AMBIENT': ['Dark Ambient', 'Ambient with Classical elements', 'Rhythmic Ambient']
  };
  
  if (genreFusions[genre]) {
    ideas.push({
      type: 'fusion',
      title: 'Genre Fusion',
      description: 'Try combining genres for a unique sound',
      examples: genreFusions[genre].slice(0, 2)
    });
  }
  
  // Unique instrumentation ideas
  const uniqueInstrumentations = {
    'POP': ['Add unusual percussion like kalimba or handpan', 'Incorporate orchestral elements', 'Use vintage synthesizers'],
    'ROCK': ['Add brass section', 'Incorporate electronic drums', 'Use unconventional guitar techniques'],
    'HIP HOP': ['Add live instruments', 'Incorporate world music samples', 'Use unusual vocal processing'],
    'ELECTRONIC': ['Add organic instruments', 'Incorporate field recordings', 'Use vintage analog gear'],
    'JAZZ': ['Add electronic elements', 'Incorporate world music influences', 'Use unconventional time signatures'],
    'CLASSICAL': ['Add subtle electronic elements', 'Incorporate non-western instruments', 'Use extended playing techniques']
  };
  
  if (uniqueInstrumentations[genre]) {
    ideas.push({
      type: 'instrumentation',
      title: 'Unique Instrumentation',
      description: 'Add unexpected elements to your composition',
      examples: uniqueInstrumentations[genre].slice(0, 2)
    });
  }
  
  // Mood contrast ideas
  if (mood) {
    const contrastingMoods = {
      'Happy': ['Add a wistful bridge section', 'Contrast with minor key in sections', 'Include bittersweet elements'],
      'Sad': ['Include a hopeful chorus', 'Add uplifting elements in the bridge', 'Contrast with major key sections'],
      'Energetic': ['Add a contemplative breakdown', 'Include ambient sections', 'Create tension with slower passages'],
      'Calm': ['Build to an emotional climax', 'Add subtle intensity in sections', 'Include a moment of tension'],
      'Dark': ['Add ethereal elements for contrast', 'Include a hopeful section', 'Contrast with bright sounds'],
      'Epic': ['Include intimate sections', 'Add minimal passages', 'Create moments of quiet beauty']
    };
    
    const normalizedMood = Object.keys(contrastingMoods).find(
      key => mood.toLowerCase().includes(key.toLowerCase())
    );
    
    if (normalizedMood && contrastingMoods[normalizedMood]) {
      ideas.push({
        type: 'contrast',
        title: 'Emotional Contrast',
        description: 'Create interest with contrasting emotions',
        examples: contrastingMoods[normalizedMood].slice(0, 2)
      });
    }
  }
  
  // Decade-inspired ideas
  if (decade) {
    const decadeIdeas = {
      '1950s': ['Combine 1950s rock and roll with modern production', 'Add contemporary electronic elements to 1950s jazz'],
      '1960s': ['Reimagine 1960s psychedelic rock with modern synths', 'Blend 1960s folk with contemporary production'],
      '1970s': ['Update 1970s funk with modern electronic elements', 'Mix 1970s progressive rock with contemporary sounds'],
      '1980s': ['Combine 1980s synth sounds with modern trap elements', 'Update 1980s power ballads with contemporary production'],
      '1990s': ['Reimagine 1990s grunge with electronic elements', 'Blend 1990s hip hop with modern production techniques'],
      '2000s': ['Update early 2000s pop punk with modern electronic elements', 'Mix 2000s R&B with contemporary production']
    };
    
    if (decadeIdeas[decade]) {
      ideas.push({
        type: 'timeFusion',
        title: 'Time Fusion',
        description: 'Blend elements from different eras',
        examples: decadeIdeas[decade]
      });
    }
  }
  
  // Add a wildcard idea
  const wildcards = [
    'Try an unexpected tempo change in the middle',
    'Add an unusual field recording or sound effect',
    'Incorporate sounds from nature',
    'Experiment with an unconventional structure',
    'Add an unexpected instrument solo',
    'Try unusual time signatures or rhythms',
    'Play with extreme dynamics (very quiet to very loud)',
    'Incorporate space and silence as musical elements',
    'Use an unexpected cultural influence'
  ];
  
  ideas.push({
    type: 'wildcard',
    title: 'Creative Wildcard',
    description: 'Try something unexpected and unique',
    examples: [wildcards[Math.floor(Math.random() * wildcards.length)]]
  });
  
  return ideas.slice(0, 3);
};