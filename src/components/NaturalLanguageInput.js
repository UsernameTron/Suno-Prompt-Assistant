import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  Heading,
  Text,
  Tag,
  HStack,
  List,
  ListItem,
  ListIcon,
  Collapse,
  Badge,
  Flex,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { MdCheckCircle, MdInfoOutline, MdMusicNote } from 'react-icons/md';
import { extractComponents } from '../utils/nlpProcessor';

const NaturalLanguageInput = ({ onSubmit }) => {
  const [input, setInput] = useState('');
  const [detectedComponents, setDetectedComponents] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const textareaRef = useRef(null);
  const { isOpen, onToggle } = useDisclosure();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const tagBg = useColorModeValue('gray.100', 'gray.700');
  const hintBg = useColorModeValue('blue.50', 'blue.900');
  const hintBorder = useColorModeValue('blue.100', 'blue.800');

  useEffect(() => {
    // Process input after user stops typing for a moment
    if (input.trim()) {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      setTypingTimeout(setTimeout(() => {
        processInputForComponents();
      }, 800)); // Wait 800ms after typing stops
    } else {
      setDetectedComponents(null);
    }
    
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [input]);

  const processInputForComponents = () => {
    setIsProcessing(true);
    
    try {
      // Extract components from the natural language input
      const components = extractComponents(input);
      setDetectedComponents(components);
    } catch (error) {
      console.error('Error processing input:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      // Process one final time to ensure all components are detected
      const components = extractComponents(input.trim());
      
      // Pass both the raw input and the extracted components
      onSubmit(input.trim(), components);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const renderComponentsPreview = () => {
    if (!detectedComponents) return null;
    
    const { genre, mood, tempo, instruments, decade } = detectedComponents;
    const hasComponents = genre || mood || tempo || instruments.length > 0 || decade;
    
    if (!hasComponents) {
      return (
        <Text fontSize="sm" fontStyle="italic" color="gray.500" mt={2}>
          No specific musical elements detected yet. Try adding more details like genre, mood, or instruments.
        </Text>
      );
    }
    
    return (
      <Box mt={3}>
        <Text fontSize="sm" fontWeight="medium" mb={2}>
          Detected elements:
        </Text>
        <HStack spacing={2} flexWrap="wrap">
          {genre && (
            <Tag size="md" colorScheme="purple" bg={tagBg}>
              Genre: {genre}
            </Tag>
          )}
          {mood && (
            <Tag size="md" colorScheme="blue" bg={tagBg}>
              Mood: {mood}
            </Tag>
          )}
          {tempo && (
            <Tag size="md" colorScheme="green" bg={tagBg}>
              Tempo: {tempo}
            </Tag>
          )}
          {decade && (
            <Tag size="md" colorScheme="orange" bg={tagBg}>
              Era: {decade}
            </Tag>
          )}
          {instruments.length > 0 && (
            <Tag size="md" colorScheme="red" bg={tagBg}>
              Instruments: {instruments.length}
            </Tag>
          )}
        </HStack>
        
        <Collapse in={isOpen} animateOpacity>
          <List spacing={1} mt={3} fontSize="sm">
            {genre && (
              <ListItem>
                <ListIcon as={MdMusicNote} color="purple.500" />
                <b>Genre:</b> {genre}
              </ListItem>
            )}
            {mood && (
              <ListItem>
                <ListIcon as={MdMusicNote} color="blue.500" />
                <b>Mood:</b> {mood}
              </ListItem>
            )}
            {tempo && (
              <ListItem>
                <ListIcon as={MdMusicNote} color="green.500" />
                <b>Tempo:</b> {tempo}
              </ListItem>
            )}
            {decade && (
              <ListItem>
                <ListIcon as={MdMusicNote} color="orange.500" />
                <b>Era:</b> {decade}
              </ListItem>
            )}
            {instruments.length > 0 && (
              <ListItem>
                <ListIcon as={MdMusicNote} color="red.500" />
                <b>Instruments:</b> {instruments.join(', ')}
              </ListItem>
            )}
          </List>
        </Collapse>
        
        {detectedComponents && (
          <Button 
            variant="link" 
            size="sm" 
            onClick={onToggle} 
            mt={2}
            color="gray.500"
          >
            {isOpen ? "Show less" : "Show details"}
          </Button>
        )}
      </Box>
    );
  };

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <VStack spacing={4} align="stretch">
        <Heading as="h2" size="md">
          Describe Your Music
        </Heading>
        
        <Text fontSize="sm" color="gray.600">
          Enter a natural language description of the music you want to create. 
          Our tool will help format it into an optimized Suno AI prompt.
        </Text>
        
        <Box 
          p={3}
          bg={hintBg}
          borderRadius="md"
          borderWidth="1px"
          borderColor={hintBorder}
        >
          <Flex align="center" mb={1}>
            <MdInfoOutline size="18px" />
            <Text ml={2} fontWeight="medium" fontSize="sm">
              Tips for better results:
            </Text>
          </Flex>
          <Text fontSize="xs">
            Mention genre, mood, decade, tempo, and instruments. For example: 
            "I want an energetic 80s synthpop track with pulsing synthesizers and electronic drums."
          </Text>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel htmlFor="music-description">
              Music Description
            </FormLabel>
            <Textarea
              ref={textareaRef}
              id="music-description"
              value={input}
              onChange={handleInputChange}
              placeholder="E.g., I want an upbeat 80s pop song with synth and electric guitar, something energetic and catchy"
              rows={4}
              resize="vertical"
              mb={2}
            />
            
            {renderComponentsPreview()}
            
            <Flex justify="space-between" mt={4}>
              <Text fontSize="xs" color="gray.500" alignSelf="center">
                {input.length > 0 && (
                  <>
                    {input.length} characters 
                    {isProcessing && " • Processing..."}
                  </>
                )}
              </Text>
              <Button 
                type="submit" 
                isDisabled={!input.trim() || isProcessing}
                colorScheme="brand"
                leftIcon={<MdCheckCircle />}
              >
                Process Description
              </Button>
            </Flex>
          </FormControl>
        </form>
      </VStack>
    </Box>
  );
};

export default NaturalLanguageInput;