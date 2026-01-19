# Security Considerations

## Privacy-First Architecture

This application is designed with privacy as the core principle. The following security measures are implemented:

## Data Storage

### In-Memory Only
- All meeting data stored in JavaScript Maps/Objects
- No database (MongoDB, SQL, Firebase, etc.)
- Data destroyed when:
  - Meeting ends
  - Server restarts
  - Meeting expires (2 hours)

### No Persistent Storage
- No user profiles
- No chat history
- No recordings
- No logs
- No analytics

## Authentication

### OTP System
- 6-digit one-time passwords
- Expires after 10 minutes
- Stored in memory only
- No permanent user accounts

### Token Management
- JWT-like tokens (32-byte hex strings)
- Stored in browser localStorage
- Expires after 24 hours
- No server-side session storage

## Communication Security

### WebRTC
- Peer-to-peer encrypted communication
- End-to-end encryption (DTLS/SRTP)
- No media relay through server
- STUN servers for NAT traversal

### WebSocket
- Secure WebSocket (WSS) recommended for production
- Socket.io with CORS restrictions
- Authentication required for meeting operations

## Network Security

### CORS
- Restricted to configured client URL
- Credentials enabled for authenticated requests

### Rate Limiting
- Not implemented (recommended for production)
- Consider adding rate limits for:
  - OTP requests
  - Meeting creation
  - Join attempts

## Input Validation

### Current Implementation
- Basic email validation
- Meeting ID/password validation
- OTP format validation

### Recommendations
- Add comprehensive input sanitization
- Implement length limits
- Add regex validation for all inputs
- Prevent injection attacks

## Production Checklist

- [ ] Use HTTPS/WSS for all connections
- [ ] Configure real SMTP server for OTP emails
- [ ] Add rate limiting middleware
- [ ] Implement comprehensive error handling
- [ ] Add TURN servers for WebRTC
- [ ] Configure proper CORS origins
- [ ] Use environment variables for secrets
- [ ] Implement request logging (without sensitive data)
- [ ] Add monitoring/alerting (privacy-preserving)
- [ ] Regular security audits

## Known Limitations

1. **STUN Only**: Currently uses free Google STUN servers. For production, add TURN servers for better connectivity.

2. **No Rate Limiting**: OTP and meeting creation endpoints are not rate-limited. Add rate limiting in production.

3. **Email Security**: In development, OTPs are logged to console. In production, ensure secure email delivery.

4. **Token Storage**: Tokens stored in localStorage are accessible via XSS. Consider httpOnly cookies for production.

5. **No Content Security Policy**: Add CSP headers to prevent XSS attacks.

6. **No HTTPS Enforcement**: Ensure HTTPS is enforced in production.

## Privacy Guarantees

✅ **Zero Data Collection**: No analytics, tracking, or data collection
✅ **No Cookies**: No tracking cookies or third-party cookies
✅ **No Logs**: No server-side logging of user activity
✅ **No Storage**: No persistent storage of any kind
✅ **Ephemeral**: All data destroyed when meeting ends

## Reporting Security Issues

If you discover a security vulnerability, please:
1. Do not create a public issue
2. Contact the maintainers privately
3. Provide detailed information about the vulnerability
4. Allow time for a fix before public disclosure

---

**Remember**: This is a privacy-first application. Any changes should maintain these core principles.
