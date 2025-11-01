#!/bin/bash

# OraFit AI Setup Script
echo "🚀 Setting up OraFit AI..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local file not found."
    echo "📝 Please copy env.example to .env.local and fill in your values:"
    echo "   cp env.example .env.local"
    echo ""
    echo "🔧 You'll need to set up:"
    echo "   - Clerk authentication keys"
    echo "   - Convex database credentials"
    echo "   - Vapi AI voice integration"
    echo ""
    echo "📚 See README.md for detailed setup instructions."
    exit 1
fi

echo "✅ Environment file found"

# Check if all required environment variables are set
source .env.local

if [ -z "$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" ]; then
    echo "❌ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set"
    exit 1
fi

if [ -z "$NEXT_PUBLIC_CONVEX_URL" ]; then
    echo "❌ NEXT_PUBLIC_CONVEX_URL is not set"
    exit 1
fi

if [ -z "$NEXT_PUBLIC_VAPI_API_KEY" ]; then
    echo "❌ NEXT_PUBLIC_VAPI_API_KEY is not set"
    exit 1
fi

echo "✅ Environment variables configured"

# Start Convex (in background)
echo "🗄️  Starting Convex database..."
npx convex dev &
CONVEX_PID=$!

# Wait a moment for Convex to start
sleep 3

echo "🎉 Setup complete!"
echo ""
echo "🚀 To start the development server:"
echo "   npm run dev"
echo ""
echo "🌐 The application will be available at:"
echo "   http://localhost:3000"
echo ""
echo "📚 For more information, see README.md"
echo ""
echo "🛑 To stop Convex database: kill $CONVEX_PID"
