/**
 * Secure configuration management for Claude x Spotify app
 * All sensitive data is loaded from environment variables
 */

interface Config {
  spotify: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  };
  claude: {
    apiKey: string;
  };
  app: {
    url: string;
    nodeEnv: string;
  };
}

function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getOptionalEnvVar(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

export const config: Config = {
  spotify: {
    clientId: getRequiredEnvVar('SPOTIFY_CLIENT_ID'),
    clientSecret: getRequiredEnvVar('SPOTIFY_CLIENT_SECRET'),
    redirectUri: getRequiredEnvVar('SPOTIFY_REDIRECT_URI'),
  },
  claude: {
    apiKey: getRequiredEnvVar('CLAUDE_API_KEY'),
  },
  app: {
    url: getOptionalEnvVar('APP_URL', 'http://localhost:3000'),
    nodeEnv: getOptionalEnvVar('NODE_ENV', 'development'),
  },
};

/**
 * Validates that all required environment variables are present
 * Call this at app startup to fail fast if config is incomplete
 */
export function validateConfig(): void {
  try {
    // This will throw if any required env vars are missing
    config.spotify.clientId;
    config.spotify.clientSecret;
    config.spotify.redirectUri;
    config.claude.apiKey;
    
    console.log('✅ Configuration validated successfully');
  } catch (error) {
    console.error('❌ Configuration validation failed:', error);
    process.exit(1);
  }
}

/**
 * Returns a safe config object for client-side use
 * Excludes all sensitive server-side values
 */
export function getClientConfig() {
  return {
    app: {
      url: config.app.url,
      nodeEnv: config.app.nodeEnv,
    },
    spotify: {
      // Only client ID is safe to expose client-side
      clientId: config.spotify.clientId,
      redirectUri: config.spotify.redirectUri,
    },
  };
}
