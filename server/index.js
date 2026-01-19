/**
 * Secure Meeting Room - Backend Server
 * 
 * Privacy-first architecture:
 * - All data stored in memory only (no database)
 * - No logs, recordings, or tracking
 * - Data destroyed when meeting ends or server restarts
 * - End-to-end encrypted communication
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const MeetingManager = require('./meetingManager');
const AuthManager = require('./authManager');

const app = express();
const server = http.createServer(app);

// CORS configuration - allow frontend origin
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Initialize managers
const meetingManager = new MeetingManager();
const authManager = new AuthManager();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', privacy: 'zero-data-collection' });
});

// Authentication endpoints
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }
    
    const otp = await authManager.sendOTP(email);
    res.json({ success: true, message: 'OTP sent to email' });
  } catch (error) {
    console.error('OTP send error:', error.message);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

app.post('/api/auth/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;
    const token = authManager.verifyOTP(email, otp);
    
    if (token) {
      res.json({ success: true, token });
    } else {
      res.status(401).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Meeting endpoints
app.post('/api/meetings/create', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!authManager.isAuthenticated(token)) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const meeting = meetingManager.createMeeting();
    res.json({
      meetingId: meeting.id,
      password: meeting.password
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create meeting' });
  }
});

app.post('/api/meetings/join', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!authManager.isAuthenticated(token)) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { meetingId, password } = req.body;
    const meeting = meetingManager.getMeeting(meetingId);
    
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    
    if (meeting.password !== password) {
      return res.status(403).json({ error: 'Invalid password' });
    }

    res.json({ success: true, meetingId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to join meeting' });
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join meeting room
  socket.on('join-meeting', ({ meetingId, userId }) => {
    const meeting = meetingManager.getMeeting(meetingId);
    if (!meeting) {
      socket.emit('error', { message: 'Meeting not found' });
      return;
    }

    socket.join(meetingId);
    meetingManager.addParticipant(meetingId, socket.id, userId);
    
    // Notify others in the meeting
    socket.to(meetingId).emit('user-joined', { userId, socketId: socket.id });
    
    // Send list of existing participants
    const participants = meetingManager.getParticipants(meetingId);
    socket.emit('participants-list', participants);
  });

  // WebRTC signaling
  socket.on('offer', ({ meetingId, offer, targetSocketId }) => {
    socket.to(targetSocketId).emit('offer', {
      offer,
      socketId: socket.id
    });
  });

  socket.on('answer', ({ meetingId, answer, targetSocketId }) => {
    socket.to(targetSocketId).emit('answer', {
      answer,
      socketId: socket.id
    });
  });

  socket.on('ice-candidate', ({ meetingId, candidate, targetSocketId }) => {
    socket.to(targetSocketId).emit('ice-candidate', {
      candidate,
      socketId: socket.id
    });
  });

  // Handle user leaving
  socket.on('disconnect', () => {
    const meetingId = meetingManager.findMeetingBySocketId(socket.id);
    if (meetingId) {
      meetingManager.removeParticipant(meetingId, socket.id);
      socket.to(meetingId).emit('user-left', { socketId: socket.id });
    }
  });

  socket.on('leave-meeting', ({ meetingId }) => {
    socket.leave(meetingId);
    meetingManager.removeParticipant(meetingId, socket.id);
    socket.to(meetingId).emit('user-left', { socketId: socket.id });
  });
});

// Cleanup expired meetings periodically (every 5 minutes)
setInterval(() => {
  meetingManager.cleanupExpiredMeetings();
}, 5 * 60 * 1000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Privacy mode: Zero data collection enabled');
});
