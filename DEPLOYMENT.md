# Deployment Guide

This guide covers deploying the Secure Meeting Room application to various platforms.

## Table of Contents

1. [GitHub Pages (Frontend Only)](#github-pages-frontend-only)
2. [Vercel (Full Stack)](#vercel-full-stack)
3. [Netlify (Full Stack)](#netlify-full-stack)
4. [Heroku (Backend)](#heroku-backend)
5. [Railway (Full Stack)](#railway-full-stack)
6. [Manual Deployment](#manual-deployment)

---

## GitHub Pages (Frontend Only)

**Note**: GitHub Pages only hosts static files. You'll need to deploy the backend separately.

### Steps:

1. **Enable GitHub Pages**:
   - Go to your repository Settings → Pages
   - Select source: "GitHub Actions"

2. **Set up GitHub Secrets** (Settings → Secrets → Actions):
   - `REACT_APP_API_URL`: Your backend API URL
   - `REACT_APP_SOCKET_URL`: Your backend WebSocket URL

3. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

4. **The workflow will automatically deploy** your frontend to GitHub Pages

5. **Update `client/public/index.html`** base tag if needed:
   ```html
   <base href="/your-repo-name/" />
   ```

---

## Vercel (Full Stack)

Vercel supports both frontend and serverless functions.

### Frontend Deployment:

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy frontend**:
   ```bash
   cd client
   vercel
   ```

3. **Set environment variables** in Vercel dashboard:
   - `REACT_APP_API_URL`: Your backend URL
   - `REACT_APP_SOCKET_URL`: Your backend WebSocket URL

### Backend Deployment (Serverless):

1. **Create `api/` directory** in root:
   ```bash
   mkdir api
   ```

2. **Create `vercel.json`**:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server/index.js",
         "use": "@vercel/node"
       },
       {
         "src": "client/package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "build"
         }
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "server/index.js"
       },
       {
         "src": "/(.*)",
         "dest": "client/$1"
       }
     ]
   }
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

---

## Netlify (Full Stack)

### Option 1: Frontend Only

1. **Build command**: `cd client && npm install && npm run build`
2. **Publish directory**: `client/build`
3. **Environment variables**:
   - `REACT_APP_API_URL`: Your backend URL
   - `REACT_APP_SOCKET_URL`: Your backend WebSocket URL

### Option 2: Full Stack with Netlify Functions

1. **Create `netlify.toml`**:
   ```toml
   [build]
     command = "cd client && npm install && npm run build"
     publish = "client/build"

   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200
   ```

2. **Create `netlify/functions/server.js`** (adapt your Express server)

---

## Heroku (Backend)

### Deploy Backend:

1. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   ```

2. **Login**:
   ```bash
   heroku login
   ```

3. **Create Heroku app**:
   ```bash
   heroku create your-app-name
   ```

4. **Create `Procfile`**:
   ```
   web: node server/index.js
   ```

5. **Set environment variables**:
   ```bash
   heroku config:set CLIENT_URL=https://your-frontend-url.vercel.app
   heroku config:set NODE_ENV=production
   heroku config:set SMTP_HOST=your-smtp-host
   heroku config:set SMTP_USER=your-email
   heroku config:set SMTP_PASS=your-password
   ```

6. **Deploy**:
   ```bash
   git push heroku main
   ```

---

## Railway (Full Stack)

Railway supports both frontend and backend.

### Steps:

1. **Connect GitHub repository** to Railway
2. **Create two services**:
   - **Backend Service**:
     - Root directory: `/`
     - Start command: `node server/index.js`
     - Port: `5000`
     - Environment variables:
       - `CLIENT_URL`: Your frontend URL
       - `NODE_ENV`: `production`
   
   - **Frontend Service**:
     - Root directory: `/client`
     - Build command: `npm install && npm run build`
     - Start command: `npx serve -s build`
     - Port: `3000`
     - Environment variables:
       - `REACT_APP_API_URL`: Backend service URL
       - `REACT_APP_SOCKET_URL`: Backend service URL

3. **Deploy**: Railway will auto-deploy on push

---

## Manual Deployment

### Backend (VPS/Server):

1. **SSH into your server**
2. **Clone repository**:
   ```bash
   git clone https://github.com/yourusername/Meeting_Room.git
   cd Meeting_Room
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set environment variables**:
   ```bash
   export PORT=5000
   export CLIENT_URL=https://your-frontend-url.com
   export NODE_ENV=production
   ```

5. **Use PM2 for process management**:
   ```bash
   npm install -g pm2
   pm2 start server/index.js --name meeting-room-api
   pm2 save
   pm2 startup
   ```

6. **Set up Nginx reverse proxy** (optional):
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Frontend (Static Hosting):

1. **Build the frontend**:
   ```bash
   cd client
   npm install
   npm run build
   ```

2. **Upload `client/build/`** to your static hosting:
   - AWS S3 + CloudFront
   - Google Cloud Storage
   - Azure Static Web Apps
   - Any static file hosting

---

## Environment Variables Reference

### Backend:
- `PORT`: Server port (default: 5000)
- `CLIENT_URL`: Frontend URL for CORS
- `NODE_ENV`: `production` or `development`
- `SMTP_HOST`: SMTP server hostname
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password
- `SMTP_FROM`: From email address

### Frontend:
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_SOCKET_URL`: Backend WebSocket URL

---

## Recommended Deployment Strategy

**For Production**:

1. **Backend**: Deploy to Heroku, Railway, or VPS
2. **Frontend**: Deploy to Vercel, Netlify, or GitHub Pages
3. **Use HTTPS/WSS**: Essential for WebRTC
4. **Configure CORS**: Match frontend URL exactly
5. **Set up email**: Configure SMTP for OTP delivery
6. **Monitor**: Set up basic monitoring (privacy-preserving)

---

## Troubleshooting

### CORS Errors:
- Ensure `CLIENT_URL` matches your frontend URL exactly
- Check for trailing slashes
- Verify HTTPS/WSS in production

### WebRTC Not Working:
- HTTPS is required for WebRTC in production
- Check browser console for errors
- Verify STUN/TURN server configuration

### Socket.io Connection Issues:
- Ensure WebSocket URL is correct
- Check firewall settings
- Verify CORS configuration

### Build Failures:
- Check Node.js version (18+)
- Clear `node_modules` and reinstall
- Verify all environment variables are set

---

## Security Checklist for Production

- [ ] Use HTTPS/WSS for all connections
- [ ] Configure proper CORS origins
- [ ] Set up real SMTP for OTP emails
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Add TURN servers for WebRTC
- [ ] Implement proper error handling
- [ ] Set up monitoring (privacy-preserving)
- [ ] Regular security updates
- [ ] Backup strategy (if needed)

---

**Note**: Remember this is a privacy-first application. Choose hosting providers that respect privacy and don't collect unnecessary data.
