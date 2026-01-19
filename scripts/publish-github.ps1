# Publish this project to GitHub (Windows / PowerShell)
# - Creates a GitHub repo (via GitHub CLI "gh")
# - Initializes git (if needed)
# - Commits (if needed)
# - Adds remote origin (if needed)
# - Pushes to main
#
# Usage:
#   pwsh -File .\scripts\publish-github.ps1 -RepoName "Meeting_Room" -Visibility private
#
# Prereqs:
#   - Git installed
#   - GitHub CLI installed: https://cli.github.com/
#   - Logged in: gh auth login

param(
  [Parameter(Mandatory = $true)]
  [string]$RepoName,

  [ValidateSet("public", "private")]
  [string]$Visibility = "private",

  [string]$Branch = "main",

  [string]$CommitMessage = "Initial commit"
)

$ErrorActionPreference = "Stop"

function Assert-Cmd($name) {
  if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
    throw "Required command not found: $name. Please install it and retry."
  }
}

Assert-Cmd "git"
Assert-Cmd "gh"

Write-Host "==> Checking GitHub auth..." -ForegroundColor Cyan
try {
  gh auth status | Out-Null
} catch {
  Write-Host "You are not logged into GitHub CLI. Running: gh auth login" -ForegroundColor Yellow
  gh auth login
}

if (-not (Test-Path ".git")) {
  Write-Host "==> Initializing git..." -ForegroundColor Cyan
  git init | Out-Null
}

Write-Host "==> Ensuring branch '$Branch'..." -ForegroundColor Cyan
git checkout -B $Branch | Out-Null

Write-Host "==> Creating GitHub repo (or reusing if it exists)..." -ForegroundColor Cyan
try {
  # Create under the authenticated user org/user; set origin + push
  gh repo create $RepoName --$Visibility --source . --remote origin --push --branch $Branch --description "Privacy-first secure meeting room" | Out-Null
  Write-Host "✓ Repo created and pushed." -ForegroundColor Green
} catch {
  Write-Host "Repo may already exist. Falling back to setting remote + pushing..." -ForegroundColor Yellow

  $owner = (gh api user --jq .login).Trim()
  $repoUrl = "https://github.com/$owner/$RepoName.git"

  $hasOrigin = (git remote | Select-String -Pattern "^origin$" -Quiet)
  if (-not $hasOrigin) {
    git remote add origin $repoUrl
  } else {
    git remote set-url origin $repoUrl
  }

  git add -A
  $status = git status --porcelain
  if (-not [string]::IsNullOrWhiteSpace($status)) {
    git commit -m $CommitMessage | Out-Null
  }
  git push -u origin $Branch
  Write-Host "✓ Pushed to $repoUrl" -ForegroundColor Green
}

Write-Host ""
Write-Host "Next: In GitHub repo Settings → Pages → Source: GitHub Actions" -ForegroundColor Cyan
Write-Host "Then add Actions secrets: REACT_APP_API_URL and REACT_APP_SOCKET_URL" -ForegroundColor Cyan

