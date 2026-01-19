#!/bin/bash

# GitHub Setup Script for Secure Meeting Room
# This script helps you push your code to GitHub

echo "🚀 Secure Meeting Room - GitHub Setup"
echo "======================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    echo "✓ Git repository initialized"
else
    echo "✓ Git repository already initialized"
fi

# Check if remote exists
if git remote | grep -q "^origin$"; then
    echo "✓ Remote 'origin' already exists"
    echo "Current remote URL:"
    git remote get-url origin
    echo ""
    read -p "Do you want to change the remote URL? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your GitHub repository URL: " repo_url
        git remote set-url origin "$repo_url"
        echo "✓ Remote URL updated"
    fi
else
    echo ""
    read -p "Enter your GitHub repository URL (e.g., https://github.com/username/Meeting_Room.git): " repo_url
    git remote add origin "$repo_url"
    echo "✓ Remote added"
fi

# Add all files
echo ""
echo "📝 Adding files to git..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "✓ No changes to commit"
else
    echo "✓ Files staged"
    read -p "Enter commit message (or press Enter for default): " commit_msg
    if [ -z "$commit_msg" ]; then
        commit_msg="Initial commit: Privacy-first secure meeting room"
    fi
    git commit -m "$commit_msg"
    echo "✓ Changes committed"
fi

# Push to GitHub
echo ""
echo "📤 Pushing to GitHub..."
read -p "Which branch? (main/master) [main]: " branch
branch=${branch:-main}

# Create branch if it doesn't exist
git checkout -b "$branch" 2>/dev/null || git checkout "$branch"

# Push
if git push -u origin "$branch"; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "Next steps:"
    echo "1. Go to your repository on GitHub"
    echo "2. Settings → Pages → Source: GitHub Actions"
    echo "3. Settings → Secrets → Add REACT_APP_API_URL and REACT_APP_SOCKET_URL"
    echo "4. Deploy your backend separately (see DEPLOYMENT.md)"
    echo ""
    echo "📖 See GITHUB_SETUP.md for detailed instructions"
else
    echo ""
    echo "❌ Failed to push. Please check:"
    echo "  - GitHub repository exists"
    echo "  - You have push permissions"
    echo "  - Remote URL is correct"
fi
