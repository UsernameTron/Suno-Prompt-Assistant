# Suno AI Prompt Optimization Tool

A web application that helps users create optimized prompts for Suno AI's music generation platform. The application allows users to input natural language descriptions of music and converts them into properly formatted Suno AI prompts.

## Features

- Natural language processing for music descriptions
- Voice input capability for hands-free prompt creation
- Real-time prompt validation and optimization
- Interactive prompt builder with component-specific formatting
- Dashboard with history, favorites, templates, and insights
- Audio visualization preview of your music prompt
- AI-powered suggestions for prompt improvement
- Template gallery with pre-configured music styles
- Analytics and user insights
- Advanced export options and shareable links
- Direct integration with Suno AI

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd suno-prompt-tool
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   NODE_ENV=development
   PORT=3000
   REACT_APP_API_URL=http://localhost:3001
   REACT_APP_SUNO_URL=https://suno.ai
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

This will start both the React frontend and the Express backend in development mode.

## Usage

1. Enter a natural language description of the music you want to create (type or use voice input)
2. Use the structured prompt builder to refine the components
3. Access the Dashboard to:
   - Browse and apply templates for different music styles
   - View AI-powered suggestions to improve your prompt
   - Access your history and favorite prompts
   - View analytics about your music creation patterns
4. Preview how your prompt might sound using the audio visualization tool
5. Export your prompt:
   - Copy to clipboard
   - Generate a shareable link
   - Export directly to Suno AI
6. Save your favorite prompts for future use

## Built With

- React - Frontend framework
- Chakra UI - Component library
- Express - Backend server
- Node.js - Runtime environment

## Deployment

The application is set up for deployment on Netlify. The `netlify.toml` file contains the configuration for deployment.

To deploy manually:
```bash
npm run build
netlify deploy --prod
```

## License

This project is licensed under the MIT License

## Acknowledgments

- Suno AI for their amazing music generation platform
- All contributors to this project