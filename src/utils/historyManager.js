/**
 * History and favorites manager for Suno AI prompts
 * Handles storing, retrieving, and managing user prompt history and favorites
 */

// Local storage keys
const HISTORY_KEY = 'suno_prompt_history';
const FAVORITES_KEY = 'suno_favorite_prompts';

/**
 * Save a prompt to history
 * @param {Object} promptData - Prompt data to save
 * @param {string} promptData.prompt - The formatted prompt text
 * @param {Object} promptData.components - The prompt components
 * @returns {Object} - The saved prompt with generated ID
 */
export const saveToHistory = (promptData) => {
  if (!promptData || !promptData.prompt) {
    return null;
  }

  try {
    // Get existing history
    const history = getHistory();
    
    // Create new history entry with timestamp and ID
    const newEntry = {
      id: generateId(),
      prompt: promptData.prompt,
      components: promptData.components || {},
      createdAt: new Date().toISOString()
    };
    
    // Add to beginning of history
    history.unshift(newEntry);
    
    // Limit history to last 50 items
    const limitedHistory = history.slice(0, 50);
    
    // Save back to local storage
    localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
    
    return newEntry;
  } catch (error) {
    console.error('Error saving to history:', error);
    return null;
  }
};

/**
 * Get prompt history
 * @param {number} limit - Optional limit on number of items to return
 * @returns {Array} - Array of prompt history items
 */
export const getHistory = (limit) => {
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    return limit ? history.slice(0, limit) : history;
  } catch (error) {
    console.error('Error retrieving history:', error);
    return [];
  }
};

/**
 * Get a specific history item by ID
 * @param {string} id - The ID of the history item to retrieve
 * @returns {Object|null} - The history item or null if not found
 */
export const getHistoryItem = (id) => {
  if (!id) return null;
  
  try {
    const history = getHistory();
    return history.find(item => item.id === id) || null;
  } catch (error) {
    console.error('Error retrieving history item:', error);
    return null;
  }
};

/**
 * Clear all prompt history
 * @returns {boolean} - Success indicator
 */
export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing history:', error);
    return false;
  }
};

/**
 * Add a prompt to favorites
 * @param {Object} promptData - Prompt data to favorite
 * @param {string} promptData.prompt - The formatted prompt text
 * @param {Object} promptData.components - The prompt components
 * @returns {Object} - The saved favorite with generated ID
 */
export const addToFavorites = (promptData) => {
  if (!promptData || !promptData.prompt) {
    return null;
  }

  try {
    // Get existing favorites
    const favorites = getFavorites();
    
    // Check if already in favorites to avoid duplicates
    const isDuplicate = favorites.some(fav => fav.prompt === promptData.prompt);
    if (isDuplicate) {
      return favorites.find(fav => fav.prompt === promptData.prompt);
    }
    
    // Create new favorite entry with timestamp and ID
    const newFavorite = {
      id: generateId(),
      prompt: promptData.prompt,
      components: promptData.components || {},
      createdAt: new Date().toISOString()
    };
    
    // Add to favorites
    favorites.unshift(newFavorite);
    
    // Save back to local storage
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    
    return newFavorite;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return null;
  }
};

/**
 * Remove a prompt from favorites
 * @param {string} id - ID of the favorite to remove
 * @returns {boolean} - Success indicator
 */
export const removeFromFavorites = (id) => {
  if (!id) return false;

  try {
    // Get existing favorites
    const favorites = getFavorites();
    
    // Filter out the favorite to remove
    const filteredFavorites = favorites.filter(fav => fav.id !== id);
    
    // Check if anything was removed
    if (filteredFavorites.length === favorites.length) {
      return false; // Nothing was removed
    }
    
    // Save back to local storage
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filteredFavorites));
    
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
};

/**
 * Get all favorite prompts
 * @returns {Array} - Array of favorite prompt items
 */
export const getFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch (error) {
    console.error('Error retrieving favorites:', error);
    return [];
  }
};

/**
 * Check if a prompt is in favorites
 * @param {string} prompt - The prompt text to check
 * @returns {boolean} - Whether the prompt is favorited
 */
export const isInFavorites = (prompt) => {
  if (!prompt) return false;
  
  try {
    const favorites = getFavorites();
    return favorites.some(fav => fav.prompt === prompt);
  } catch (error) {
    console.error('Error checking favorites:', error);
    return false;
  }
};

/**
 * Update a favorite prompt
 * @param {string} id - ID of the favorite to update
 * @param {Object} updatedData - Updated prompt data
 * @returns {Object|null} - Updated favorite object or null
 */
export const updateFavorite = (id, updatedData) => {
  if (!id || !updatedData) return null;

  try {
    // Get existing favorites
    const favorites = getFavorites();
    
    // Find the favorite to update
    const index = favorites.findIndex(fav => fav.id === id);
    if (index === -1) return null;
    
    // Update the favorite (keeping the original ID and creation date)
    const updatedFavorite = {
      ...favorites[index],
      prompt: updatedData.prompt || favorites[index].prompt,
      components: updatedData.components || favorites[index].components,
      updatedAt: new Date().toISOString()
    };
    
    favorites[index] = updatedFavorite;
    
    // Save back to local storage
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    
    return updatedFavorite;
  } catch (error) {
    console.error('Error updating favorite:', error);
    return null;
  }
};

/**
 * Generate a unique ID for history/favorite items
 * @returns {string} - Unique ID
 */
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

export default {
  saveToHistory,
  getHistory,
  getHistoryItem,
  clearHistory,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  isInFavorites,
  updateFavorite
};