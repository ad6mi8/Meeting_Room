/**
 * Authentication Manager - OTP-based Authentication
 * 
 * Privacy-first approach:
 * - OTPs stored in memory only
 * - Expire after 10 minutes
 * - No permanent user storage
 * - Tokens expire after 24 hours
 */

const crypto = require('crypto');
const nodemailer = require('nodemailer');

class AuthManager {
  constructor() {
    // In-memory OTP storage: Map<email, {otp, expiresAt}>
    this.otps = new Map();
    
    // In-memory token storage: Set<token>
    this.tokens = new Set();
    
    // Email transporter (configured for development)
    // In production, configure with real SMTP credentials
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
        pass: process.env.SMTP_PASS || 'ethereal.pass'
      }
    });

    // Cleanup expired OTPs every 5 minutes
    setInterval(() => {
      this.cleanupExpiredOTPs();
    }, 5 * 60 * 1000);
  }

  /**
   * Generate a 6-digit OTP
   */
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send OTP to email
   * In development, logs OTP to console
   */
  async sendOTP(email) {
    const otp = this.generateOTP();
    const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes

    this.otps.set(email, { otp, expiresAt });

    // In development, log OTP to console
    // In production, send via email
    if (process.env.NODE_ENV === 'production') {
      try {
        await this.transporter.sendMail({
          from: process.env.SMTP_FROM || 'noreply@securemeeting.com',
          to: email,
          subject: 'Your Secure Meeting Room OTP',
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 20px;">
              <h2>Your One-Time Password</h2>
              <p>Your OTP code is: <strong style="font-size: 24px; letter-spacing: 4px;">${otp}</strong></p>
              <p>This code will expire in 10 minutes.</p>
              <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
            </div>
          `
        });
      } catch (error) {
        console.error('Email send error:', error);
        throw new Error('Failed to send OTP email');
      }
    } else {
      // Development mode: log to console
      console.log(`\n📧 OTP for ${email}: ${otp}\n`);
    }

    return otp;
  }

  /**
   * Verify OTP and generate authentication token
   */
  verifyOTP(email, otp) {
    const stored = this.otps.get(email);

    if (!stored) {
      throw new Error('OTP not found or expired');
    }

    if (Date.now() > stored.expiresAt) {
      this.otps.delete(email);
      throw new Error('OTP expired');
    }

    if (stored.otp !== otp) {
      throw new Error('Invalid OTP');
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    this.tokens.add(token);

    // Remove used OTP
    this.otps.delete(email);

    // Set token expiration (24 hours)
    setTimeout(() => {
      this.tokens.delete(token);
    }, 24 * 60 * 60 * 1000);

    return token;
  }

  /**
   * Check if token is valid
   */
  isAuthenticated(token) {
    return this.tokens.has(token);
  }

  /**
   * Cleanup expired OTPs
   */
  cleanupExpiredOTPs() {
    const now = Date.now();
    const expiredEmails = [];

    this.otps.forEach((data, email) => {
      if (now > data.expiresAt) {
        expiredEmails.push(email);
      }
    });

    expiredEmails.forEach(email => {
      this.otps.delete(email);
    });
  }
}

module.exports = AuthManager;
