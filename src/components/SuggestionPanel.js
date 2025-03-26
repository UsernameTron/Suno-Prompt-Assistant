import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Flex,
  Divider,
  Tag,
  Icon,
  useColorMode,
  SimpleGrid,
  Collapse,
  Badge,
} from '@chakra-ui/react';
import { MdAutoAwesome, MdAdd, MdLightbulb, MdPlayArrow } from 'react-icons/md';
import { generateSuggestions, generateCreativeIdeas } from '../utils/suggestionsEngine';

const SuggestionPanel = ({ components, onApplySuggestion, onUseTemplate, isOpen = true }) => {
  const { suggestions, recommendedTemplates } = generateSuggestions(components);
  const creativeIdeas = generateCreativeIdeas(components);
  
  const { colorMode } = useColorMode();
  const bgColor = colorMode === 'light' ? 'white' : 'gray.800';
  const borderColor = colorMode === 'light' ? 'gray.200' : 'gray.700';
  const suggestionBg = colorMode === 'light' ? 'purple.50' : 'purple.900';
  const suggestionBorder = colorMode === 'light' ? 'purple.100' : 'purple.800';
  const ideaBg = colorMode === 'light' ? 'blue.50' : 'blue.900';
  const ideaBorder = colorMode === 'light' ? 'blue.100' : 'blue.800';
  
  const getTypeIcon = (type) => {
    switch (type) {
      case 'instruments':
        return '🎸';
      case 'tempo':
        return '⏱️';
      case 'genre':
        return '🎵';
      case 'mood':
        return '😊';
      case 'structure':
        return '🏗️';
      case 'descriptors':
        return '📝';
      default:
        return '💡';
    }
  };
  
  const handleApplySuggestion = (type, value) => {
    if (onApplySuggestion) {
      // Create a suggestion object with the type as the key and value as the value
      const suggestion = { [type]: value };
      onApplySuggestion(suggestion);
    }
  };
  
  const renderSuggestions = () => {
    if (suggestions.length === 0) {
      return (
        <Box p={3} bg={suggestionBg} borderRadius="md" borderWidth="1px" borderColor={suggestionBorder}>
          <Text fontSize="sm">
            No additional suggestions available. Your prompt is looking good!
          </Text>
        </Box>
      );
    }
    
    return (
      <VStack spacing={3} align="stretch">
        {suggestions.map((suggestion, index) => (
          <Box 
            key={index} 
            p={3} 
            bg={suggestionBg} 
            borderRadius="md" 
            borderWidth="1px" 
            borderColor={suggestionBorder}
          >
            <Flex justify="space-between" align="flex-start">
              <HStack spacing={2} align="center" mb={2}>
                <Text fontSize="lg">{getTypeIcon(suggestion.type)}</Text>
                <Text fontSize="sm" fontWeight="medium">
                  {suggestion.message}
                </Text>
              </HStack>
            </Flex>
            
            <Flex mt={2} gap={2} wrap="wrap">
              {suggestion.options && suggestion.options.map((option, optIdx) => (
                <Button
                  key={optIdx}
                  size="xs"
                  variant="outline"
                  colorScheme="purple"
                  leftIcon={<MdAdd />}
                  onClick={() => handleApplySuggestion(suggestion.type, option)}
                >
                  {option}
                </Button>
              ))}
            </Flex>
          </Box>
        ))}
      </VStack>
    );
  };
  
  const renderCreativeIdeas = () => {
    if (creativeIdeas.length === 0) return null;
    
    return (
      <VStack spacing={3} align="stretch" mt={5}>
        <Heading size="sm">Creative Ideas 💡</Heading>
        
        {creativeIdeas.map((idea, index) => (
          <Box 
            key={index} 
            p={3} 
            bg={ideaBg} 
            borderRadius="md" 
            borderWidth="1px" 
            borderColor={ideaBorder}
          >
            <Text fontSize="sm" fontWeight="medium" mb={1}>
              {idea.title}
            </Text>
            
            <Text fontSize="xs" mb={2}>
              {idea.description}
            </Text>
            
            <VStack align="start" spacing={1}>
              {idea.examples.map((example, exIdx) => (
                <Text key={exIdx} fontSize="xs">• {example}</Text>
              ))}
            </VStack>
          </Box>
        ))}
      </VStack>
    );
  };
  
  const renderRecommendedTemplates = () => {
    if (!recommendedTemplates || recommendedTemplates.length === 0) return null;
    
    return (
      <VStack spacing={3} align="stretch" mt={5}>
        <Heading size="sm">Recommended Templates</Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
          {recommendedTemplates.map((template) => (
            <Box
              key={template.id}
              p={3}
              borderRadius="md"
              borderWidth="1px"
              borderColor={borderColor}
              bg={bgColor}
            >
              <Flex justify="space-between" mb={1}>
                <Text fontSize="sm" fontWeight="medium">
                  {template.name}
                </Text>
                <Badge colorScheme="purple">
                  {template.components.genre}
                </Badge>
              </Flex>
              
              <Text fontSize="xs" mb={2} noOfLines={1}>
                {template.description}
              </Text>
              
              <Button
                size="xs"
                colorScheme="brand"
                leftIcon={<MdPlayArrow />}
                onClick={() => onUseTemplate && onUseTemplate(template)}
                width="100%"
              >
                Use Template
              </Button>
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
    );
  };
  
  return (
    <Collapse in={isOpen} animateOpacity>
      <Box 
        p={4} 
        borderWidth="1px" 
        borderColor={borderColor} 
        borderRadius="lg"
        bg={bgColor}
        mt={4}
      >
        <Flex align="center" mb={4}>
          <Icon as={MdAutoAwesome} color="brand.500" mr={2} />
          <Heading size="md">AI Suggestions</Heading>
        </Flex>
        
        {renderSuggestions()}
        {renderRecommendedTemplates()}
        {renderCreativeIdeas()}
      </Box>
    </Collapse>
  );
};

export default SuggestionPanel;