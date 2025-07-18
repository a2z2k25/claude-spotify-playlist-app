/**
 * Secure Spotify service that handles authentication and API calls
 * Uses environment variables for credentials - never hardcoded
 */

import SpotifyWebApi from 'spotify-web-api-node';
import { config } from './config';

export class SpotifyService {
  private spotify: SpotifyWebApi;

  constructor() {
    this.spotify = new SpotifyWebApi({
      clientId: config.spotify.clientId,
      clientSecret: config.spotify.clientSecret,
      redirectUri: config.spotify.redirectUri,
    });
  }

  /**
   * Get authorization URL for OAuth flow
   */
  getAuthUrl(): string {
    const scopes = [
      'playlist-modify-public',
      'playlist-modify-private',
      'user-library-read',
      'user-read-private',
      'user-read-email',
    ];

    return this.spotify.createAuthorizeURL(scopes, 'spotify-auth-state');
  }

  /**
   * Exchange authorization code for access token
   */
  async getAccessToken(code: string): Promise<string> {
    try {
      const data = await this.spotify.authorizationCodeGrant(code);
      const { access_token, refresh_token } = data.body;
      
      this.spotify.setAccessToken(access_token);
      this.spotify.setRefreshToken(refresh_token);
      
      return access_token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw new Error('Failed to authenticate with Spotify');
    }
  }

  /**
   * Set access token for API calls
   */
  setAccessToken(token: string): void {
    this.spotify.setAccessToken(token);
  }

  /**
   * Create a new playlist
   */
  async createPlaylist(
    userId: string,
    name: string,
    description: string,
    tracks: string[]
  ): Promise<string> {
    try {
      // Create playlist
      const playlist = await this.spotify.createPlaylist(userId, name, {
        description,
        public: false,
      });

      const playlistId = playlist.body.id;

      // Add tracks if provided
      if (tracks.length > 0) {
        await this.spotify.addTracksToPlaylist(playlistId, tracks);
      }

      return playlistId;
    } catch (error) {
      console.error('Error creating playlist:', error);
      throw new Error('Failed to create playlist');
    }
  }

  /**
   * Search for tracks
   */
  async searchTracks(query: string, limit: number = 20): Promise<any[]> {
    try {
      const result = await this.spotify.searchTracks(query, { limit });
      return result.body.tracks?.items || [];
    } catch (error) {
      console.error('Error searching tracks:', error);
      throw new Error('Failed to search tracks');
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(): Promise<any> {
    try {
      const profile = await this.spotify.getMe();
      return profile.body;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw new Error('Failed to get user profile');
    }
  }
}

export const spotifyService = new SpotifyService();
