import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  FormHelperText,
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
  Progress,
  Tooltip,
  IconButton,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdInfo, MdAutoAwesome, MdAdd } from 'react-icons/md';

// Import data from genres.json
import promptData from '../data/genres.json';
import { getPromptImprovementSuggestions } from '../utils/promptValidator';

// Get options from data file
const genreOptions = promptData.genres;
const moodOptions = promptData.moods;
const decadeOptions = promptData.decades;
const regionOptions = promptData.regions;
const vocalOptions = promptData.vocals;
const structureOptions = promptData.structures;

const PromptBuilder = ({ components, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [completionScore, setCompletionScore] = useState(0);
  const [newInstrument, setNewInstrument] = useState('');
  const [instrumentSuggestions, setInstrumentSuggestions] = useState([]);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const progressColorScheme = completionScore > 70 ? 'green' : completionScore > 40 ? 'yellow' : 'red';
  
  useEffect(() => {
    // Generate suggestions and calculate completion score
    const feedbackData = getPromptImprovementSuggestions(components);
    setSuggestions(feedbackData.suggestions);
    setCompletionScore(feedbackData.componentsScore);
    
    // Generate instrument suggestions based on genre
    if (components.genre) {
      const genre = components.genre.toLowerCase();
      let suggestedInstruments = [];
      
      if (genre.includes('rock')) {
        suggestedInstruments = ['guitar', 'drums', 'bass', 'electric guitar'];
      } else if (genre.includes('pop')) {
        suggestedInstruments = ['synth', 'piano', 'drums', 'bass'];
      } else if (genre.includes('hip hop')) {
        suggestedInstruments = ['808', 'drums', 'sampler', 'bass'];
      } else if (genre.includes('electronic')) {
        suggestedInstruments = ['synthesizer', 'drum machine', '808', 'sampler'];
      } else if (genre.includes('jazz')) {
        suggestedInstruments = ['saxophone', 'piano', 'drums', 'trumpet', 'bass'];
      } else if (genre.includes('classical')) {
        suggestedInstruments = ['piano', 'violin', 'cello', 'flute', 'orchestra'];
      }
      
      // Filter out instruments already selected
      setInstrumentSuggestions(
        suggestedInstruments.filter(i => !components.instruments.includes(i))
      );
    }
  }, [components]);
  
  const handleChange = (field, value) => {
    onChange({
      ...components,
      [field]: value
    });
  };
  
  const handleInstrumentInputChange = (e) => {
    setNewInstrument(e.target.value);
  };

  const handleInstrumentAdd = (e) => {
    if (e.key === 'Enter' && newInstrument.trim()) {
      addInstrument(newInstrument.trim());
    }
  };
  
  const addInstrument = (instrument) => {
    if (!components.instruments.includes(instrument)) {
      const updatedInstruments = [...components.instruments, instrument];
      onChange({
        ...components,
        instruments: updatedInstruments
      });
      setNewInstrument('');
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
        <Flex justify="space-between" align="center">
          <Heading as="h2" size="md">
            Structured Prompt Builder
          </Heading>
          <Tooltip label={`Completion score: ${completionScore}%`}>
            <Box w="100px">
              <Progress 
                value={completionScore} 
                size="sm" 
                borderRadius="full" 
                colorScheme={progressColorScheme}
              />
            </Box>
          </Tooltip>
        </Flex>
        
        <Text fontSize="sm" color="gray.600">
          Build your prompt by specifying individual components. Components will be 
          formatted according to Suno AI's recommended style guidelines.
        </Text>
        
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>
                Genre
                {!components.genre && (
                  <Badge ml={2} colorScheme="red" fontSize="xs">
                    Required
                  </Badge>
                )}
              </FormLabel>
              <Select 
                placeholder="Select genre"
                value={components.genre}
                onChange={(e) => handleChange('genre', e.target.value)}
              >
                {genreOptions.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </Select>
              <FormHelperText>
                Will be formatted as ALL CAPS
              </FormHelperText>
            </FormControl>
          </GridItem>
          
          <GridItem>
            <FormControl isRequired>
              <FormLabel>
                Mood
                {!components.mood && (
                  <Badge ml={2} colorScheme="red" fontSize="xs">
                    Required
                  </Badge>
                )}
              </FormLabel>
              <Select 
                placeholder="Select mood"
                value={components.mood}
                onChange={(e) => handleChange('mood', e.target.value)}
              >
                {moodOptions.map(mood => (
                  <option key={mood} value={mood}>{mood}</option>
                ))}
              </Select>
              <FormHelperText>
                Will be formatted as Title Case
              </FormHelperText>
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
              <FormHelperText>
                Add rhythm information for better results
              </FormHelperText>
            </FormControl>
          </GridItem>
          
          <GridItem>
            <FormControl>
              <FormLabel>Decade/Era</FormLabel>
              <Select 
                placeholder="Select decade or era"
                value={components.decade}
                onChange={(e) => handleChange('decade', e.target.value)}
              >
                {decadeOptions.map(decade => (
                  <option key={decade} value={decade}>{decade}</option>
                ))}
              </Select>
              <FormHelperText>
                Historical style reference
              </FormHelperText>
            </FormControl>
          </GridItem>
          
          <GridItem>
            <FormControl>
              <FormLabel>Region</FormLabel>
              <Select 
                placeholder="Select region"
                value={components.region}
                onChange={(e) => handleChange('region', e.target.value)}
              >
                {regionOptions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </Select>
              <FormHelperText>
                Geographic or cultural influence
              </FormHelperText>
            </FormControl>
          </GridItem>
          
          <GridItem>
            <FormControl>
              <FormLabel>Vocals</FormLabel>
              <Select 
                placeholder="Select vocal style"
                value={components.vocals}
                onChange={(e) => handleChange('vocals', e.target.value)}
              >
                {vocalOptions.map(vocal => (
                  <option key={vocal} value={vocal}>{vocal}</option>
                ))}
              </Select>
              <FormHelperText>
                Vocal characteristics
              </FormHelperText>
            </FormControl>
          </GridItem>
          
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <FormControl>
              <FormLabel>Instruments</FormLabel>
              <Flex align="center">
                <Input 
                  placeholder="Type instrument and press Enter"
                  value={newInstrument}
                  onChange={handleInstrumentInputChange}
                  onKeyDown={handleInstrumentAdd}
                  mr={2}
                />
                <IconButton
                  icon={<MdAdd />}
                  aria-label="Add instrument"
                  onClick={() => newInstrument.trim() && addInstrument(newInstrument.trim())}
                  isDisabled={!newInstrument.trim()}
                />
              </Flex>
              <FormHelperText>
                Will be formatted as lowercase
              </FormHelperText>
              
              {instrumentSuggestions.length > 0 && (
                <Box mt={2}>
                  <Text fontSize="xs" fontWeight="medium">
                    Suggested for {components.genre}:
                  </Text>
                  <Flex mt={1} gap={1} wrap="wrap">
                    {instrumentSuggestions.map((instrument, idx) => (
                      <Tag 
                        key={idx} 
                        size="sm" 
                        variant="outline" 
                        colorScheme="gray"
                        cursor="pointer"
                        onClick={() => addInstrument(instrument)}
                      >
                        + {instrument}
                      </Tag>
                    ))}
                  </Flex>
                </Box>
              )}
              
              <Flex wrap="wrap" mt={2} gap={2}>
                {components.instruments.map((instrument, index) => (
                  <Tag 
                    key={index} 
                    size="md" 
                    borderRadius="full" 
                    variant="solid" 
                    colorScheme="brand"
                  >
                    <TagLabel>{instrument.toLowerCase()}</TagLabel>
                    <TagCloseButton onClick={() => handleInstrumentRemove(instrument)} />
                  </Tag>
                ))}
              </Flex>
            </FormControl>
          </GridItem>
          
          <GridItem>
            <FormControl>
              <FormLabel>Structure</FormLabel>
              <Select 
                placeholder="Select structure"
                value={components.structure}
                onChange={(e) => handleChange('structure', e.target.value)}
              >
                {structureOptions.map(structure => (
                  <option key={structure} value={structure}>{structure}</option>
                ))}
              </Select>
              <FormHelperText>
                Song structure and form
              </FormHelperText>
            </FormControl>
          </GridItem>
          
          <GridItem>
            <FormControl>
              <FormLabel>Descriptors (Title Case)</FormLabel>
              <Input 
                placeholder="E.g., Dreamy, Emotional, Cinematic"
                value={components.descriptors || ''}
                onChange={(e) => handleChange('descriptors', e.target.value)}
              />
              <FormHelperText>
                Comma separated adjectives
              </FormHelperText>
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
              <FormHelperText>
                Add specific details like lyrical themes, style influences, etc.
              </FormHelperText>
            </FormControl>
          </GridItem>
        </Grid>
        
        {suggestions.length > 0 && (
          <Box 
            mt={4} 
            p={3} 
            bg={useColorModeValue('yellow.50', 'yellow.900')} 
            borderRadius="md"
            borderWidth="1px"
            borderColor={useColorModeValue('yellow.200', 'yellow.700')}
          >
            <Flex align="center" mb={2}>
              <MdAutoAwesome />
              <Text ml={2} fontWeight="medium" fontSize="sm">
                Suggestions to improve your prompt:
              </Text>
            </Flex>
            <VStack align="start" spacing={1}>
              {suggestions.slice(0, 3).map((suggestion, idx) => (
                <Text key={idx} fontSize="xs">
                  • {suggestion.message}
                </Text>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default PromptBuilder;