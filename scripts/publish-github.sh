#!/usr/bin/env bash

# Publish this project to GitHub (macOS/Linux / bash)
# - Creates a GitHub repo (via GitHub CLI "gh")
# - Initializes git (if needed)
# - Commits (if needed)
# - Adds remote origin (if needed)
# - Pushes to main
#
# Usage:
#   ./scripts/publish-github.sh Meeting_Room private main "Initial commit"
#
# Prereqs:
#   - git
#   - gh (GitHub CLI): https://cli.github.com/
#   - Logged in: gh auth login

set -euo pipefail

REPO_NAME="${1:-}"
VISIBILITY="${2:-private}"   # public|private
BRANCH="${3:-main}"
COMMIT_MSG="${4:-Initial commit}"

if [[ -z "$REPO_NAME" ]]; then
  echo "Usage: $0 <repo-name> [public|private] [branch] [commit-message]"
  exit 1
fi

command -v git >/dev/null 2>&1 || { echo "Missing: git"; exit 1; }
command -v gh >/dev/null 2>&1 || { echo "Missing: gh (GitHub CLI)"; exit 1; }

echo "==> Checking GitHub auth..."
if ! gh auth status >/dev/null 2>&1; then
  echo "Not logged in. Running: gh auth login"
  gh auth login
fi

if [[ ! -d ".git" ]]; then
  echo "==> Initializing git..."
  git init >/dev/null
fi

echo "==> Ensuring branch '$BRANCH'..."
git checkout -B "$BRANCH" >/dev/null

echo "==> Staging files..."
git add -A

if ! git diff --cached --quiet; then
  echo "==> Committing..."
  git commit -m "$COMMIT_MSG" >/dev/null
fi

echo "==> Creating GitHub repo and pushing..."
if gh repo create "$REPO_NAME" --"$VISIBILITY" --source . --remote origin --push --branch "$BRANCH" --description "Privacy-first secure meeting room" >/dev/null 2>&1; then
  echo "✓ Repo created and pushed."
else
  echo "Repo may already exist. Setting origin and pushing..."
  OWNER="$(gh api user --jq .login)"
  REPO_URL="https://github.com/${OWNER}/${REPO_NAME}.git"

  if git remote | grep -q "^origin$"; then
    git remote set-url origin "$REPO_URL"
  else
    git remote add origin "$REPO_URL"
  fi
  git push -u origin "$BRANCH"
  echo "✓ Pushed to $REPO_URL"
fi

echo ""
echo "Next: GitHub repo Settings → Pages → Source: GitHub Actions"
echo "Then add Actions secrets: REACT_APP_API_URL and REACT_APP_SOCKET_URL"

