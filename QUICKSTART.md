# Quick Start Guide

Get the Secure Meeting Room application running in 5 minutes.

## Step 1: Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

## Step 2: Start the Application

**Option A: Run both server and client together**
```bash
npm run dev
```

**Option B: Run separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

## Step 3: Access the Application

- Open your browser to: http://localhost:3000
- Backend API runs on: http://localhost:5000

## Step 4: Test the Application

1. **Login**:
   - Click "Create Meeting" or "Join Meeting"
   - Enter your email address
   - Check the console/terminal for the OTP (development mode)
   - Enter the 6-digit OTP

2. **Create a Meeting**:
   - Click "Create Meeting"
   - Copy the Meeting ID and Password
   - Click "Join Meeting" to enter

3. **Join a Meeting**:
   - Enter Meeting ID and Password
   - Grant camera/microphone permissions
   - Start video conferencing!

## Development Notes

- **OTP Delivery**: In development, OTPs are logged to the console/terminal, not emailed
- **No Database**: All data is stored in memory and cleared on server restart
- **Browser Permissions**: You'll need to grant camera/microphone access
- **WebRTC**: Requires modern browser with WebRTC support (Chrome, Firefox, Safari, Edge)

## Troubleshooting

**Port already in use?**
- Change `PORT` in `.env` or `package.json` scripts
- Change React port: `PORT=3001 npm start` in client directory

**OTP not showing?**
- Check the terminal/console where the server is running
- Look for: `📧 OTP for your@email.com: 123456`

**Video not working?**
- Check browser permissions
- Try a different browser
- Ensure HTTPS in production (required for WebRTC)

**Connection issues?**
- Ensure both frontend and backend are running
- Check browser console for errors
- Verify CORS settings match your URLs

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Review [SECURITY.md](SECURITY.md) for security considerations
- Customize styling in `client/src/index.css`
- Configure email in production (see `.env.example`)

Happy secure meeting! 🔒
