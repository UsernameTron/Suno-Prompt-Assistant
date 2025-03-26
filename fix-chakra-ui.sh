#!/bin/bash
# Script to fix Chakra UI compatibility issues

# Replace useColorModeValue imports with useColorMode
find ./src -type f -name "*.js" -exec sed -i '' 's/useColorModeValue,/useColorMode,/g' {} \;
find ./src -type f -name "*.js" -exec sed -i '' 's/import { useColorModeValue } from/import { useColorMode } from/g' {} \;

# Add a log message
echo "Fixed imports in JS files. Make sure to manually check the color mode usage in each file."