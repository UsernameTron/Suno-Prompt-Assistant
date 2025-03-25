import React, { useState, useEffect } from 'react';
import { Box, Container, VStack, useColorModeValue, useToast } from '@chakra-ui/react';
import Header from './components/Header';
import Footer from './components/Footer';
import NaturalLanguageInput from './components/NaturalLanguageInput';
import PromptBuilder from './components/PromptBuilder';
import PromptResult from './components/PromptResult';
import { extractComponents, optimizePrompt } from './utils/nlpProcessor';
import { saveToHistory } from './utils/historyManager';

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
  const [isProcessing, setIsProcessing] = useState(false);
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const toast = useToast();
  
  // Save prompt to history whenever it changes
  useEffect(() => {
    if (generatedPrompt) {
      saveToHistory({
        prompt: generatedPrompt,
        components: promptComponents
      });
    }
  }, [generatedPrompt]);

  const handleNaturalLanguageSubmit = (text, extractedComponents) => {
    setIsProcessing(true);
    setNaturalLanguageInput(text);
    
    try {
      // Use the extracted components from NLP or process again if not provided
      const components = extractedComponents || extractComponents(text);
      
      // Update the prompt components state with the extracted values
      setPromptComponents({
        genre: components.genre || '',
        mood: components.mood || '',
        tempo: components.tempo || '',
        instruments: components.instruments || [],
        decade: components.decade || '',
        description: components.description || text
      });
      
      // Generate formatted prompt from the extracted components
      const optimizedPrompt = optimizePrompt(components);
      setGeneratedPrompt(optimizedPrompt);
      
      // Show a success toast
      toast({
        title: "Processing complete",
        description: "Your description has been analyzed and converted to a prompt",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top"
      });
    } catch (error) {
      console.error("Error processing natural language input:", error);
      
      // Show an error toast
      toast({
        title: "Processing error",
        description: "There was an error processing your description",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top"
      });
      
      // Fallback to setting as description only
      setPromptComponents({
        ...promptComponents,
        description: text
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePromptComponentsChange = (newComponents) => {
    setPromptComponents(newComponents);
    
    // Use the optimizePrompt function from nlpProcessor
    try {
      const optimizedPrompt = optimizePrompt(newComponents);
      setGeneratedPrompt(optimizedPrompt);
    } catch (error) {
      console.error("Error generating formatted prompt:", error);
      // Fallback to simple concatenation if optimization fails
      const fallbackPrompt = generateSimplePrompt(newComponents);
      setGeneratedPrompt(fallbackPrompt);
    }
  };

  // Simple fallback prompt generator if optimization fails
  const generateSimplePrompt = (components) => {
    const { genre, mood, tempo, instruments, decade, description } = components;
    const parts = [];
    
    if (genre) parts.push(genre.toUpperCase());
    if (mood) parts.push(titleCase(mood));
    if (tempo) parts.push(tempo);
    if (instruments && instruments.length > 0) parts.push(instruments.join(', ').toLowerCase());
    if (decade) parts.push(decade);
    if (description) parts.push(description);
    
    return parts.join(', ');
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
          <NaturalLanguageInput 
            onSubmit={handleNaturalLanguageSubmit}
            isProcessing={isProcessing}
          />
          <PromptBuilder 
            components={promptComponents}
            onChange={handlePromptComponentsChange}
          />
          <PromptResult 
            prompt={generatedPrompt}
            fullComponents={promptComponents}
          />
        </VStack>
      </Container>
      <Footer />
    </Box>
  );
}

export default App;