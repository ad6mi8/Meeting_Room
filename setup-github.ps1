# GitHub Setup Script for Secure Meeting Room (PowerShell)
# This script helps you push your code to GitHub

Write-Host "🚀 Secure Meeting Room - GitHub Setup" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📦 Initializing git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✓ Git repository already initialized" -ForegroundColor Green
}

# Check if remote exists
$remoteExists = git remote | Select-String -Pattern "^origin$"
if ($remoteExists) {
    Write-Host "✓ Remote 'origin' already exists" -ForegroundColor Green
    Write-Host "Current remote URL:"
    git remote get-url origin
    Write-Host ""
    $changeRemote = Read-Host "Do you want to change the remote URL? (y/n)"
    if ($changeRemote -eq "y" -or $changeRemote -eq "Y") {
        $repoUrl = Read-Host "Enter your GitHub repository URL"
        git remote set-url origin $repoUrl
        Write-Host "✓ Remote URL updated" -ForegroundColor Green
    }
} else {
    Write-Host ""
    $repoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/username/Meeting_Room.git)"
    git remote add origin $repoUrl
    Write-Host "✓ Remote added" -ForegroundColor Green
}

# Add all files
Write-Host ""
Write-Host "📝 Adding files to git..." -ForegroundColor Yellow
git add .

# Check if there are changes to commit
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "✓ No changes to commit" -ForegroundColor Green
} else {
    Write-Host "✓ Files staged" -ForegroundColor Green
    $commitMsg = Read-Host "Enter commit message (or press Enter for default)"
    if ([string]::IsNullOrWhiteSpace($commitMsg)) {
        $commitMsg = "Initial commit: Privacy-first secure meeting room"
    }
    git commit -m $commitMsg
    Write-Host "✓ Changes committed" -ForegroundColor Green
}

# Push to GitHub
Write-Host ""
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
$branch = Read-Host "Which branch? (main/master) [main]"
if ([string]::IsNullOrWhiteSpace($branch)) {
    $branch = "main"
}

# Create branch if it doesn't exist
git checkout -b $branch 2>$null
if ($LASTEXITCODE -ne 0) {
    git checkout $branch
}

# Push
git push -u origin $branch
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Go to your repository on GitHub"
    Write-Host "2. Settings → Pages → Source: GitHub Actions"
    Write-Host "3. Settings → Secrets → Add REACT_APP_API_URL and REACT_APP_SOCKET_URL"
    Write-Host "4. Deploy your backend separately (see DEPLOYMENT.md)"
    Write-Host ""
    Write-Host "📖 See GITHUB_SETUP.md for detailed instructions" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Failed to push. Please check:" -ForegroundColor Red
    Write-Host "  - GitHub repository exists"
    Write-Host "  - You have push permissions"
    Write-Host "  - Remote URL is correct"
}
