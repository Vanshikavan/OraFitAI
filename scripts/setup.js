#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up OraFit AI...\n');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.error('❌ Node.js version 18+ is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version:', nodeVersion);

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env.local file not found.');
  console.log('📝 Please copy env.example to .env.local and fill in your values:');
  console.log('   cp env.example .env.local');
  console.log('\n🔧 You\'ll need to set up:');
  console.log('   - Clerk authentication keys');
  console.log('   - Convex database credentials');
  console.log('   - Vapi AI voice integration');
  console.log('\n📚 See README.md for detailed setup instructions.');
  process.exit(1);
}

console.log('✅ Environment file found');

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed');
} catch (error) {
  console.error('❌ Failed to install dependencies');
  process.exit(1);
}

console.log('\n🎉 Setup complete!');
console.log('\n🚀 To start the development server:');
console.log('   npm run dev');
console.log('\n🗄️  To start Convex database (in another terminal):');
console.log('   npm run convex:dev');
console.log('\n🌐 The application will be available at:');
console.log('   http://localhost:3000');
console.log('\n📚 For more information, see README.md');
