# GitHub Deployment Setup Guide

This guide will help you deploy your Secure Meeting Room application to GitHub and set up automated deployments.

## The “automatic in Cursor” way (recommended)

### 1) Connect Cursor to GitHub (one-time)

- In **Cursor**, open the **Source Control** panel.
- Click **Sign in to GitHub** (or **Accounts** → **GitHub**).
- Complete the browser login/authorization flow.

### 2) Install GitHub CLI (one-time)

The fastest fully-automatic repo creation + push uses `gh` (GitHub CLI).

- Install from: `https://cli.github.com/`
- Then in Cursor Terminal run:

```powershell
gh auth login
```

### 3) Publish everything with one command (Windows)

From Cursor’s terminal in the project root:

```powershell
npm run publish:github:ps
```

What it does:
- Creates the GitHub repo (named `Meeting_Room`, private by default)
- Initializes git (if needed)
- Commits (if needed)
- Sets `origin`
- Pushes to `main`

### 4) Auto-deploy the frontend (GitHub Pages)

After the push:
- GitHub repo → **Settings** → **Pages** → **Source: GitHub Actions**
- Repo → **Settings** → **Secrets and variables** → **Actions** → add:
  - `REACT_APP_API_URL`
  - `REACT_APP_SOCKET_URL`

Then every push to `main` auto-builds and deploys the frontend.

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon → "New repository"
3. Name it `Meeting_Room` (or your preferred name)
4. Choose **Public** or **Private**
5. **Don't** initialize with README (we already have one)
6. Click "Create repository"

## Step 2: Initialize Git and Push Code

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Privacy-first secure meeting room"

# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/Meeting_Room.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Set Up GitHub Pages (Frontend)

### Option A: Automatic Deployment via GitHub Actions

1. **Enable GitHub Pages**:
   - Go to your repository → Settings → Pages
   - Under "Source", select **"GitHub Actions"**

2. **Set GitHub Secrets** (for backend URLs):
   - Go to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Add these secrets:
     - Name: `REACT_APP_API_URL`
       Value: `https://your-backend-url.herokuapp.com` (or your backend URL)
     - Name: `REACT_APP_SOCKET_URL`
       Value: `https://your-backend-url.herokuapp.com` (same as above)

3. **Push to trigger deployment**:
   ```bash
   git push origin main
   ```

4. **Check deployment status**:
   - Go to Actions tab in your repository
   - You should see "Deploy Frontend to GitHub Pages" workflow running
   - Once complete, your site will be live at:
     `https://YOUR_USERNAME.github.io/Meeting_Room/`

### Option B: Manual Deployment

1. **Build the frontend**:
   ```bash
   cd client
   npm install
   npm run build
   ```

2. **Deploy build folder**:
   - Go to Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `gh-pages` → `/ (root)`
   - Create `gh-pages` branch:
     ```bash
     git checkout -b gh-pages
     git subtree push --prefix client/build origin gh-pages
     ```

## Step 4: Deploy Backend Separately

Since GitHub Pages only hosts static files, you need to deploy the backend separately. Options:

### Option 1: Heroku (Recommended)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set CLIENT_URL=https://YOUR_USERNAME.github.io/Meeting_Room
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Option 2: Railway

1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Create new service → Select your repository
4. Set root directory to `/`
5. Set start command: `node server/index.js`
6. Add environment variables:
   - `CLIENT_URL`: Your GitHub Pages URL
   - `NODE_ENV`: `production`
7. Deploy automatically on push

### Option 3: Render

1. Go to [Render](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. Settings:
   - Build Command: `npm install`
   - Start Command: `node server/index.js`
   - Environment: `Node`
5. Add environment variables
6. Deploy

## Step 5: Update Frontend URLs

After deploying backend, update GitHub Secrets:

1. Go to Settings → Secrets → Actions
2. Update `REACT_APP_API_URL` with your backend URL
3. Update `REACT_APP_SOCKET_URL` with your backend URL
4. Re-run the deployment workflow or push a new commit

## Step 6: Configure Custom Domain (Optional)

1. **Add CNAME file** to `client/public/CNAME`:
   ```
   yourdomain.com
   ```

2. **Update DNS**:
   - Add CNAME record: `yourdomain.com` → `YOUR_USERNAME.github.io`

3. **Enable custom domain** in GitHub Pages settings

## Step 7: Enable HTTPS (Important for WebRTC)

GitHub Pages automatically provides HTTPS. Ensure:
- Your backend also uses HTTPS/WSS
- Update `REACT_APP_API_URL` and `REACT_APP_SOCKET_URL` to use `https://`

## Troubleshooting

### GitHub Actions Not Running

- Check if workflows are enabled: Settings → Actions → General
- Ensure workflow files are in `.github/workflows/` directory
- Check workflow syntax in Actions tab

### Build Failures

- Check Node.js version (should be 18+)
- Review build logs in Actions tab
- Ensure all environment variables are set

### CORS Errors

- Verify `CLIENT_URL` in backend matches frontend URL exactly
- Check for trailing slashes
- Ensure HTTPS is used in production

### WebRTC Not Working

- HTTPS is required for WebRTC
- Check browser console for errors
- Verify STUN/TURN server configuration

## Continuous Deployment

Once set up, every push to `main` branch will:
1. Run CI checks (`.github/workflows/ci.yml`)
2. Build frontend
3. Deploy to GitHub Pages (`.github/workflows/deploy-frontend.yml`)

## Repository Structure After Setup

```
Meeting_Room/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # CI checks
│       ├── deploy.yml                # General deployment
│       └── deploy-frontend.yml       # GitHub Pages deployment
├── client/
│   └── build/                        # Generated on deploy
├── server/
├── .gitignore
├── README.md
├── DEPLOYMENT.md
└── GITHUB_SETUP.md                   # This file
```

## Next Steps

1. ✅ Code pushed to GitHub
2. ✅ GitHub Pages enabled
3. ✅ Backend deployed (Heroku/Railway/Render)
4. ✅ Environment variables configured
5. ✅ Test the deployed application
6. ✅ Share your meeting room!

## Security Reminders

- Never commit `.env` files
- Use GitHub Secrets for sensitive data
- Enable branch protection rules
- Use HTTPS/WSS in production
- Regularly update dependencies

---

**Your application is now live on GitHub! 🚀**
