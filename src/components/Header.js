import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  IconButton,
  useColorMode,
  useColorModeValue,
  Container,
  HStack,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box 
      as="header" 
      bg={bgColor} 
      borderBottom="1px" 
      borderColor={borderColor}
      position="sticky"
      top={0}
      zIndex={10}
      boxShadow="sm"
    >
      <Container maxW="container.xl">
        <Flex py={4} justifyContent="space-between" alignItems="center">
          <Heading as="h1" size="lg" letterSpacing={'tighter'}>
            Suno AI Prompt Tool
          </Heading>
          
          <HStack spacing={4}>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.open('https://suno.ai', '_blank')}
            >
              Visit Suno
            </Button>
            
            <IconButton
              aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              size="md"
            />
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;