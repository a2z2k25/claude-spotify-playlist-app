# Security Guidelines

## Credential Management

### Environment Variables
- **NEVER** commit API keys or secrets to version control
- Use `.env` files for local development (already in `.gitignore`)
- Use platform-specific environment variable management for production (Vercel, Netlify, etc.)

### API Key Rotation
- Rotate Spotify client secrets every 90 days
- Rotate Claude API keys every 90 days
- Monitor API usage for unusual patterns

## Code Security

### Server-Side Only
Keep these operations server-side only:
- Claude API calls (contains API key)
- Spotify client secret operations
- User token storage/management

### Client-Side Safe
These can be exposed client-side:
- Spotify client ID
- App configuration (non-sensitive)
- Public callback URLs

## Deployment Security

### Production Checklist
- [ ] Environment variables configured on hosting platform
- [ ] `.env` files not included in build
- [ ] Security headers configured (already in `next.config.js`)
- [ ] HTTPS enforced
- [ ] Callback URLs allowlisted in Spotify app settings

### Monitoring
- Monitor API usage quotas
- Log authentication failures
- Track unusual playlist creation patterns

## User Data Privacy

### Spotify Data
- Only request necessary scopes
- Don't store user tokens longer than needed
- Respect user privacy preferences

### Claude Integration
- Don't send personally identifiable information to Claude
- Sanitize user inputs before sending to AI

## Development Best Practices

1. **Use the config system** in `src/lib/config.ts`
2. **Validate environment variables** at startup
3. **Use TypeScript** for type safety
4. **Handle errors gracefully** with user-friendly messages
5. **Log security events** for monitoring
