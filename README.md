# OraFit AI - AI-Powered Fitness Assistant

A modern, AI-powered fitness platform that creates personalized workout and nutrition programs through voice conversations.

## 🚀 Quick Setup (5 Minutes)

### Step 1: Clone and Install
```bash
git clone <your-github-repo-url>
cd orafit
npm install
```

### Step 2: Create Environment File
```bash
# Copy the example file
cp env.example .env.local

# Open .env.local and paste your API keys
```

### Step 3: Add Your API Keys
Open `.env.local` and replace the placeholder values with your actual API keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
CLERK_SECRET_KEY=sk_test_your_actual_key_here
CLERK_WEBHOOK_SECRET=whsec_your_actual_key_here

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Convex Database
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment-name.convex.cloud
CONVEX_DEPLOY_KEY=your_actual_deploy_key_here

# Vapi AI Voice Integration
NEXT_PUBLIC_VAPI_API_KEY=your_actual_vapi_key_here
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_actual_workflow_id_here
```

### Step 4: Start the Application
```bash
# Terminal 1: Start the app
npm run dev

# Terminal 2: Start the database
npm run convex:dev
```

### Step 5: Open in Browser
Go to: `http://localhost:3000`

## 🎯 That's It!

Your OraFit AI application is now running! You can:
- Sign up/Sign in with Google
- Create personalized fitness programs through voice calls
- View and manage your programs
- Browse sample programs from other users

## 🔧 Available Commands

- `npm run dev` - Start development server
- `npm run convex:dev` - Start database
- `npm run build` - Build for production
- `npm run lint` - Check code quality

## 🎤 Vapi Setup (Important!)

After creating your Vapi workflow, you need to configure the AI prompts:

1. Go to [Vapi Dashboard](https://dashboard.vapi.ai)
2. Open your workflow
3. Copy the prompts from `src/lib/vapi-prompt.ts`:
   - **First Message**: Copy text after `//******* FIRST MESSAGE 👇 *******//`
   - **System Prompt**: Copy text after `//******* SYSTEM PROMPT 👇 *******//`
4. Paste these into your Vapi workflow configuration

## 🐛 Troubleshooting

### Voice Calls Not Working?
- Allow microphone permissions in browser
- Check if Vapi workflow is configured properly

### Authentication Issues?
- Make sure Google OAuth is enabled in Clerk dashboard
- Clear browser cache and cookies

### Database Issues?
- Ensure Convex is running: `npm run convex:dev`
- Check if environment variables are correct

---

**Built with Next.js, Clerk, Convex, and Vapi AI** 🚀