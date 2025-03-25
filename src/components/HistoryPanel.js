import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Flex,
  Divider,
  Icon,
  useColorModeValue,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { 
  MdHistory, 
  MdStar, 
  MdStarOutline, 
  MdMoreVert, 
  MdDelete, 
  MdContentCopy,
  MdPlayArrow
} from 'react-icons/md';
import { 
  getHistory, 
  getFavorites, 
  addToFavorites, 
  removeFromFavorites, 
  clearHistory 
} from '../utils/historyManager';
import copy from 'clipboard-copy';

const HistoryPanel = ({ onUsePrompt }) => {
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  
  useEffect(() => {
    loadHistory();
    loadFavorites();
  }, []);
  
  const loadHistory = () => {
    const historyItems = getHistory();
    setHistory(historyItems);
  };
  
  const loadFavorites = () => {
    const favoriteItems = getFavorites();
    setFavorites(favoriteItems);
  };
  
  const handleToggleFavorite = (item) => {
    const isFavorite = favorites.some(fav => fav.id === item.id);
    
    if (isFavorite) {
      removeFromFavorites(item.id);
      toast({
        title: "Removed from favorites",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    } else {
      addToFavorites(item);
      toast({
        title: "Added to favorites",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
    
    // Refresh lists
    loadFavorites();
  };
  
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your history? This cannot be undone.')) {
      clearHistory();
      loadHistory();
      toast({
        title: "History cleared",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  
  const handleCopyPrompt = (prompt) => {
    copy(prompt);
    toast({
      title: "Copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };
  
  const handleUsePrompt = (item) => {
    if (onUsePrompt) {
      onUsePrompt(item.id);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // If yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // Otherwise show date
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };
  
  const renderPromptItem = (item, isFavorite = false) => {
    const savedInFavorites = favorites.some(fav => fav.id === item.id);
    
    return (
      <Box
        key={item.id}
        p={3}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
        _hover={{ bg: hoverBg }}
      >
        <Flex justify="space-between" align="flex-start">
          <VStack align="start" spacing={1} flex="1">
            <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
              {item.prompt}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {formatDate(item.createdAt)}
            </Text>
          </VStack>
          
          <HStack>
            <Tooltip label={savedInFavorites ? "Remove from favorites" : "Add to favorites"}>
              <IconButton
                aria-label={savedInFavorites ? "Remove from favorites" : "Add to favorites"}
                icon={savedInFavorites ? <MdStar /> : <MdStarOutline />}
                size="sm"
                variant="ghost"
                colorScheme={savedInFavorites ? "yellow" : "gray"}
                onClick={() => handleToggleFavorite(item)}
              />
            </Tooltip>
            
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<MdMoreVert />}
                variant="ghost"
                size="sm"
              />
              <MenuList>
                <MenuItem 
                  icon={<MdContentCopy />} 
                  onClick={() => handleCopyPrompt(item.prompt)}
                >
                  Copy prompt
                </MenuItem>
                <MenuItem 
                  icon={<MdPlayArrow />} 
                  onClick={() => handleUsePrompt(item)}
                >
                  Use this prompt
                </MenuItem>
                {isFavorite && (
                  <MenuItem 
                    icon={<MdDelete />} 
                    onClick={() => handleToggleFavorite(item)}
                    color="red.500"
                  >
                    Remove from favorites
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
        
        {item.components && Object.keys(item.components).some(key => !!item.components[key]) && (
          <>
            <Divider my={2} />
            <Flex wrap="wrap" gap={1}>
              {item.components.genre && (
                <Badge colorScheme="purple" size="sm">
                  {item.components.genre}
                </Badge>
              )}
              {item.components.mood && (
                <Badge colorScheme="blue" size="sm">
                  {item.components.mood}
                </Badge>
              )}
              {item.components.tempo && (
                <Badge colorScheme="green" size="sm">
                  {item.components.tempo}
                </Badge>
              )}
              {item.components.decade && (
                <Badge colorScheme="orange" size="sm">
                  {item.components.decade}
                </Badge>
              )}
            </Flex>
          </>
        )}
      </Box>
    );
  };
  
  return (
    <Box>
      <Tabs variant="enclosed" colorScheme="brand" index={activeTab} onChange={setActiveTab}>
        <TabList>
          <Tab>
            <HStack spacing={1}>
              <Icon as={MdHistory} />
              <Text>History</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack spacing={1}>
              <Icon as={MdStar} />
              <Text>Favorites</Text>
              {favorites.length > 0 && (
                <Badge ml={1} colorScheme="yellow" borderRadius="full">
                  {favorites.length}
                </Badge>
              )}
            </HStack>
          </Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel p={4}>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="sm">Recent Prompts</Heading>
              
              {history.length > 0 && (
                <Button 
                  size="xs" 
                  variant="outline" 
                  colorScheme="red" 
                  leftIcon={<MdDelete />}
                  onClick={handleClearHistory}
                >
                  Clear History
                </Button>
              )}
            </Flex>
            
            {history.length > 0 ? (
              <VStack spacing={3} align="stretch">
                {history.map(item => renderPromptItem(item))}
              </VStack>
            ) : (
              <Text color="gray.500" fontSize="sm">
                No prompt history yet. Generated prompts will appear here.
              </Text>
            )}
          </TabPanel>
          
          <TabPanel p={4}>
            <Heading size="sm" mb={4}>
              Favorite Prompts
            </Heading>
            
            {favorites.length > 0 ? (
              <VStack spacing={3} align="stretch">
                {favorites.map(item => renderPromptItem(item, true))}
              </VStack>
            ) : (
              <Text color="gray.500" fontSize="sm">
                No favorites yet. Click the star icon on prompts to add them here.
              </Text>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default HistoryPanel;