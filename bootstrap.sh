#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}UniFi Hotspot Bootstrap Script${NC}"
echo -e "${GREEN}For Ubuntu 24.04 LTS${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Function to print colored messages
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running on Ubuntu
if [ -f /etc/os-release ]; then
    . /etc/os-release
    if [[ "$ID" != "ubuntu" ]]; then
        print_warning "This script is designed for Ubuntu 24.04. You're running $NAME $VERSION_ID"
        read -p "Continue anyway? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
else
    print_warning "Cannot detect OS. Continuing anyway..."
fi

# Check if Node.js is installed
print_info "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v | cut -d'v' -f2)
    NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
    print_info "Node.js $NODE_VERSION is installed"

    if [ "$NODE_MAJOR_VERSION" -lt 20 ]; then
        print_error "Node.js version 20 or higher is required. Found: $NODE_VERSION"
        print_info "Please install Node.js 20+ and run this script again"
        print_info "Visit: https://nodejs.org/ or use nvm: https://github.com/nvm-sh/nvm"
        exit 1
    fi
else
    print_error "Node.js is not installed"
    print_info "Installing Node.js 20.x LTS using NodeSource repository..."

    # Install Node.js 20.x
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl gnupg
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

    NODE_MAJOR=20
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list

    sudo apt-get update
    sudo apt-get install -y nodejs

    print_info "Node.js installed: $(node -v)"
fi

# Check if npm is installed
print_info "Checking npm installation..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    print_info "npm $NPM_VERSION is installed"
else
    print_error "npm is not installed (should come with Node.js)"
    exit 1
fi

# Install project dependencies
print_info "Installing project dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found"
    print_info "Creating .env from .env.example..."
    cp .env.example .env
    print_warning "Please edit .env file with your UniFi controller credentials before starting the server"
    print_info "Required variables: UNIFI_USER, UNIFI_PASS, UNIFI_CONTROLLER_URL"
else
    print_info ".env file already exists"
fi

# Build the project
print_info "Building TypeScript project..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    print_info "Build successful! Output directory: dist/"
else
    print_error "Build failed - dist/ directory not created"
    exit 1
fi

echo ""
print_info "${GREEN}========================================${NC}"
print_info "${GREEN}Bootstrap Complete!${NC}"
print_info "${GREEN}========================================${NC}"
echo ""
print_info "Next steps:"
print_info "1. Edit the .env file with your configuration:"
print_info "   nano .env"
print_info ""
print_info "2. Start the server:"
print_info "   npm start"
print_info "   OR for production with PM2:"
print_info "   npm install -g pm2"
print_info "   pm2 start dist/index.js --name unifi-hotspot"
print_info ""
print_info "For multi-controller setup, see .env.example for UNIFI_CONTROLLERS configuration"
echo ""
