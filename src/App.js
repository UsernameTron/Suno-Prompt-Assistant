import React, { useState } from 'react';
import { Box, Container, VStack, useColorModeValue } from '@chakra-ui/react';
import Header from './components/Header';
import Footer from './components/Footer';
import NaturalLanguageInput from './components/NaturalLanguageInput';
import PromptBuilder from './components/PromptBuilder';
import PromptResult from './components/PromptResult';

function App() {
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  const [promptComponents, setPromptComponents] = useState({
    genre: '',
    mood: '',
    tempo: '',
    instruments: [],
    decade: '',
    description: '',
  });
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const handleNaturalLanguageSubmit = (text) => {
    setNaturalLanguageInput(text);
    // In a future phase, we'll add logic to extract components from the text
    // For now just set it as a description
    setPromptComponents({
      ...promptComponents,
      description: text
    });
  };

  const handlePromptComponentsChange = (newComponents) => {
    setPromptComponents(newComponents);
    // Generate the formatted prompt based on components
    generateFormattedPrompt(newComponents);
  };

  const generateFormattedPrompt = (components) => {
    let promptParts = [];
    
    // Add genre in ALL CAPS if provided
    if (components.genre) {
      promptParts.push(components.genre.toUpperCase());
    }
    
    // Add mood with Title Case if provided
    if (components.mood) {
      promptParts.push(titleCase(components.mood));
    }
    
    // Add tempo if provided
    if (components.tempo) {
      promptParts.push(components.tempo);
    }
    
    // Add instruments in lowercase if provided
    if (components.instruments && components.instruments.length > 0) {
      promptParts.push(components.instruments.join(', ').toLowerCase());
    }
    
    // Add decade if provided
    if (components.decade) {
      promptParts.push(components.decade);
    }
    
    // Add description if provided
    if (components.description) {
      promptParts.push(components.description);
    }
    
    // Combine all parts with proper formatting
    const formattedPrompt = promptParts.join(', ');
    setGeneratedPrompt(formattedPrompt);
  };
  
  // Helper function to convert string to Title Case
  const titleCase = (str) => {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  return (
    <Box bg={bgColor} minH="100vh">
      <Header />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <NaturalLanguageInput onSubmit={handleNaturalLanguageSubmit} />
          <PromptBuilder 
            components={promptComponents}
            onChange={handlePromptComponentsChange}
          />
          <PromptResult prompt={generatedPrompt} />
        </VStack>
      </Container>
      <Footer />
    </Box>
  );
}

export default App;