import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

const NaturalLanguageInput = ({ onSubmit }) => {
  const [input, setInput] = useState('');
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim());
    }
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
        
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel htmlFor="music-description">
              Music Description
            </FormLabel>
            <Textarea
              id="music-description"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g., I want an upbeat 80s pop song with synth and electric guitar, something energetic and catchy"
              rows={4}
              resize="vertical"
              mb={4}
            />
            <Button type="submit" isDisabled={!input.trim()}>
              Process Description
            </Button>
          </FormControl>
        </form>
      </VStack>
    </Box>
  );
};

export default NaturalLanguageInput;