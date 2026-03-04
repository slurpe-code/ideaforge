#!/bin/bash
# Usage: bash push.sh "your commit message"
# Run this from the project folder whenever Claude tells you to commit.

MSG="${1:-update}"
cd "$(dirname "$0")"
git add .
git commit -m "$MSG"
git push
echo ""
echo "✅ Pushed: $MSG"
