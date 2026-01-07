# Setup Guide for EduText AI Agent

## Quick Start

### 1. Backend Setup

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Activate virtual environment:**
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create `.env` file in backend folder:**
   Create a file named `.env` with the following content:
   ```
   GOOGLE_API_KEY=your_gemini_api_key_here
   MONGODB_URL=mongodb+srv://mohammedsohail:YOUR_PASSWORD@edutechai.ljukli1.mongodb.net/?appName=EduTechAI
   ```
   
   **Important:** Replace:
   - `your_gemini_api_key_here` with your actual Google Gemini API key
   - `YOUR_PASSWORD` with your actual MongoDB password

5. **Run backend:**
   ```bash
   uvicorn main:app --reload
   ```
   
   Backend will run on: `http://localhost:8000`

### 2. Frontend Setup

1. **Navigate to frontend folder:**
   ```bash
   cd frontend/edutechai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run frontend:**
   ```bash
   npm run dev
   ```
   
   Frontend will run on: `http://localhost:3000`

### 3. Using the Application

1. Open `http://localhost:3000` in your browser
2. Click "Click to upload PDF" and select a textbook PDF
3. Wait for upload to complete
4. Select the uploaded textbook from the list
5. Start asking questions!

## Getting API Keys

### Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key and paste it in your `.env` file

### MongoDB Connection

Your MongoDB URL is already provided:
```
mongodb+srv://mohammedsohail:<db_password>@edutechai.ljukli1.mongodb.net/?appName=EduTechAI
```

Just replace `<db_password>` with your actual MongoDB password.

## Troubleshooting

### Backend won't start
- Check if port 8000 is available
- Verify all dependencies are installed: `pip list`
- Check `.env` file exists and has correct values

### Frontend can't connect to backend
- Ensure backend is running on port 8000
- Check browser console for errors
- Verify CORS is enabled (already configured in code)

### MongoDB connection error
- Verify your password in the MongoDB URL
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure the database name is correct

### PDF upload fails
- Ensure file is a valid PDF
- Check file size (very large files may take time)
- Verify backend is running

## Testing

### Test Backend
Visit: `http://localhost:8000/check-gemini`
Should return: `{"status": "Gemini API working"}`

### Test Frontend
1. Upload a PDF
2. Select it from the list
3. Ask a question like "What is the main topic of chapter 1?"

## Need Help?

Check the main README.md for more detailed information.





