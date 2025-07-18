/**
 * Secure Claude service for AI-powered playlist generation
 * Uses environment variables for API key - never hardcoded
 */

import Anthropic from '@anthropic-ai/sdk';
import { config } from './config';

export interface PlaylistSuggestion {
  name: string;
  description: string;
  searchQueries: string[];
  mood?: string;
  genre?: string;
}

export class ClaudeService {
  private claude: Anthropic;

  constructor() {
    this.claude = new Anthropic({
      apiKey: config.claude.apiKey,
    });
  }

  /**
   * Generate playlist suggestions based on user prompt
   */
  async generatePlaylistSuggestion(prompt: string): Promise<PlaylistSuggestion> {
    try {
      const message = await this.claude.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `Create a Spotify playlist based on this request: "${prompt}"

Please respond with a JSON object containing:
- name: A creative playlist name (max 50 characters)
- description: A brief description of the playlist
- searchQueries: An array of 10-15 search terms that would find good songs for this playlist
- mood: The overall mood/vibe
- genre: Primary genre(s)

Focus on specific song titles, artist names, or musical characteristics that would match the request.

Example format:
{
  "name": "Cozy Rainy Day Vibes",
  "description": "Perfect acoustic songs for a peaceful rainy afternoon",
  "searchQueries": ["bon iver skinny love", "iron wine boy with a coin", "acoustic folk", "indie folk rain", "norah jones"],
  "mood": "peaceful, contemplative",
  "genre": "acoustic folk, indie"
}`,
          },
        ],
      });

      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response format from Claude');
      }

      // Parse the JSON response
      const suggestion = JSON.parse(content.text);
      
      // Validate the response structure
      if (!suggestion.name || !suggestion.description || !Array.isArray(suggestion.searchQueries)) {
        throw new Error('Invalid response format from Claude');
      }

      return suggestion;
    } catch (error) {
      console.error('Error generating playlist suggestion:', error);
      throw new Error('Failed to generate playlist suggestion');
    }
  }

  /**
   * Refine search queries based on found tracks
   */
  async refineSearchQueries(
    originalPrompt: string,
    foundTracks: any[],
    additionalContext?: string
  ): Promise<string[]> {
    try {
      const trackList = foundTracks.map(track => 
        `${track.name} by ${track.artists.map((a: any) => a.name).join(', ')}`
      ).slice(0, 10).join('\n');

      const message = await this.claude.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: `I'm building a playlist based on: "${originalPrompt}"

So far I found these tracks:
${trackList}

${additionalContext ? `Additional context: ${additionalContext}` : ''}

Please suggest 8-10 new search queries to find more songs that would fit this playlist. Focus on:
- Similar artists or songs
- Related genres or subgenres  
- Specific musical characteristics
- Songs that complement the existing tracks

Return as a simple JSON array of strings, like:
["search query 1", "search query 2", "search query 3"]`,
          },
        ],
      });

      const content = message.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response format from Claude');
      }

      const queries = JSON.parse(content.text);
      
      if (!Array.isArray(queries)) {
        throw new Error('Invalid response format from Claude');
      }

      return queries;
    } catch (error) {
      console.error('Error refining search queries:', error);
      throw new Error('Failed to refine search queries');
    }
  }
}

export const claudeService = new ClaudeService();
