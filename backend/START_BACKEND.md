# Starting the Backend

## Current Status
- ✅ `.env` file created with MongoDB password
- ✅ All dependencies installed
- ✅ Gemini API working
- ⚠️ MongoDB connection pending (IP whitelisting)

## Start the Backend

Even if MongoDB isn't connected yet, you can start the backend:

```bash
cd backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

The backend will start on: `http://localhost:8000`

## Test Endpoints

1. **Health Check**: 
   - Visit: http://localhost:8000
   - Should show: `{"message": "Backend is running"}`

2. **Gemini API Test**:
   - Visit: http://localhost:8000/check-gemini
   - Should show: `{"status": "Gemini API working"}`

3. **MongoDB Status**:
   - The backend will show MongoDB connection errors in the terminal
   - But it will still run and handle requests
   - PDF uploads will fail until MongoDB is connected

## Frontend Connection

Once backend is running:
1. Start frontend: `cd frontend/edutechai && npm run dev`
2. Frontend will connect to backend on `http://localhost:8000`
3. You can test the UI, but PDF uploads won't work until MongoDB is connected

## Fixing MongoDB Connection

See `MONGODB_TROUBLESHOOTING.md` for detailed steps.

**Quick fix**: In MongoDB Atlas, temporarily allow all IPs (`0.0.0.0/0`) to test if it's an IP whitelisting issue.






