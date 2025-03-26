import React, { useState } from 'react';
import {
  Box,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon,
  Text,
  useColorMode,
  Grid,
  GridItem,
  Button,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import { 
  MdHistory, 
  MdAutoAwesome, 
  MdCollections, 
  MdInsights,
  MdMenu
} from 'react-icons/md';
import HistoryPanel from './HistoryPanel';
import TemplateGallery from './TemplateGallery';
import SuggestionPanel from './SuggestionPanel';
import UserInsights from './UserInsights';

const Dashboard = ({ 
  promptComponents, 
  onUseTemplate, 
  onApplySuggestion, 
  onUsePrompt,
  isOpen: externalIsOpen,
  onClose: externalOnClose
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const internalDisclosure = useDisclosure();
  
  // Use external disclosure props if provided, otherwise use internal
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalDisclosure.isOpen;
  const onOpen = internalDisclosure.onOpen;
  const onClose = externalOnClose || internalDisclosure.onClose;
  
  const { colorMode } = useColorMode();
  const bgColor = colorMode === 'light' ? 'white' : 'gray.800';
  const borderColor = colorMode === 'light' ? 'gray.200' : 'gray.700';
  
  const isDrawer = useBreakpointValue({ base: true, lg: false });
  
  const handleTabChange = (index) => {
    setActiveTab(index);
    if (isDrawer) {
      onOpen();
    }
  };
  
  const dashboardContent = (
    <>
      {isDrawer && (
        <DrawerHeader borderBottomWidth="1px">
          {activeTab === 0 && "History & Favorites"}
          {activeTab === 1 && "Template Gallery"}
          {activeTab === 2 && "AI Suggestions"}
          {activeTab === 3 && "Your Insights"}
        </DrawerHeader>
      )}
      
      <TabPanels>
        <TabPanel p={4}>
          <HistoryPanel onUsePrompt={onUsePrompt} />
        </TabPanel>
        
        <TabPanel p={4}>
          <TemplateGallery onSelectTemplate={onUseTemplate} />
        </TabPanel>
        
        <TabPanel p={4}>
          <SuggestionPanel 
            components={promptComponents} 
            onApplySuggestion={onApplySuggestion}
            onUseTemplate={onUseTemplate}
            isOpen={true}
          />
        </TabPanel>
        
        <TabPanel p={4}>
          <UserInsights />
        </TabPanel>
      </TabPanels>
    </>
  );
  
  return (
    <Box>
      {isDrawer ? (
        // Mobile view: Tabs at the bottom + Drawer
        <>
          <Flex 
            position="fixed" 
            bottom={0} 
            left={0} 
            right={0} 
            borderTopWidth="1px" 
            borderColor={borderColor}
            bg={bgColor}
            zIndex={10}
          >
            <Tabs 
              variant="soft-rounded" 
              colorScheme="brand" 
              index={activeTab} 
              onChange={handleTabChange}
              isFitted
              width="100%"
            >
              <TabList p={2}>
                <Tab><Icon as={MdHistory} /></Tab>
                <Tab><Icon as={MdCollections} /></Tab>
                <Tab><Icon as={MdAutoAwesome} /></Tab>
                <Tab><Icon as={MdInsights} /></Tab>
              </TabList>
            </Tabs>
          </Flex>
          
          <Drawer
            isOpen={isOpen}
            placement="bottom"
            onClose={onClose}
            size="full"
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              
              <Tabs index={activeTab} variant="unstyled">
                {dashboardContent}
              </Tabs>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        // Desktop view: Side tabs + content
        <Grid templateColumns="auto 1fr" gap={0} borderWidth="1px" borderColor={borderColor} borderRadius="lg">
          <GridItem>
            <Tabs 
              orientation="vertical" 
              variant="line" 
              colorScheme="brand" 
              index={activeTab} 
              onChange={setActiveTab}
              height="100%"
              borderRightWidth="1px"
              borderColor={borderColor}
            >
              <TabList minW="180px">
                <Tab justifyContent="flex-start" py={4}>
                  <Icon as={MdHistory} mr={2} />
                  <Text>History</Text>
                </Tab>
                <Tab justifyContent="flex-start" py={4}>
                  <Icon as={MdCollections} mr={2} />
                  <Text>Templates</Text>
                </Tab>
                <Tab justifyContent="flex-start" py={4}>
                  <Icon as={MdAutoAwesome} mr={2} />
                  <Text>Suggestions</Text>
                </Tab>
                <Tab justifyContent="flex-start" py={4}>
                  <Icon as={MdInsights} mr={2} />
                  <Text>Insights</Text>
                </Tab>
              </TabList>
            </Tabs>
          </GridItem>
          
          <GridItem>
            <Tabs index={activeTab} variant="unstyled">
              {dashboardContent}
            </Tabs>
          </GridItem>
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;