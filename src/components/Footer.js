import React from 'react';
import {
  Box,
  Container,
  Text,
  Link,
  Flex,
  useColorMode,
} from '@chakra-ui/react';

const Footer = () => {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === 'light' ? 'white' : 'gray.800';
  const borderColor = colorMode === 'light' ? 'gray.200' : 'gray.700';
  const textColor = colorMode === 'light' ? 'gray.600' : 'gray.400';

  return (
    <Box 
      as="footer" 
      bg={bgColor} 
      borderTop="1px" 
      borderColor={borderColor}
      py={4}
      mt="auto"
    >
      <Container maxW="container.xl">
        <Flex 
          direction={{ base: 'column', md: 'row' }} 
          justify="space-between" 
          align="center"
        >
          <Text fontSize="sm" color={textColor}>
            &copy; {new Date().getFullYear()} Suno AI Prompt Tool
          </Text>
          
          <Flex mt={{ base: 2, md: 0 }}>
            <Link 
              href="https://suno.ai" 
              isExternal 
              fontSize="sm"
              color={textColor}
              mx={2}
            >
              Suno AI
            </Link>
            <Link 
              href="#privacy" 
              fontSize="sm"
              color={textColor}
              mx={2}
            >
              Privacy
            </Link>
            <Link 
              href="#terms" 
              fontSize="sm"
              color={textColor}
              mx={2}
            >
              Terms
            </Link>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;