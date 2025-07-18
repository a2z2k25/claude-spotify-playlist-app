# Claude x Spotify Playlist App

An intelligent playlist generation app that combines Claude's AI capabilities with Spotify's music platform to create personalized playlists based on natural language prompts.

## Features

- 🎵 Generate playlists using Claude AI based on mood, genre, or descriptive prompts
- 🔄 Seamless Spotify integration for playlist creation and management
- 🔒 Secure credential management with environment variables
- 🎨 Clean, intuitive interface for music discovery

## Setup

### Prerequisites

- Node.js 18+ 
- Spotify Premium account
- Anthropic Claude API access

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/claude-spotify-playlist-app.git
cd claude-spotify-playlist-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your API credentials in `.env`:
```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
CLAUDE_API_KEY=your_claude_api_key
```

5. Run the development server:
```bash
npm run dev
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SPOTIFY_CLIENT_ID` | Your Spotify app client ID | ✅ |
| `SPOTIFY_CLIENT_SECRET` | Your Spotify app client secret | ✅ |
| `SPOTIFY_REDIRECT_URI` | OAuth redirect URI | ✅ |
| `CLAUDE_API_KEY` | Anthropic Claude API key | ✅ |

## Security Notes

- Never commit your `.env` file to version control
- Rotate API keys regularly
- Use environment-specific configurations for deployment

## Development

Built with modern web technologies:
- Next.js 14
- TypeScript
- Tailwind CSS
- Spotify Web API
- Anthropic Claude API

## License

MIT License - see LICENSE file for details
