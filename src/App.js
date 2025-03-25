import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  VStack, 
  HStack, 
  Grid, 
  GridItem, 
  Button, 
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue, 
  useToast,
  useDisclosure,
  useBreakpointValue
} from '@chakra-ui/react';
import { MdDashboard, MdExpandMore, MdExpandLess } from 'react-icons/md';
import Header from './components/Header';
import Footer from './components/Footer';
import NaturalLanguageInput from './components/NaturalLanguageInput';
import PromptBuilder from './components/PromptBuilder';
import PromptResult from './components/PromptResult';
import AudioPreview from './components/AudioPreview';
import Dashboard from './components/Dashboard';
import SuggestionPanel from './components/SuggestionPanel';
import { extractComponents, optimizePrompt } from './utils/nlpProcessor';
import { saveToHistory, getHistoryItem } from './utils/historyManager';

function App() {
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  const [promptComponents, setPromptComponents] = useState({
    genre: '',
    mood: '',
    tempo: '',
    instruments: [],
    decade: '',
    region: '',
    vocals: '',
    structure: '',
    descriptors: '',
    description: '',
  });
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, lg: false });
  
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
        region: components.region || '',
        vocals: components.vocals || '',
        structure: components.structure || '',
        descriptors: components.descriptors || '',
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
    const { 
      genre, mood, tempo, instruments, decade, 
      region, vocals, structure, descriptors, description 
    } = components;
    const parts = [];
    
    if (genre) parts.push(genre.toUpperCase());
    if (mood) parts.push(titleCase(mood));
    if (tempo) parts.push(tempo);
    if (instruments && instruments.length > 0) parts.push(instruments.join(', ').toLowerCase());
    if (decade) parts.push(decade);
    if (region) parts.push(region);
    if (vocals) parts.push(vocals);
    if (structure) parts.push(structure);
    if (descriptors) parts.push(descriptors);
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
  
  // Toggle dashboard visibility
  const toggleDashboard = () => {
    setShowDashboard(!showDashboard);
    if (isMobile && !showDashboard) {
      onOpen();
    }
  };
  
  // Handle template selection from the template gallery
  const handleUseTemplate = (template) => {
    if (template && template.components) {
      // If on mobile, close the drawer
      if (isMobile) {
        onClose();
      }
      
      // Update prompt components with template values
      const newComponents = {
        ...promptComponents,
        ...template.components
      };
      
      setPromptComponents(newComponents);
      
      // Generate the prompt using the template components
      try {
        const optimizedPrompt = optimizePrompt(newComponents);
        setGeneratedPrompt(optimizedPrompt);
        
        toast({
          title: "Template Applied",
          description: `Applied template: ${template.name}`,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top"
        });
      } catch (error) {
        console.error("Error generating prompt from template:", error);
        
        // Fallback to simple concat if optimization fails
        const fallbackPrompt = generateSimplePrompt(newComponents);
        setGeneratedPrompt(fallbackPrompt);
      }
    }
  };
  
  // Handle applying a suggestion to the current prompt
  const handleApplySuggestion = (suggestion) => {
    if (suggestion) {
      // If on mobile, close the drawer
      if (isMobile) {
        onClose();
      }
      
      // Update relevant prompt components with suggestion values
      const newComponents = {
        ...promptComponents,
        ...suggestion
      };
      
      setPromptComponents(newComponents);
      
      // Generate the prompt using the updated components
      try {
        const optimizedPrompt = optimizePrompt(newComponents);
        setGeneratedPrompt(optimizedPrompt);
        
        toast({
          title: "Suggestion Applied",
          description: "The suggestion has been applied to your prompt",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top"
        });
      } catch (error) {
        console.error("Error applying suggestion:", error);
        
        // Fallback to simple concat if optimization fails
        const fallbackPrompt = generateSimplePrompt(newComponents);
        setGeneratedPrompt(fallbackPrompt);
      }
    }
  };
  
  // Handle using a prompt from history
  const handleUsePrompt = (historyId) => {
    if (historyId) {
      // If on mobile, close the drawer
      if (isMobile) {
        onClose();
      }
      
      // Get the prompt from history
      const historyItem = getHistoryItem(historyId);
      
      if (historyItem) {
        // Update prompt components and generated prompt
        setPromptComponents(historyItem.components);
        setGeneratedPrompt(historyItem.prompt);
        
        toast({
          title: "History Item Loaded",
          description: "Loaded prompt from your history",
          status: "info",
          duration: 3000,
          isClosable: true,
          position: "top"
        });
      }
    }
  };

  return (
    <Box bg={bgColor} minH="100vh">
      <Header />
      <Container maxW="container.xl" py={8}>
        {/* Dashboard toggle button */}
        <Button
          leftIcon={<Icon as={showDashboard ? MdExpandLess : MdExpandMore} />}
          rightIcon={<Icon as={MdDashboard} />}
          size="sm"
          colorScheme="brand"
          variant="outline"
          mb={4}
          onClick={toggleDashboard}
        >
          {showDashboard ? "Hide Dashboard" : "Show Dashboard"}
        </Button>
        
        <Grid templateColumns={{ base: "1fr", lg: showDashboard ? "1fr 350px" : "1fr" }} gap={6}>
          <GridItem>
            <VStack spacing={8} align="stretch">
              <NaturalLanguageInput 
                onSubmit={handleNaturalLanguageSubmit}
                isProcessing={isProcessing}
              />
              <PromptBuilder 
                components={promptComponents}
                onChange={handlePromptComponentsChange}
              />
              
              {/* Results Tabs */}
              <Tabs colorScheme="brand" variant="line" isLazy>
                <TabList>
                  <Tab>Prompt Result</Tab>
                  <Tab>Audio Preview</Tab>
                </TabList>
                
                <TabPanels>
                  <TabPanel px={0}>
                    <PromptResult 
                      prompt={generatedPrompt}
                      fullComponents={promptComponents}
                    />
                  </TabPanel>
                  <TabPanel px={0}>
                    <AudioPreview 
                      prompt={generatedPrompt}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </VStack>
          </GridItem>
          
          {/* Dashboard panel for desktop */}
          {showDashboard && !isMobile && (
            <GridItem>
              <Dashboard 
                promptComponents={promptComponents}
                onUseTemplate={handleUseTemplate}
                onApplySuggestion={handleApplySuggestion}
                onUsePrompt={handleUsePrompt}
              />
            </GridItem>
          )}
        </Grid>
        
        {/* Mobile dashboard drawer handled by the Dashboard component */}
        {isMobile && (
          <Dashboard 
            promptComponents={promptComponents}
            onUseTemplate={handleUseTemplate}
            onApplySuggestion={handleApplySuggestion}
            onUsePrompt={handleUsePrompt}
            isOpen={isOpen}
            onClose={onClose}
          />
        )}
      </Container>
      <Footer />
    </Box>
  );
}

export default App;