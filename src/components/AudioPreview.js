import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Flex,
  IconButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useColorModeValue,
  Badge,
  Tooltip,
} from '@chakra-ui/react';
import { MdPlayArrow, MdPause, MdVolumeUp, MdVolumeMute } from 'react-icons/md';

const AudioPreview = ({ prompt }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30); // Default to 30 seconds
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [visualizerData, setVisualizerData] = useState([]);
  
  const timerRef = useRef(null);
  const visualizerRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasCtxRef = useRef(null);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const trackBg = useColorModeValue('gray.100', 'gray.600');
  const trackFilled = useColorModeValue('brand.500', 'brand.200');
  
  useEffect(() => {
    // Initialize canvas for visualization
    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext('2d');
      initializeVisualizer();
    }
    
    return () => {
      // Clean up timer and visualizer when component unmounts
      clearInterval(timerRef.current);
      cancelAnimationFrame(visualizerRef.current);
    };
  }, []);
  
  useEffect(() => {
    // Reset when prompt changes
    setIsPlaying(false);
    setCurrentTime(0);
    setVisualizerData([]);
    clearInterval(timerRef.current);
    cancelAnimationFrame(visualizerRef.current);
  }, [prompt]);
  
  // Initialize visualizer with random data
  const initializeVisualizer = () => {
    const generateData = () => {
      const barCount = 50;
      return Array.from({ length: barCount }, () => Math.random() * 0.5);
    };
    
    setVisualizerData(generateData());
  };
  
  // Play/pause the audio preview
  const togglePlay = () => {
    if (!prompt) return;
    
    if (isPlaying) {
      // Pause the audio
      clearInterval(timerRef.current);
      setIsPlaying(false);
      cancelAnimationFrame(visualizerRef.current);
    } else {
      // Play the audio
      setIsPlaying(true);
      
      // Update current time every second
      timerRef.current = setInterval(() => {
        setCurrentTime(prevTime => {
          const newTime = prevTime + 1;
          if (newTime >= duration) {
            clearInterval(timerRef.current);
            setIsPlaying(false);
            setCurrentTime(0);
            return 0;
          }
          return newTime;
        });
      }, 1000);
      
      // Start the visualizer animation
      animateVisualizer();
    }
  };
  
  // Animate the audio visualizer
  const animateVisualizer = () => {
    if (!canvasRef.current || !canvasCtxRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvasCtxRef.current;
    const width = canvas.width;
    const height = canvas.height;
    
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Only animate when playing
      if (isPlaying) {
        // Update visualizer data with slight random changes
        setVisualizerData(prevData => {
          return prevData.map(value => {
            const newValue = value + (Math.random() * 0.1 - 0.05);
            return Math.max(0.1, Math.min(0.9, newValue));
          });
        });
        
        // Draw the bars
        const barWidth = width / visualizerData.length;
        visualizerData.forEach((value, index) => {
          const barHeight = value * height;
          const x = index * barWidth;
          const y = height - barHeight;
          
          const gradient = ctx.createLinearGradient(0, y, 0, height);
          gradient.addColorStop(0, '#805AD5');
          gradient.addColorStop(1, '#553C9A');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(x, y, barWidth - 1, barHeight);
        });
        
        visualizerRef.current = requestAnimationFrame(render);
      }
    };
    
    visualizerRef.current = requestAnimationFrame(render);
  };
  
  // Toggle mute/unmute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Handle time change from slider
  const handleTimeChange = (value) => {
    setCurrentTime(value);
  };
  
  // Handle volume change
  const handleVolumeChange = (value) => {
    setVolume(value);
    if (value > 0 && isMuted) {
      setIsMuted(false);
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
        <Flex justify="space-between" align="center">
          <Heading as="h2" size="md">
            Audio Preview
          </Heading>
          <Badge colorScheme="purple" variant="subtle">
            Experimental
          </Badge>
        </Flex>
        
        <Text fontSize="sm" color="gray.600">
          Visualize how your music might sound based on the prompt elements.
          This is a simulation and doesn't generate actual audio.
        </Text>
        
        {prompt ? (
          <>
            {/* Visualizer Canvas */}
            <Box 
              borderRadius="md" 
              borderWidth="1px" 
              borderColor={borderColor} 
              overflow="hidden"
              height="100px"
              position="relative"
            >
              <canvas 
                ref={canvasRef} 
                width="600" 
                height="100" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'block' 
                }}
              />
              
              {!isPlaying && (
                <Box 
                  position="absolute" 
                  top="0" 
                  left="0" 
                  width="100%" 
                  height="100%" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center" 
                  bg="blackAlpha.300" 
                  borderRadius="md"
                >
                  <IconButton
                    aria-label="Play audio"
                    icon={<MdPlayArrow />}
                    colorScheme="brand"
                    size="lg"
                    isRound
                    onClick={togglePlay}
                  />
                </Box>
              )}
            </Box>
            
            {/* Playback controls */}
            <VStack spacing={2}>
              <Flex w="100%" align="center">
                <IconButton
                  aria-label={isPlaying ? "Pause" : "Play"}
                  icon={isPlaying ? <MdPause /> : <MdPlayArrow />}
                  onClick={togglePlay}
                  size="sm"
                  mr={2}
                />
                
                <Text fontSize="xs" width="40px">
                  {formatTime(currentTime)}
                </Text>
                
                <Slider
                  aria-label="track position"
                  value={currentTime}
                  min={0}
                  max={duration}
                  onChange={handleTimeChange}
                  mx={2}
                  flex="1"
                >
                  <SliderTrack bg={trackBg}>
                    <SliderFilledTrack bg={trackFilled} />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
                
                <Text fontSize="xs" width="40px" textAlign="right">
                  {formatTime(duration)}
                </Text>
                
                <Tooltip label={isMuted ? "Unmute" : "Mute"}>
                  <IconButton
                    aria-label={isMuted ? "Unmute" : "Mute"}
                    icon={isMuted ? <MdVolumeMute /> : <MdVolumeUp />}
                    onClick={toggleMute}
                    size="sm"
                    ml={2}
                    variant="ghost"
                  />
                </Tooltip>
                
                <Slider
                  aria-label="volume"
                  value={isMuted ? 0 : volume}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={handleVolumeChange}
                  width="80px"
                  ml={1}
                >
                  <SliderTrack bg={trackBg}>
                    <SliderFilledTrack bg={trackFilled} />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Flex>
            </VStack>
          </>
        ) : (
          <Text color="gray.500">
            Generate a prompt to see an audio visualization preview.
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default AudioPreview;