#!/bin/bash

# Script để chạy Meme Maker App với Node.js 20
# Usage: ./run.sh [command]
# Commands: dev, build, sync, android, ios

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node.js 20
nvm use 20

# Check command
COMMAND=${1:-dev}

case $COMMAND in
  dev)
    echo "🚀 Starting development server..."
    npm run dev
    ;;
  build)
    echo "🔨 Building project..."
    npm run build
    ;;
  sync)
    echo "🔄 Syncing with Capacitor..."
    npm run build
    npx cap sync
    ;;
  android)
    echo "🤖 Opening Android Studio..."
    npm run build
    npx cap sync android
    npx cap open android
    ;;
  ios)
    echo "🍎 Opening Xcode..."
    npm run build
    npx cap sync ios
    npx cap open ios
    ;;
  *)
    echo "❌ Unknown command: $COMMAND"
    echo "Available commands: dev, build, sync, android, ios"
    exit 1
    ;;
esac
