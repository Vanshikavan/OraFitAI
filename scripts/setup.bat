@echo off
REM OraFit AI Setup Script for Windows

echo 🚀 Setting up OraFit AI...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Check if .env.local exists
if not exist ".env.local" (
    echo ⚠️  .env.local file not found.
    echo 📝 Please copy env.example to .env.local and fill in your values:
    echo    copy env.example .env.local
    echo.
    echo 🔧 You'll need to set up:
    echo    - Clerk authentication keys
    echo    - Convex database credentials
    echo    - Vapi AI voice integration
    echo.
    echo 📚 See README.md for detailed setup instructions.
    pause
    exit /b 1
)

echo ✅ Environment file found

echo 🎉 Setup complete!
echo.
echo 🚀 To start the development server:
echo    npm run dev
echo.
echo 🌐 The application will be available at:
echo    http://localhost:3000
echo.
echo 📚 For more information, see README.md
echo.
echo ⚠️  Note: Make sure to start Convex database separately:
echo    npx convex dev

pause
