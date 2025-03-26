import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  Heading,
  useColorMode,
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { 
  CopyIcon, 
  ExternalLinkIcon, 
  InfoIcon, 
  WarningIcon, 
  ChevronDownIcon, 
  LinkIcon 
} from '@chakra-ui/icons';
import { MdCheckCircle, MdError, MdWarning } from 'react-icons/md';
import copy from 'clipboard-copy';
import { validatePrompt } from '../utils/promptValidator';
import { addToFavorites, isInFavorites } from '../utils/historyManager';

const PromptResult = ({ prompt, fullComponents }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [validation, setValidation] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [exportLink, setExportLink] = useState('');
  const [shareableLink, setShareableLink] = useState('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  
  const linkInputRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const { colorMode } = useColorMode();
  const bgColor = colorMode === 'light' ? 'white' : 'gray.800';
  const borderColor = colorMode === 'light' ? 'gray.200' : 'gray.700';
  const codeBg = colorMode === 'light' ? 'gray.50' : 'gray.700';
  const modalBg = colorMode === 'light' ? 'white' : 'gray.800';
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
      const exportUrl = `https://suno.ai/create?prompt=${encodedPrompt}`;
      
      // Set the export link and open the modal
      setExportLink(exportUrl);
      generateShareableLink();
      onOpen();
    }
  };
  
  const handleOpenInSuno = () => {
    if (exportLink) {
      // Open Suno in a new tab with the prompt pre-filled
      window.open(exportLink, '_blank');
      onClose();
    }
  };
  
  const generateShareableLink = () => {
    if (prompt) {
      setIsGeneratingLink(true);
      
      try {
        // Create a shortened link on the server
        // This is a simulated response since we don't have an actual link shortener API integrated
        setTimeout(() => {
          const hash = Math.random().toString(36).substring(2, 8);
          const shareLink = `${window.location.origin}/share/${hash}`;
          setShareableLink(shareLink);
          setIsGeneratingLink(false);
        }, 1000);
      } catch (error) {
        console.error('Error generating shareable link:', error);
        setIsGeneratingLink(false);
        
        toast({
          title: "Error generating link",
          description: "Could not generate a shareable link. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };
  
  const handleCopyLink = (link) => {
    copy(link);
    toast({
      title: "Link copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
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
              
              <Menu>
                <MenuButton
                  as={Button}
                  size="sm"
                  colorScheme={validation && validation.isValid ? "green" : "yellow"}
                  rightIcon={<ChevronDownIcon />}
                >
                  Export
                </MenuButton>
                <MenuList>
                  <MenuItem 
                    icon={<ExternalLinkIcon />} 
                    onClick={handleExportToSuno}
                  >
                    Export to Suno AI
                  </MenuItem>
                  <MenuItem 
                    icon={<LinkIcon />} 
                    onClick={generateShareableLink}
                    isDisabled={isGeneratingLink}
                  >
                    Generate Shareable Link
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
            
            {/* Export Modal */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
              <ModalOverlay />
              <ModalContent bg={modalBg}>
                <ModalHeader>Export to Suno AI</ModalHeader>
                <ModalCloseButton />
                
                <ModalBody>
                  <VStack spacing={4} align="stretch">
                    <Text>
                      Your prompt is ready to be used with Suno AI's music generation platform. 
                      Use one of the options below:
                    </Text>
                    
                    <Box>
                      <Text fontWeight="medium" mb={1}>Direct Link to Suno:</Text>
                      <InputGroup size="md">
                        <Input
                          pr="4.5rem"
                          value={exportLink}
                          readOnly
                          fontFamily="mono"
                          fontSize="sm"
                        />
                        <InputRightElement width="4.5rem">
                          <Button 
                            h="1.75rem" 
                            size="sm" 
                            onClick={() => handleCopyLink(exportLink)}
                          >
                            Copy
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="medium" mb={1}>Shareable Link:</Text>
                      <InputGroup size="md">
                        <Input
                          pr="4.5rem"
                          value={shareableLink}
                          readOnly
                          fontFamily="mono"
                          fontSize="sm"
                          ref={linkInputRef}
                          isDisabled={isGeneratingLink}
                        />
                        <InputRightElement width="4.5rem">
                          {isGeneratingLink ? (
                            <CircularProgress isIndeterminate size="1.5rem" color="brand.500" />
                          ) : (
                            <Button 
                              h="1.75rem" 
                              size="sm" 
                              onClick={() => handleCopyLink(shareableLink)}
                              isDisabled={!shareableLink}
                            >
                              Copy
                            </Button>
                          )}
                        </InputRightElement>
                      </InputGroup>
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        This link allows others to use your prompt in our tool.
                      </Text>
                    </Box>
                  </VStack>
                </ModalBody>
                
                <ModalFooter>
                  <Button variant="ghost" mr={3} onClick={onClose}>
                    Close
                  </Button>
                  <Button 
                    colorScheme="brand" 
                    rightIcon={<ExternalLinkIcon />}
                    onClick={handleOpenInSuno}
                  >
                    Open in Suno
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            
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