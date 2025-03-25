import React from 'react';
import {
  Box,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  Heading,
  Text,
  Tag,
  TagLabel,
  TagCloseButton,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';

// Mock data for genres, moods, and decades - in a real app these would come from an API or data files
const genreOptions = [
  'Pop', 'Rock', 'Hip Hop', 'R&B', 'Electronic', 'Jazz', 'Classical', 'Country',
  'Folk', 'Metal', 'Punk', 'Blues', 'Reggae', 'Soul', 'Funk'
];

const moodOptions = [
  'Happy', 'Sad', 'Energetic', 'Calm', 'Aggressive', 'Peaceful', 'Romantic', 'Nostalgic',
  'Dreamy', 'Dark', 'Epic', 'Playful', 'Mysterious', 'Uplifting', 'Melancholic'
];

const decadeOptions = [
  '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'
];

const PromptBuilder = ({ components, onChange }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleChange = (field, value) => {
    onChange({
      ...components,
      [field]: value
    });
  };

  const handleInstrumentAdd = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const newInstrument = e.target.value.trim();
      if (!components.instruments.includes(newInstrument)) {
        const updatedInstruments = [...components.instruments, newInstrument];
        onChange({
          ...components,
          instruments: updatedInstruments
        });
        e.target.value = '';
      }
    }
  };

  const handleInstrumentRemove = (instrument) => {
    const updatedInstruments = components.instruments.filter(i => i !== instrument);
    onChange({
      ...components,
      instruments: updatedInstruments
    });
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
          Structured Prompt Builder
        </Heading>
        
        <Text fontSize="sm" color="gray.600">
          Build your prompt by specifying individual components. Components will be 
          formatted according to Suno AI's recommended style guidelines.
        </Text>
        
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          <GridItem>
            <FormControl>
              <FormLabel>Genre</FormLabel>
              <Select 
                placeholder="Select genre"
                value={components.genre}
                onChange={(e) => handleChange('genre', e.target.value)}
              >
                {genreOptions.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </Select>
              <Text fontSize="xs" color="gray.500" mt={1}>
                Will be formatted as ALL CAPS
              </Text>
            </FormControl>
          </GridItem>
          
          <GridItem>
            <FormControl>
              <FormLabel>Mood</FormLabel>
              <Select 
                placeholder="Select mood"
                value={components.mood}
                onChange={(e) => handleChange('mood', e.target.value)}
              >
                {moodOptions.map(mood => (
                  <option key={mood} value={mood}>{mood}</option>
                ))}
              </Select>
              <Text fontSize="xs" color="gray.500" mt={1}>
                Will be formatted as Title Case
              </Text>
            </FormControl>
          </GridItem>
          
          <GridItem>
            <FormControl>
              <FormLabel>Tempo</FormLabel>
              <Input 
                placeholder="E.g., 120 BPM, slow, uptempo"
                value={components.tempo}
                onChange={(e) => handleChange('tempo', e.target.value)}
              />
            </FormControl>
          </GridItem>
          
          <GridItem>
            <FormControl>
              <FormLabel>Decade</FormLabel>
              <Select 
                placeholder="Select decade"
                value={components.decade}
                onChange={(e) => handleChange('decade', e.target.value)}
              >
                {decadeOptions.map(decade => (
                  <option key={decade} value={decade}>{decade}</option>
                ))}
              </Select>
            </FormControl>
          </GridItem>
          
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <FormControl>
              <FormLabel>Instruments</FormLabel>
              <Input 
                placeholder="Type instrument and press Enter"
                onKeyDown={handleInstrumentAdd}
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                Will be formatted as lowercase
              </Text>
              
              <Flex wrap="wrap" mt={2} gap={2}>
                {components.instruments.map((instrument, index) => (
                  <Tag key={index} size="md" borderRadius="full" variant="solid" colorScheme="brand">
                    <TagLabel>{instrument.toLowerCase()}</TagLabel>
                    <TagCloseButton onClick={() => handleInstrumentRemove(instrument)} />
                  </Tag>
                ))}
              </Flex>
            </FormControl>
          </GridItem>
          
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <FormControl>
              <FormLabel>Additional Description</FormLabel>
              <Textarea 
                placeholder="Any additional details about the music"
                value={components.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
            </FormControl>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
};

export default PromptBuilder;