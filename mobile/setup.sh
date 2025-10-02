#!/bin/bash

# ==============================================================================
# Meme Maker - Setup Script
# Tự động setup và chạy project
# ==============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo ""
    echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC}                                                               ${BLUE}║${NC}"
    echo -e "${BLUE}║${NC}        ${GREEN}🎨 Meme Maker - Setup & Run Script 🚀${NC}              ${BLUE}║${NC}"
    echo -e "${BLUE}║${NC}                                                               ${BLUE}║${NC}"
    echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_step() {
    echo -e "${YELLOW}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main setup function
main() {
    print_header
    
    # Step 1: Check Node.js version
    print_step "Checking Node.js version..."
    if ! command_exists node; then
        print_error "Node.js is not installed!"
        echo ""
        echo "Please install Node.js >= 20.0.0:"
        echo "  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
        echo "  source ~/.bashrc"
        echo "  nvm install 20"
        echo "  nvm use 20"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 20 ]; then
        print_error "Node.js version must be >= 20.0.0 (current: $(node -v))"
        echo ""
        echo "Upgrade Node.js:"
        echo "  nvm install 20"
        echo "  nvm use 20"
        exit 1
    fi
    
    print_success "Node.js version: $(node -v) ✓"
    
    # Step 2: Load nvm if available
    print_step "Loading NVM environment..."
    export NVM_DIR="$HOME/.nvm"
    if [ -s "$NVM_DIR/nvm.sh" ]; then
        \. "$NVM_DIR/nvm.sh"
        print_success "NVM loaded"
    else
        print_info "NVM not found (optional)"
    fi
    
    # Step 3: Check if node_modules exists
    print_step "Checking dependencies..."
    if [ ! -d "node_modules" ]; then
        print_info "node_modules not found. Installing dependencies..."
        npm install
        print_success "Dependencies installed"
    else
        print_success "Dependencies already installed"
    fi
    
    # Step 4: Ask user what to do
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo "What would you like to do?"
    echo ""
    echo "  1) Run development server (Web)"
    echo "  2) Build for production"
    echo "  3) Build & run on Android"
    echo "  4) Install dependencies only"
    echo "  5) Clean & reinstall dependencies"
    echo "  0) Exit"
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo -n "Enter your choice [1-5, 0 to exit]: "
    read choice
    
    case $choice in
        1)
            print_step "Starting development server..."
            echo ""
            print_info "Opening http://localhost:5173"
            print_info "Press Ctrl+C to stop"
            echo ""
            npm run dev
            ;;
        2)
            print_step "Building for production..."
            npm run build
            print_success "Build completed! Output in dist/"
            ;;
        3)
            print_step "Building for production..."
            npm run build
            print_success "Build completed"
            
            print_step "Syncing with Capacitor..."
            npx cap sync android
            print_success "Sync completed"
            
            print_step "Opening Android Studio..."
            npx cap open android
            print_info "Click 'Run' button in Android Studio to deploy"
            ;;
        4)
            print_step "Installing dependencies..."
            npm install
            print_success "Dependencies installed"
            ;;
        5)
            print_step "Cleaning node_modules and package-lock.json..."
            rm -rf node_modules package-lock.json dist
            print_success "Cleaned"
            
            print_step "Reinstalling dependencies..."
            npm install
            print_success "Dependencies reinstalled"
            ;;
        0)
            print_info "Exiting..."
            exit 0
            ;;
        *)
            print_error "Invalid choice!"
            exit 1
            ;;
    esac
    
    echo ""
    print_success "Done! 🎉"
    echo ""
}

# Run main function
main
