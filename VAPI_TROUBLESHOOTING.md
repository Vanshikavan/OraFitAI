# VAPI Assistant Update Troubleshooting

## Issue: Updated assistant prompt but still using old behavior

## Steps to Fix:

### 1. ✅ Verify VAPI Dashboard Settings
- Go to your VAPI Dashboard
- Navigate to your Workflow
- Check that the new prompt is actually saved
- Make sure you clicked "Save" or "Update" after pasting the new prompt
- Sometimes prompts need to be in the "System Message" or "First Message" field

### 2. 🔄 Clear Browser Cache (IMPORTANT)
- Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
- Select "Cached images and files"
- Click "Clear data"
- Or use Hard Refresh: `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)

### 3. 🚀 Restart Dev Server
Even though it shouldn't be necessary, restart your Next.js dev server:
```bash
# Stop the server (Ctrl + C)
# Then restart:
npm run dev
```

### 4. 🆕 Start a Fresh Call
- Close the browser tab with your app
- Open a new tab
- Go to your app again
- Start a NEW call (don't use a previously started call)

### 5. 🔍 Verify Workflow ID
Check that your `.env.local` has the correct workflow ID:
```
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_workflow_id_here
```
Make sure this matches the workflow ID in your VAPI dashboard where you updated the prompt.

### 6. ⏱️ Wait a Few Minutes
VAPI sometimes takes a few minutes to propagate changes across their servers. Wait 2-3 minutes after saving, then try again.

### 7. 🔄 Create a New Workflow (Last Resort)
If nothing works:
- Create a NEW workflow in VAPI dashboard
- Paste the new prompt
- Save it
- Get the new workflow ID
- Update your `.env.local` with the new workflow ID
- Restart your dev server

## Common Issues:

❌ **Wrong Field**: Make sure you're updating the "System Message" or "First Message" field, not just the description
❌ **Not Saved**: Click "Save" after updating
❌ **Old Cache**: Browser might be caching the old workflow
❌ **Wrong Workflow**: Make sure the workflow ID matches the one you updated

## Quick Checklist:
- [ ] Prompt saved in VAPI dashboard
- [ ] Browser cache cleared
- [ ] Dev server restarted
- [ ] New call started (not using old call)
- [ ] Workflow ID correct in .env.local
- [ ] Waited 2-3 minutes after saving

