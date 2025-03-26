import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  VStack,
  HStack,
  Flex,
  Icon,
  Badge,
  Progress,
  Divider,
  useColorMode,
  Button,
} from '@chakra-ui/react';
import { 
  MdInsights, 
  MdMusicNote, 
  MdTrendingUp, 
  MdHistory, 
  MdStar, 
  MdAutoAwesome 
} from 'react-icons/md';
import { getHistory, getFavorites } from '../utils/historyManager';

const UserInsights = () => {
  const [stats, setStats] = useState(null);
  const [genreDistribution, setGenreDistribution] = useState([]);
  const [moodDistribution, setMoodDistribution] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  
  const { colorMode } = useColorMode();
  const bgColor = colorMode === 'light' ? 'white' : 'gray.800';
  const borderColor = colorMode === 'light' ? 'gray.200' : 'gray.700';
  const cardBg = colorMode === 'light' ? 'gray.50' : 'gray.700';
  
  useEffect(() => {
    // Load data and calculate statistics
    calculateStats();
  }, []);
  
  const calculateStats = () => {
    try {
      const history = getHistory();
      const favorites = getFavorites();
      
      // Basic statistics
      const totalPrompts = history.length;
      const totalFavorites = favorites.length;
      const lastActivity = history.length > 0 ? new Date(history[0].createdAt) : null;
      
      // Calculate genre and mood distribution
      const genres = {};
      const moods = {};
      
      history.forEach(item => {
        const { components } = item;
        if (!components) return;
        
        // Track genres
        if (components.genre) {
          const genre = components.genre.toUpperCase();
          genres[genre] = (genres[genre] || 0) + 1;
        }
        
        // Track moods
        if (components.mood) {
          const mood = components.mood;
          moods[mood] = (moods[mood] || 0) + 1;
        }
      });
      
      // Sort genres and moods by frequency
      const sortedGenres = Object.entries(genres)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));
      
      const sortedMoods = Object.entries(moods)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));
      
      // Calculate unique values
      const uniqueGenres = Object.keys(genres).length;
      const uniqueMoods = Object.keys(moods).length;
      
      // Generate personalized suggestions
      const generatedSuggestions = generatePersonalizedSuggestions({
        genres: sortedGenres,
        moods: sortedMoods,
        totalPrompts,
        uniqueGenres,
        lastActivity
      });
      
      // Set all calculated data
      setStats({
        totalPrompts,
        totalFavorites,
        uniqueGenres,
        uniqueMoods,
        lastActivity
      });
      
      setGenreDistribution(sortedGenres);
      setMoodDistribution(sortedMoods);
      setSuggestions(generatedSuggestions);
      
    } catch (error) {
      console.error('Error calculating insights:', error);
    }
  };
  
  const generatePersonalizedSuggestions = (data) => {
    const suggestions = [];
    const { genres, moods, totalPrompts, uniqueGenres, lastActivity } = data;
    
    // Suggest exploring more genres if they're focused on just a few
    if (uniqueGenres <= 2 && totalPrompts >= 5) {
      const topGenre = genres[0]?.name;
      
      if (topGenre) {
        let suggestedGenres;
        
        switch (topGenre) {
          case 'POP':
            suggestedGenres = ['ELECTRONIC', 'R&B'];
            break;
          case 'ROCK':
            suggestedGenres = ['METAL', 'FOLK'];
            break;
          case 'HIP HOP':
            suggestedGenres = ['R&B', 'ELECTRONIC'];
            break;
          case 'ELECTRONIC':
            suggestedGenres = ['AMBIENT', 'POP'];
            break;
          case 'JAZZ':
            suggestedGenres = ['BLUES', 'CLASSICAL'];
            break;
          default:
            suggestedGenres = ['JAZZ', 'ELECTRONIC'];
        }
        
        suggestions.push({
          type: 'genre-diversity',
          title: 'Explore New Genres',
          text: `You've been creating a lot of ${topGenre}. Try exploring ${suggestedGenres.join(' or ')} for fresh inspiration.`
        });
      }
    }
    
    // Suggest trying templates
    if (totalPrompts >= 3) {
      suggestions.push({
        type: 'templates',
        title: 'Try Templates',
        text: 'Try using our template gallery to discover new music styles and combinations.'
      });
    }
    
    // Suggest saving favorites if none saved
    if (totalPrompts >= 5 && data.totalFavorites === 0) {
      suggestions.push({
        type: 'favorites',
        title: 'Save Your Favorites',
        text: 'Star your favorite prompts to build a collection of go-to starting points.'
      });
    }
    
    return suggestions;
  };
  
  const formatDate = (date) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const today = now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    
    if (date.toDateString() === today) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  };
  
  // If no data, show loading state
  if (!stats) {
    return (
      <Box>
        <Heading size="md" mb={4}>
          Analyzing your music creation patterns...
        </Heading>
        <Progress isIndeterminate colorScheme="brand" />
      </Box>
    );
  }
  
  // If no history, show empty state
  if (stats.totalPrompts === 0) {
    return (
      <Box>
        <Flex align="center" mb={4}>
          <Icon as={MdInsights} color="brand.500" mr={2} />
          <Heading size="md">Your Music Creation Insights</Heading>
        </Flex>
        
        <Box p={6} bg={cardBg} borderRadius="lg" textAlign="center">
          <Icon as={MdMusicNote} boxSize={10} color="gray.400" mb={3} />
          <Heading size="sm" mb={2}>No data yet</Heading>
          <Text color="gray.500">
            Start creating music prompts to see insights about your music creation patterns.
          </Text>
        </Box>
      </Box>
    );
  }
  
  return (
    <Box>
      <Flex align="center" mb={4}>
        <Icon as={MdInsights} color="brand.500" mr={2} />
        <Heading size="md">Your Music Creation Insights</Heading>
      </Flex>
      
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={6}>
        <Stat bg={cardBg} p={4} borderRadius="lg">
          <StatLabel>Created Prompts</StatLabel>
          <StatNumber>{stats.totalPrompts}</StatNumber>
          <StatHelpText>
            Last activity: {formatDate(stats.lastActivity)}
          </StatHelpText>
        </Stat>
        
        <Stat bg={cardBg} p={4} borderRadius="lg">
          <StatLabel>Favorite Prompts</StatLabel>
          <StatNumber>{stats.totalFavorites}</StatNumber>
          <StatHelpText>
            Saved for reuse
          </StatHelpText>
        </Stat>
        
        <Stat bg={cardBg} p={4} borderRadius="lg">
          <StatLabel>Unique Genres</StatLabel>
          <StatNumber>{stats.uniqueGenres}</StatNumber>
          <StatHelpText>
            Different music styles
          </StatHelpText>
        </Stat>
      </SimpleGrid>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
        <Box bg={bgColor} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
          <Heading size="sm" mb={3}>
            <Flex align="center">
              <Icon as={MdTrendingUp} mr={2} />
              Genre Distribution
            </Flex>
          </Heading>
          
          <VStack spacing={3} align="stretch">
            {genreDistribution.map((genre, index) => (
              <Box key={index}>
                <Flex justify="space-between" mb={1}>
                  <Text fontSize="sm">{genre.name}</Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {Math.round((genre.count / stats.totalPrompts) * 100)}%
                  </Text>
                </Flex>
                <Progress 
                  value={(genre.count / stats.totalPrompts) * 100} 
                  colorScheme="purple" 
                  size="sm" 
                  borderRadius="full" 
                />
              </Box>
            ))}
            
            {genreDistribution.length === 0 && (
              <Text fontSize="sm" color="gray.500">
                No genre data available
              </Text>
            )}
          </VStack>
        </Box>
        
        <Box bg={bgColor} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
          <Heading size="sm" mb={3}>
            <Flex align="center">
              <Icon as={MdTrendingUp} mr={2} />
              Mood Distribution
            </Flex>
          </Heading>
          
          <VStack spacing={3} align="stretch">
            {moodDistribution.map((mood, index) => (
              <Box key={index}>
                <Flex justify="space-between" mb={1}>
                  <Text fontSize="sm">{mood.name}</Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {Math.round((mood.count / stats.totalPrompts) * 100)}%
                  </Text>
                </Flex>
                <Progress 
                  value={(mood.count / stats.totalPrompts) * 100} 
                  colorScheme="blue" 
                  size="sm" 
                  borderRadius="full" 
                />
              </Box>
            ))}
            
            {moodDistribution.length === 0 && (
              <Text fontSize="sm" color="gray.500">
                No mood data available
              </Text>
            )}
          </VStack>
        </Box>
      </SimpleGrid>
      
      {suggestions.length > 0 && (
        <Box bg={bgColor} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor} mb={6}>
          <Heading size="sm" mb={3}>
            <Flex align="center">
              <Icon as={MdAutoAwesome} mr={2} />
              Personalized Suggestions
            </Flex>
          </Heading>
          
          <VStack spacing={3} align="stretch">
            {suggestions.map((suggestion, index) => (
              <Box key={index} p={3} bg={cardBg} borderRadius="md">
                <Flex align="center" mb={1}>
                  <Icon 
                    as={
                      suggestion.type === 'genre-diversity' ? MdMusicNote :
                      suggestion.type === 'templates' ? MdCollections :
                      suggestion.type === 'favorites' ? MdStar :
                      MdAutoAwesome
                    } 
                    mr={2}
                    color="brand.500"
                  />
                  <Text fontSize="sm" fontWeight="medium">
                    {suggestion.title}
                  </Text>
                </Flex>
                <Text fontSize="xs">{suggestion.text}</Text>
              </Box>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default UserInsights;