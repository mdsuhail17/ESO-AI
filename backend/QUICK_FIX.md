# Quick Fix Guide

## Current Status

✅ **Gemini API**: Working perfectly!
❌ **MongoDB**: Not connected (missing .env file)

## The Problem

The backend can't start because:
1. Missing dependencies (FIXED - PyPDF2 and pymongo are now installed)
2. Missing .env file with MongoDB URL

## Solution

### Option 1: Use the Setup Script (Recommended)

Run this command in the backend folder:
```bash
python create_env.py
```

This will ask you for:
- Your Gemini API Key (already working, but you can update it)
- Your MongoDB password (replace `<db_password>` in the URL)

### Option 2: Create .env Manually

1. Create a file named `.env` in the `backend` folder
2. Add these lines (replace with your actual values):

```
GOOGLE_API_KEY=your_gemini_api_key_here
MONGODB_URL=mongodb+srv://mohammedsohail:YOUR_ACTUAL_PASSWORD@edutechai.ljukli1.mongodb.net/?appName=EduTechAI
```

**Important**: Replace `YOUR_ACTUAL_PASSWORD` with your actual MongoDB password!

### After Creating .env

1. Test connections:
   ```bash
   python test_connections.py
   ```

2. Start the backend:
   ```bash
   uvicorn main:app --reload
   ```

3. The backend should now start on http://localhost:8000

## Verify Everything Works

1. **Backend running**: Check http://localhost:8000 - should show `{"message": "Backend is running"}`
2. **Gemini API**: Check http://localhost:8000/check-gemini - should show `{"status": "Gemini API working"}`
3. **Frontend**: Should now be able to upload PDFs and ask questions!

## Common Issues

### "MongoDB connection timeout"
- Check your password is correct
- Make sure your IP is whitelisted in MongoDB Atlas (allow 0.0.0.0/0 for testing)

### "ModuleNotFoundError"
- Make sure virtual environment is activated
- Run: `pip install -r requirements.txt`

### "ERR_CONNECTION_RESET"
- Backend is not running - start it with `uvicorn main:app --reload`
- Check backend terminal for errors





