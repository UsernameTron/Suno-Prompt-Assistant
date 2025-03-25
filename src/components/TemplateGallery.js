import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Button,
  Badge,
  Flex,
  VStack,
  HStack,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Select,
  useColorModeValue,
  Tooltip,
  Icon,
} from '@chakra-ui/react';
import { MdInfoOutline, MdPlayArrow, MdFilterList } from 'react-icons/md';
import templates from '../data/templates';

const TemplateGallery = ({ onSelectTemplate }) => {
  const [filter, setFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const selectedBg = useColorModeValue('purple.50', 'purple.900');
  const selectedBorder = useColorModeValue('purple.200', 'purple.700');
  
  // Apply filters to templates
  const getFilteredTemplates = () => {
    if (filter === 'all') return templates;
    
    return templates.filter(template => {
      const genre = template.components.genre;
      if (!genre) return false;
      
      switch (filter) {
        case 'pop_electronic':
          return ['POP', 'ELECTRONIC'].includes(genre);
        case 'rock_metal':
          return ['ROCK', 'METAL'].includes(genre);
        case 'hiphop_rnb':
          return ['HIP HOP', 'R&B'].includes(genre);
        case 'jazz_blues':
          return ['JAZZ', 'BLUES'].includes(genre);
        case 'classical_ambient':
          return ['CLASSICAL', 'AMBIENT'].includes(genre);
        case 'folk_country':
          return ['FOLK', 'COUNTRY', 'WORLD'].includes(genre);
        default:
          return true;
      }
    });
  };
  
  const filteredTemplates = getFilteredTemplates();
  
  const handleTemplateClick = (template) => {
    setSelectedTemplate(template.id === selectedTemplate ? null : template.id);
  };
  
  const handleUseTemplate = (template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  };
  
  const renderTemplateCard = (template) => {
    const isSelected = selectedTemplate === template.id;
    
    return (
      <Box
        key={template.id}
        p={4}
        borderRadius="md"
        borderWidth="1px"
        borderColor={isSelected ? selectedBorder : borderColor}
        bg={isSelected ? selectedBg : bgColor}
        cursor="pointer"
        onClick={() => handleTemplateClick(template)}
        _hover={{ bg: isSelected ? selectedBg : hoverBg }}
        transition="all 0.2s"
        h="100%"
      >
        <VStack align="start" spacing={2} h="100%">
          <Flex w="100%" justify="space-between" align="center">
            <Heading size="sm">{template.name}</Heading>
            <Badge colorScheme={getGenreColor(template.components.genre)}>
              {template.components.genre}
            </Badge>
          </Flex>
          
          <Text fontSize="sm" color="gray.600" noOfLines={2}>
            {template.description}
          </Text>
          
          {isSelected ? (
            <VStack align="start" spacing={2} w="100%" mt={2}>
              <Divider />
              
              <HStack wrap="wrap" spacing={1}>
                <Badge size="sm" colorScheme="blue">
                  {template.components.mood}
                </Badge>
                {template.components.tempo && (
                  <Badge size="sm" colorScheme="green">
                    {template.components.tempo}
                  </Badge>
                )}
              </HStack>
              
              <Text fontSize="xs" color="gray.600">
                <b>Instruments:</b> {template.components.instruments}
              </Text>
              
              {template.components.decade && (
                <Text fontSize="xs" color="gray.600">
                  <b>Era:</b> {template.components.decade}
                </Text>
              )}
              
              <Button 
                size="sm" 
                colorScheme="brand"
                leftIcon={<MdPlayArrow />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleUseTemplate(template);
                }}
                w="100%"
                mt="auto"
              >
                Use Template
              </Button>
            </VStack>
          ) : (
            <HStack mt="auto" pt={2}>
              {template.components.mood && (
                <Badge size="sm" variant="subtle">
                  {template.components.mood}
                </Badge>
              )}
              {template.components.tempo && (
                <Badge size="sm" variant="subtle">
                  {template.components.tempo}
                </Badge>
              )}
            </HStack>
          )}
        </VStack>
      </Box>
    );
  };
  
  const getGenreColor = (genre) => {
    const genreColors = {
      'POP': 'pink',
      'ROCK': 'red',
      'HIP HOP': 'orange',
      'ELECTRONIC': 'blue',
      'JAZZ': 'purple',
      'CLASSICAL': 'green',
      'FOLK': 'brown',
      'COUNTRY': 'yellow',
      'AMBIENT': 'teal',
    };
    
    return genreColors[genre] || 'gray';
  };
  
  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md">Template Gallery</Heading>
        
        <HStack>
          <Icon as={MdFilterList} color="gray.500" />
          <Select 
            size="sm" 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            maxW="200px"
          >
            <option value="all">All Templates</option>
            <option value="pop_electronic">Pop & Electronic</option>
            <option value="rock_metal">Rock & Metal</option>
            <option value="hiphop_rnb">Hip Hop & R&B</option>
            <option value="jazz_blues">Jazz & Blues</option>
            <option value="classical_ambient">Classical & Ambient</option>
            <option value="folk_country">Folk & Country</option>
          </Select>
        </HStack>
      </Flex>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {filteredTemplates.map(template => renderTemplateCard(template))}
      </SimpleGrid>
      
      <Box mt={6} p={4} borderRadius="md" bg={hoverBg}>
        <Accordion allowToggle>
          <AccordionItem border="0">
            <AccordionButton px={0}>
              <Flex flex="1" textAlign="left" align="center">
                <Icon as={MdInfoOutline} mr={2} />
                <Text fontWeight="medium">How to use templates</Text>
              </Flex>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text fontSize="sm">
                Templates provide pre-configured starting points for different music styles. 
                Click on a template to see details, then use the "Use Template" button to 
                populate the prompt builder with those settings. You can then customize the 
                template further to suit your needs.
              </Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Box>
  );
};

export default TemplateGallery;