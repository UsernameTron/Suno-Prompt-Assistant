import React, { useState, useEffect } from 'react';
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
  AlertTitle,
  Flex,
  Link,
  CircularProgress,
  CircularProgressLabel,
  Badge,
  List,
  ListItem,
  ListIcon,
  Divider,
} from '@chakra-ui/react';
import { CopyIcon, ExternalLinkIcon, InfoIcon, WarningIcon } from '@chakra-ui/icons';
import { MdCheckCircle, MdError, MdWarning } from 'react-icons/md';
import copy from 'clipboard-copy';
import { validatePrompt } from '../utils/promptValidator';
import { addToFavorites, isInFavorites } from '../utils/historyManager';

const PromptResult = ({ prompt, fullComponents }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [validation, setValidation] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const codeBg = useColorModeValue('gray.50', 'gray.700');
  const toast = useToast();
  
  useEffect(() => {
    // Check if prompt is already in favorites
    if (prompt) {
      setIsSaved(isInFavorites(prompt));
      
      // Validate the prompt
      setIsValidating(true);
      try {
        const result = validatePrompt(prompt);
        setValidation(result);
      } catch (error) {
        console.error('Error validating prompt:', error);
      } finally {
        setIsValidating(false);
      }
    } else {
      setValidation(null);
    }
  }, [prompt]);

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
      // Add to favorites using the history manager utility
      const savedPrompt = addToFavorites({
        prompt,
        components: fullComponents || {}
      });
      
      if (savedPrompt) {
        setIsSaved(true);
        
        toast({
          title: "Saved to favorites",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
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
  
  // Function to render validation feedback
  const renderValidationFeedback = () => {
    if (!validation) return null;
    
    const { isValid, score, feedback, suggestions } = validation;
    const scoreColor = score >= 90 ? 'green' : score >= 70 ? 'yellow' : 'red';
    
    return (
      <Box mt={4} p={3} borderRadius="md" borderWidth="1px" borderColor={scoreColor + '.200'}>
        <Flex justify="space-between" align="center" mb={2}>
          <Flex align="center">
            {isValid ? (
              <MdCheckCircle color="green" size="20px" />
            ) : (
              <MdWarning color="orange" size="20px" />
            )}
            <Text ml={2} fontWeight="medium" fontSize="sm">
              {isValid ? "Prompt Validation Passed" : "Prompt Needs Improvement"}
            </Text>
          </Flex>
          
          <Flex align="center">
            <CircularProgress value={score} color={scoreColor + '.400'} size="40px">
              <CircularProgressLabel fontWeight="bold" fontSize="sm">
                {score}
              </CircularProgressLabel>
            </CircularProgress>
          </Flex>
        </Flex>
        
        {feedback.length > 0 && (
          <List spacing={1} mb={2}>
            {feedback.slice(0, 3).map((item, idx) => (
              <ListItem key={idx} fontSize="xs">
                <ListIcon 
                  as={item.type === 'error' ? MdError : MdWarning}
                  color={item.type === 'error' ? 'red.500' : 'yellow.500'}
                />
                {item.message}
              </ListItem>
            ))}
          </List>
        )}
        
        {suggestions.length > 0 && (
          <>
            <Divider my={2} />
            <Text fontSize="xs" fontWeight="medium" mb={1}>
              Suggested improvements:
            </Text>
            <List spacing={1}>
              {suggestions.slice(0, 2).map((suggestion, idx) => (
                <ListItem key={idx} fontSize="xs">
                  <ListIcon as={MdCheckCircle} color="green.500" />
                  {suggestion}
                </ListItem>
              ))}
            </List>
          </>
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
        <Flex justify="space-between" align="center">
          <Heading as="h2" size="md">
            Generated Prompt
          </Heading>
          
          {prompt && validation && (
            <Badge 
              colorScheme={validation.isValid ? 'green' : 'yellow'} 
              variant="solid"
              borderRadius="full"
              px={2}
              py={1}
            >
              Score: {validation.score}/100
            </Badge>
          )}
        </Flex>
        
        {prompt ? (
          <>
            <Box 
              p={4} 
              bg={codeBg} 
              borderRadius="md" 
              borderWidth="1px"
              borderColor={
                validation && validation.isValid 
                  ? 'green.200' 
                  : validation 
                    ? 'yellow.200' 
                    : borderColor
              }
              fontFamily="mono"
              fontSize="md"
              overflowX="auto"
              position="relative"
            >
              <Code p={2} width="100%" borderRadius="md" variant="subtle">
                {prompt}
              </Code>
              
              {isValidating && (
                <CircularProgress 
                  isIndeterminate 
                  size="24px" 
                  position="absolute"
                  top={2}
                  right={2}
                  color="brand.500"
                />
              )}
            </Box>
            
            {/* Validation feedback section */}
            {renderValidationFeedback()}
            
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
                colorScheme={validation && validation.isValid ? "green" : "yellow"}
              >
                Export to Suno
              </Button>
            </Flex>
            
            <Divider my={3} />
            
            <Heading as="h3" size="sm" mb={3}>
              Prompt Components
            </Heading>
            
            <VStack align="stretch" spacing={2}>
              {fullComponents && Object.entries(fullComponents).map(([key, value]) => 
                value ? (
                  <Flex key={key} justify="space-between">
                    <Text fontWeight="medium" textTransform="capitalize">{key}:</Text>
                    <Text>{Array.isArray(value) ? value.join(', ') : value}</Text>
                  </Flex>
                ) : null
              )}
            </VStack>
            
            <Alert 
              status={validation && validation.isValid ? "success" : "info"} 
              borderRadius="md"
              mt={4}
            >
              <AlertIcon />
              <Box>
                <AlertTitle fontSize="sm">
                  {validation && validation.isValid
                    ? "Your prompt is ready!"
                    : "Your prompt can be used, but could be improved."
                  }
                </AlertTitle>
                <AlertDescription fontSize="sm">
                  {validation && validation.isValid
                    ? "Export directly to Suno AI to generate your music."
                    : "See the suggestions above to improve your prompt before exporting."
                  }
                </AlertDescription>
              </Box>
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