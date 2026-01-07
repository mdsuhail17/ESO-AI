# EduText AI Agent

An intelligent AI-powered study companion for students and teachers that helps with textbook learning and note preparation.

## Features

### For Students:
- 📚 Upload PDF textbooks and get instant answers to your questions
- 💡 Ask AI to explain complex answers in simple words
- ⚡ Save hours of time searching through textbooks manually

### For Teachers:
- 📝 Quickly prepare notes from textbooks
- 🎯 Extract key points and simplify content for students
- ⏱️ Reduce note preparation time from hours to minutes

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python
- **Database**: MongoDB
- **AI**: Google Gemini AI

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Python 3.8+ installed
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (if not already created):
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

6. Edit `.env` and add your credentials:
   - `GOOGLE_API_KEY`: Your Google Gemini API key
   - `MONGODB_URL`: Your MongoDB connection string (replace `<db_password>` with your actual password)

7. Run the backend server:
```bash
uvicorn main:app --reload
```

The backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend/edutechai
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file (optional, if backend is not on localhost:8000):
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Backend APIs

- `GET /` - Health check
- `GET /check-gemini` - Test Gemini API connection
- `POST /upload-textbook` - Upload a PDF textbook
- `GET /textbooks` - Get list of all uploaded textbooks
- `POST /ask-question` - Ask a question about a textbook
- `POST /explain-answer` - Get a simple explanation of an answer

## Usage

1. **Upload a Textbook**: Click "Click to upload PDF" and select your textbook PDF file
2. **Select Textbook**: Choose the uploaded textbook from the list
3. **Ask Questions**: Type your question in the chat interface and click "Ask"
4. **Get Explanations**: Click "Explain in simple words" on any answer to get a simplified explanation

## Project Structure

```
EduText AI Agent/
├── backend/
│   ├── main.py              # FastAPI application with all endpoints
│   ├── database.py           # MongoDB connection and setup
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Environment variables (create this)
├── frontend/
│   └── edutechai/
│       ├── app/
│       │   ├── page.tsx      # Main application page
│       │   └── layout.tsx    # Root layout
│       └── package.json      # Node dependencies
└── README.md
```

## Notes

- Make sure both backend and frontend servers are running
- The backend CORS is configured to allow requests from `http://localhost:3000`
- PDF files are processed and text is extracted and stored in MongoDB
- Large PDFs may take some time to process

## Troubleshooting

1. **MongoDB Connection Error**: 
   - Check your MongoDB URL in `.env`
   - Ensure `<db_password>` is replaced with your actual password
   - Verify your IP is whitelisted in MongoDB Atlas

2. **Gemini API Error**:
   - Verify your API key is correct in `.env`
   - Check your API quota/limits

3. **CORS Errors**:
   - Ensure backend is running on port 8000
   - Check that frontend is making requests to the correct backend URL

## License

This project is for educational purposes.






