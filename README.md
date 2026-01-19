# Secure Meeting Room

A privacy-first web application for secure online meetings. Built with zero data collection, in-memory storage, and end-to-end encrypted communication.

## 🎯 Core Principles

- **Zero Data Collection**: No tracking, analytics, cookies, or third-party services
- **In-Memory Only**: All data exists only in RAM and is destroyed when meetings end
- **No Database**: No MongoDB, SQL, Firebase, or any persistent storage
- **Privacy First**: End-to-end encrypted peer-to-peer communication
- **Apple-Inspired Design**: Clean, minimal UI with black & white color palette

## 🏗️ Architecture

### Backend
- **Node.js + Express**: RESTful API server
- **Socket.io**: Real-time WebSocket communication for WebRTC signaling
- **In-Memory Storage**: JavaScript Maps and Objects (no database)
- **OTP Authentication**: Email-based one-time password system

### Frontend
- **React**: Modern UI framework
- **React Router**: Client-side routing
- **WebRTC**: Peer-to-peer video/audio communication
- **Socket.io Client**: Real-time signaling

## 📁 Project Structure

```
Meeting_Room/
├── server/
│   ├── index.js           # Express server & Socket.io setup
│   ├── meetingManager.js  # In-memory meeting storage
│   └── authManager.js     # OTP authentication system
├── client/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── contexts/      # React context providers
│       ├── pages/         # Page components
│       ├── utils/         # Utility functions
│       └── App.js         # Main app component
├── package.json
└── README.md
```

## 🚀 Quick Start

### Local Development

See [QUICKSTART.md](QUICKSTART.md) for detailed local setup instructions.

### Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment guides including:
- GitHub Pages
- Vercel
- Netlify
- Heroku
- Railway
- Manual deployment

## 🚀 Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- Modern web browser with WebRTC support

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd Meeting_Room
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Configure environment variables (optional)**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   CLIENT_URL=http://localhost:3000
   NODE_ENV=development
   
   # For production email (optional)
   SMTP_HOST=smtp.example.com
   SMTP_USER=your-email@example.com
   SMTP_PASS=your-password
   SMTP_FROM=noreply@securemeeting.com
   ```

### Running the Application

**Development Mode (runs both server and client):**
```bash
npm run dev
```

**Or run separately:**

Terminal 1 - Backend:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔐 Authentication Flow

1. User enters email address
2. System generates 6-digit OTP and sends via email (or logs to console in dev mode)
3. User enters OTP to verify
4. System generates authentication token (stored in browser localStorage)
5. Token expires after 24 hours

**Note**: In development mode, OTPs are logged to the console instead of being emailed.

## 🎥 Meeting Flow

1. **Create Meeting**:
   - Authenticated user clicks "Create Meeting"
   - System generates unique Meeting ID and Password
   - User can copy credentials and share with participants

2. **Join Meeting**:
   - Authenticated user enters Meeting ID and Password
   - System validates credentials
   - User joins the meeting room

3. **Meeting Room**:
   - WebRTC peer-to-peer connections established
   - Video/audio streams shared between participants
   - All data exists only in memory
   - Meeting ends when all participants leave

## 🔒 Security Considerations

### Data Privacy
- ✅ No database storage - all data in memory only
- ✅ No logs or recordings
- ✅ No user tracking or analytics
- ✅ Meetings auto-expire after 2 hours
- ✅ Empty meetings deleted after 5 minutes

### Authentication
- ✅ OTP expires after 10 minutes
- ✅ Tokens expire after 24 hours
- ✅ No permanent user profiles stored

### Communication
- ✅ WebRTC peer-to-peer encryption
- ✅ STUN servers for NAT traversal
- ✅ Secure WebSocket connections (WSS in production)

### Production Recommendations
1. **Use HTTPS/WSS**: Deploy with SSL certificates
2. **Configure Real SMTP**: Set up email service for OTP delivery
3. **Environment Variables**: Never commit secrets to version control
4. **Rate Limiting**: Add rate limiting to prevent abuse
5. **CORS Configuration**: Restrict CORS to your domain
6. **TURN Servers**: Add TURN servers for better connectivity
7. **Input Validation**: Enhance validation on all inputs
8. **Error Handling**: Implement comprehensive error handling

## 🎨 Design Philosophy

- **Apple-Inspired**: Clean typography, large spacing, subtle shadows
- **Black & White Only**: Strict monochrome color palette
- **Minimal UI**: Focus on essential features only
- **Smooth Animations**: Micro-interactions for better UX
- **Responsive**: Works beautifully on desktop, tablet, and mobile

## 📱 Features

- ✅ Email + OTP authentication
- ✅ Create secure meetings with unique IDs
- ✅ Join meetings with ID + password
- ✅ Real-time video/audio communication
- ✅ Mute/unmute audio
- ✅ Turn camera on/off
- ✅ Responsive design
- ✅ Zero data persistence

## 🛠️ Technology Stack

### Backend
- Express.js
- Socket.io
- Node.js crypto (for secure IDs)
- Nodemailer (for OTP emails)

### Frontend
- React 18
- React Router v6
- Socket.io-client
- WebRTC API

## 📝 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP and get token

### Meetings
- `POST /api/meetings/create` - Create new meeting (requires auth)
- `POST /api/meetings/join` - Join existing meeting (requires auth)

### WebSocket Events
- `join-meeting` - Join a meeting room
- `offer` - WebRTC offer
- `answer` - WebRTC answer
- `ice-candidate` - ICE candidate exchange
- `leave-meeting` - Leave meeting room

## 🐛 Troubleshooting

### OTP not received
- Check console logs (development mode)
- Verify email configuration (production)
- Check spam folder

### Video/Audio not working
- Grant browser permissions for camera/microphone
- Check browser WebRTC support
- Verify firewall/NAT settings

### Connection issues
- Ensure both frontend and backend are running
- Check CORS configuration
- Verify Socket.io connection

## 📄 License

MIT License - Feel free to use and modify as needed.

## 🤝 Contributing

This is a privacy-first application. Any contributions should maintain the core principles:
- No data collection
- No persistent storage
- Privacy-first architecture

## 📦 Deployment

This application can be deployed to various platforms:

- **GitHub Pages**: Frontend only (backend needs separate hosting)
- **Vercel**: Full stack deployment
- **Netlify**: Frontend + Functions
- **Heroku**: Backend hosting
- **Railway**: Full stack deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to GitHub Pages

1. Push your code to GitHub
2. Go to Settings → Pages → Source: GitHub Actions
3. Set GitHub Secrets:
   - `REACT_APP_API_URL`: Your backend URL
   - `REACT_APP_SOCKET_URL`: Your backend WebSocket URL
4. Push to `main` branch - deployment happens automatically

See [GITHUB_SETUP.md](GITHUB_SETUP.md) for step-by-step GitHub deployment guide.

## ⚠️ Important Notes

- **Development Only**: This application is designed for development/testing
- **No Production Data**: Never store sensitive data
- **Browser Permissions**: Users must grant camera/microphone permissions
- **Network Requirements**: WebRTC requires proper network configuration
- **Meeting Expiration**: Meetings expire after 2 hours of inactivity

---

**Built with privacy in mind. Nothing stored, nothing tracked.**
