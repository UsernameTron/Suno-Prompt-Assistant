import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  Heading,
  useColorModeValue,
  useToast,
  Code,
  Alert,
  AlertIcon,
  AlertDescription,
  Flex,
  Link,
} from '@chakra-ui/react';
import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import copy from 'clipboard-copy';

const PromptResult = ({ prompt }) => {
  const [isSaved, setIsSaved] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const codeBg = useColorModeValue('gray.50', 'gray.700');
  const toast = useToast();

  const handleCopy = () => {
    if (prompt) {
      copy(prompt);
      toast({
        title: "Copied to clipboard",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleSave = () => {
    if (prompt) {
      // Get existing favorites from local storage
      const existingFavorites = JSON.parse(localStorage.getItem('favoritePrompts') || '[]');
      
      // Add new prompt with timestamp
      const newFavorite = {
        prompt,
        createdAt: new Date().toISOString(),
        id: Date.now().toString(),
      };
      
      // Save back to local storage
      localStorage.setItem('favoritePrompts', JSON.stringify([
        ...existingFavorites,
        newFavorite
      ]));
      
      setIsSaved(true);
      
      toast({
        title: "Saved to favorites",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleExportToSuno = () => {
    if (prompt) {
      // Encode the prompt for the URL
      const encodedPrompt = encodeURIComponent(prompt);
      // Open Suno in a new tab with the prompt pre-filled
      window.open(`https://suno.ai/create?prompt=${encodedPrompt}`, '_blank');
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
          Generated Prompt
        </Heading>
        
        {prompt ? (
          <>
            <Box 
              p={4} 
              bg={codeBg} 
              borderRadius="md" 
              fontFamily="mono"
              fontSize="md"
              overflowX="auto"
            >
              <Code p={2} width="100%" borderRadius="md" variant="subtle">
                {prompt}
              </Code>
            </Box>
            
            <Flex gap={2} wrap="wrap">
              <Button 
                leftIcon={<CopyIcon />} 
                onClick={handleCopy}
                size="sm"
              >
                Copy to Clipboard
              </Button>
              
              <Button 
                onClick={handleSave} 
                isDisabled={isSaved}
                size="sm"
                variant="outline"
              >
                {isSaved ? "Saved to Favorites" : "Save to Favorites"}
              </Button>
              
              <Button
                rightIcon={<ExternalLinkIcon />}
                onClick={handleExportToSuno}
                size="sm"
                colorScheme="green"
              >
                Export to Suno
              </Button>
            </Flex>
            
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <AlertDescription>
                <Text fontSize="sm">
                  Ready to create? Export directly to{" "}
                  <Link href="https://suno.ai" isExternal color="brand.500">
                    Suno AI
                  </Link>{" "}
                  or copy this prompt to use on the platform.
                </Text>
              </AlertDescription>
            </Alert>
          </>
        ) : (
          <Text color="gray.500">
            Your formatted prompt will appear here once you've added some components.
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default PromptResult;