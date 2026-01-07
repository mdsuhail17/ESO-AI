from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse, Response
from dotenv import load_dotenv
import os
from google import genai
from pydantic import BaseModel
from typing import Optional
import PyPDF2
import io
from datetime import datetime, timedelta
from bson import ObjectId
import base64
import hashlib
import secrets
from database import textbooks_collection, conversations_collection, users_collection, users_collection

# Load env variables
load_dotenv()

# Create Gemini client
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

app = FastAPI()

# Helper function to check database connection
def check_database():
    if textbooks_collection is None or conversations_collection is None:
        raise HTTPException(
            status_code=503, 
            detail="Database not connected. Please check your MONGODB_URL in .env file"
        )

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class QuestionRequest(BaseModel):
    textbook_id: str
    question: str

class ExplainRequest(BaseModel):
    textbook_id: str
    answer: str
    question: Optional[str] = None

class LectureRequest(BaseModel):
    textbook_id: str
    topic: str
    chapter: Optional[str] = None
    user_id: Optional[str] = None

class ConversationRequest(BaseModel):
    textbook_id: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@app.get("/")
def root():
    return {"message": "Backend is running"}

@app.get("/check-gemini")
def check_gemini():
    try:
        response = client.models.generate_content(
            model="models/gemini-flash-latest",
            contents="Reply with exactly: Gemini API working"
        )
        return {"status": response.text}
    except Exception as e:
        return {"status": f"Error: {str(e)}"}

@app.post("/upload-textbook")
async def upload_textbook(file: UploadFile = File(...), user_id: Optional[str] = Query(None)):
    """
    Upload a PDF textbook and extract its text content.
    Stores the textbook metadata and content in MongoDB.
    """
    check_database()
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Read PDF file
        contents = await file.read()
        pdf_file = io.BytesIO(contents)
        
        # Extract text from PDF
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text_content = ""
        
        for page_num, page in enumerate(pdf_reader.pages):
            text_content += f"\n--- Page {page_num + 1} ---\n"
            text_content += page.extract_text()
        
        # Store PDF file locally
        os.makedirs("uploads", exist_ok=True)
        
        # Store in MongoDB first to get ID
        textbook_doc = {
            "filename": file.filename,
            "uploaded_at": datetime.utcnow(),
            "content": text_content,
            "page_count": len(pdf_reader.pages),
            "user_id": user_id  # Link textbook to user
        }
        
        result = textbooks_collection.insert_one(textbook_doc)
        textbook_id = str(result.inserted_id)
        
        # Save PDF file with textbook_id as filename
        pdf_path = f"uploads/{textbook_id}.pdf"
        with open(pdf_path, "wb") as f:
            f.write(contents)
        
        # Update with PDF path
        textbooks_collection.update_one(
            {"_id": result.inserted_id},
            {"$set": {"pdf_path": pdf_path}}
        )
        
        return {
            "message": "Textbook uploaded successfully",
            "textbook_id": textbook_id,
            "filename": file.filename,
            "page_count": len(pdf_reader.pages)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading textbook: {str(e)}")

@app.get("/textbooks")
def get_textbooks(user_id: Optional[str] = None):
    """Get list of uploaded textbooks for a specific user"""
    check_database()
    try:
        # Filter by user_id if provided
        query = {"user_id": user_id} if user_id else {}
        textbooks = list(textbooks_collection.find(query, {"content": 0}))  # Exclude content for list view
        for textbook in textbooks:
            textbook["_id"] = str(textbook["_id"])
        return {"textbooks": textbooks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching textbooks: {str(e)}")

@app.delete("/textbook/{textbook_id}")
def delete_textbook(textbook_id: str):
    """Delete a textbook from database and filesystem"""
    check_database()
    try:
        # Get textbook to find PDF path
        try:
            textbook = textbooks_collection.find_one({"_id": ObjectId(textbook_id)})
        except:
            textbook = textbooks_collection.find_one({"_id": textbook_id})
        
        if not textbook:
            raise HTTPException(status_code=404, detail="Textbook not found")
        
        # Delete PDF file from filesystem
        pdf_path = textbook.get("pdf_path", f"uploads/{textbook_id}.pdf")
        if os.path.exists(pdf_path):
            try:
                os.remove(pdf_path)
            except Exception as e:
                print(f"Warning: Could not delete PDF file: {e}")
        
        # Delete from MongoDB
        try:
            textbooks_collection.delete_one({"_id": ObjectId(textbook_id)})
        except:
            textbooks_collection.delete_one({"_id": textbook_id})
        
        # Also delete related conversations
        try:
            conversations_collection.delete_many({"textbook_id": textbook_id})
        except Exception as e:
            print(f"Warning: Could not delete conversations: {e}")
        
        return {
            "message": "Textbook deleted successfully",
            "textbook_id": textbook_id
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting textbook: {str(e)}")

class QuestionRequest(BaseModel):
    textbook_id: str
    question: str
    user_id: Optional[str] = None

@app.post("/ask-question")
async def ask_question(request: QuestionRequest):
    """
    Ask a question about the uploaded textbook.
    Uses Gemini AI to find and return relevant answers from the textbook.
    """
    check_database()
    try:
        # Get textbook from database
        try:
            textbook = textbooks_collection.find_one({"_id": ObjectId(request.textbook_id)})
        except:
            textbook = textbooks_collection.find_one({"_id": request.textbook_id})
        
        if not textbook:
            raise HTTPException(status_code=404, detail="Textbook not found")
        
        textbook_content = textbook.get("content", "")
        
        # Create prompt for Gemini (limit content to avoid token limits)
        limited_content = textbook_content[:50000]
        prompt = f"""You are an educational AI assistant helping students and teachers with textbook content.

Textbook Content:
{limited_content}

Question: {request.question}

Please provide a clear and accurate answer based ONLY on the textbook content provided above. 
If the answer is not found in the textbook, please state that clearly.
Include the page number or chapter reference if possible.

Answer:"""
        
        # Get response from Gemini
        response = client.models.generate_content(
            model="models/gemini-flash-latest",
            contents=prompt
        )
        
        answer = response.text
        
        # Try to extract page number from answer - multiple patterns
        page_number = None
        import re
        # Try different patterns: "page 5", "page 5:", "on page 5", "Page 5", etc.
        patterns = [
            r'page\s+(\d+)',
            r'page\s+(\d+):',
            r'on\s+page\s+(\d+)',
            r'at\s+page\s+(\d+)',
            r'pages?\s+(\d+)',
            r'\(page\s+(\d+)\)',
        ]
        for pattern in patterns:
            page_match = re.search(pattern, answer, re.IGNORECASE)
            if page_match:
                try:
                    page_number = int(page_match.group(1))
                    break
                except:
                    continue
        
        # Store conversation in database
        conversation_doc = {
            "textbook_id": request.textbook_id,
            "user_id": request.user_id,  # Link conversation to user
            "question": request.question,
            "answer": answer,
            "page_number": page_number,
            "timestamp": datetime.utcnow()
        }
        conversations_collection.insert_one(conversation_doc)
        
        return {
            "answer": answer,
            "textbook_id": request.textbook_id,
            "page_number": page_number
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")

@app.post("/explain-answer")
async def explain_answer(request: ExplainRequest):
    """
    Explain an answer in simple words using the textbook as reference.
    Useful for students who don't understand the initial answer.
    """
    check_database()
    try:
        # Get textbook from database
        try:
            textbook = textbooks_collection.find_one({"_id": ObjectId(request.textbook_id)})
        except:
            textbook = textbooks_collection.find_one({"_id": request.textbook_id})
        
        if not textbook:
            raise HTTPException(status_code=404, detail="Textbook not found")
        
        textbook_content = textbook.get("content", "")
        
        # Create prompt for Gemini to explain in simple words (limit content to avoid token limits)
        limited_content = textbook_content[:50000]
        prompt = f"""You are an educational AI assistant helping students understand complex textbook content.

Textbook Content (for reference):
{limited_content}

Original Question: {request.question or "Not provided"}

Original Answer: {request.answer}

Please explain the above answer in very simple, easy-to-understand words. 
Break down complex concepts into simpler terms.
Use examples if helpful.
Make it suitable for students who are struggling to understand the material.
Keep the explanation clear and concise.

Simple Explanation:"""
        
        # Get response from Gemini
        response = client.models.generate_content(
            model="models/gemini-flash-latest",
            contents=prompt
        )
        
        explanation = response.text
        
        return {
            "explanation": explanation,
            "original_answer": request.answer
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error explaining answer: {str(e)}")

@app.post("/generate-lecture")
async def generate_lecture(request: LectureRequest):
    """
    Generate a structured 45-minute lecture plan for lecturers/teachers.
    Converts textbook content into a teaching script with slides, speaker notes, and questions.
    """
    check_database()
    try:
        # Get textbook from database
        try:
            textbook = textbooks_collection.find_one({"_id": ObjectId(request.textbook_id)})
        except:
            textbook = textbooks_collection.find_one({"_id": request.textbook_id})
        
        if not textbook:
            raise HTTPException(status_code=404, detail="Textbook not found")
        
        textbook_content = textbook.get("content", "")
        
        # Create comprehensive prompt for lecture generation
        limited_content = textbook_content[:50000]
        
        prompt = f"""### ROLE
You are an expert University Professor and Curriculum Designer with 20 years of experience. Your goal is to convert raw textbook content into a structured, high-energy 45-minute lecture plan.

### INPUT
1. Textbook Content (PDF Text)
2. Specific Topic/Chapter to cover: {request.topic}
{f"3. Chapter: {request.chapter}" if request.chapter else ""}

### TEXTBOOK CONTENT:
{limited_content}

### INSTRUCTIONS
Do not summarize. You must build a teaching script. Follow this strict structure:

1. **Learning Objective:** Start with "By the end of this lecture, students will be able to..."

2. **The "Hook" (5 Mins):** Provide a real-world analogy or surprising fact to start the class. (e.g., "Think of Voltage like water pressure...")

3. **Core Concepts (Slide-Ready):**
   - Break the content into 3 main sub-topics.
   - For each sub-topic, provide 4-5 short bullet points (max 10 words per bullet) suitable for a PowerPoint slide.

4. **Speaker Notes:**
   - For each slide, write a "Script" for the teacher to say.
   - Include specific "Check for Understanding" questions to ask the class (e.g., "Raise your hand if you think X...").

5. **The "Stump" Question:** Generate one very difficult critical-thinking question to challenge the smartest students at the end.

### OUTPUT FORMAT
Structure your response as follows:

# LEARNING OBJECTIVE
[Your learning objective here]

# THE HOOK (5 Minutes)
[Your engaging hook here]

# CORE CONCEPTS

## Sub-topic 1: [Name]
### Slide 1:
- [Bullet point 1]
- [Bullet point 2]
- [Bullet point 3]
- [Bullet point 4]
- [Bullet point 5]

**Speaker Notes:**
[Your script here]

**Check for Understanding:**
[Your question here]

### Slide 2:
[Continue pattern...]

## Sub-topic 2: [Name]
[Continue pattern...]

## Sub-topic 3: [Name]
[Continue pattern...]

# THE STUMP QUESTION
[Your challenging question here]

### TONE
Professional, engaging, organized. Use bolding for key terms.

Now generate the lecture plan for the topic: {request.topic}"""
        
        # Get response from Gemini
        response = client.models.generate_content(
            model="models/gemini-flash-latest",
            contents=prompt
        )
        
        lecture_content = response.text
        
        # Store lecture in database
        lecture_doc = {
            "textbook_id": request.textbook_id,
            "user_id": request.user_id,
            "type": "lecture",
            "topic": request.topic,
            "chapter": request.chapter,
            "lecture_content": lecture_content,  # Changed from "content" to "lecture_content"
            "timestamp": datetime.utcnow()
        }
        conversations_collection.insert_one(lecture_doc)
        
        return {
            "lecture_content": lecture_content,
            "topic": request.topic,
            "chapter": request.chapter,
            "textbook_id": request.textbook_id
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating lecture: {str(e)}")

@app.get("/conversations/{textbook_id}")
def get_conversations(textbook_id: str, user_id: Optional[str] = None):
    """Get conversation history for a specific textbook and user"""
    check_database()
    try:
        try:
            textbook_obj_id = ObjectId(textbook_id)
        except:
            textbook_obj_id = textbook_id
        
        # Filter by textbook_id and user_id if provided
        query = {"textbook_id": str(textbook_id)}
        if user_id:
            query["user_id"] = user_id
        
        conversations = list(conversations_collection.find(
            query
        ).sort("timestamp", -1).limit(50))
        
        for conv in conversations:
            conv["_id"] = str(conv["_id"])
            conv["textbook_id"] = str(conv["textbook_id"])
            if "timestamp" in conv:
                conv["timestamp"] = conv["timestamp"].isoformat()
        
        return {"conversations": conversations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching conversations: {str(e)}")

@app.get("/textbook/{textbook_id}")
def get_textbook(textbook_id: str):
    """Get a specific textbook with its content"""
    check_database()
    try:
        try:
            textbook = textbooks_collection.find_one({"_id": ObjectId(textbook_id)})
        except:
            textbook = textbooks_collection.find_one({"_id": textbook_id})
        
        if not textbook:
            raise HTTPException(status_code=404, detail="Textbook not found")
        
        textbook["_id"] = str(textbook["_id"])
        # Don't return full content for this endpoint
        textbook.pop("content", None)
        return textbook
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching textbook: {str(e)}")

@app.get("/textbook/{textbook_id}/pdf")
def get_textbook_pdf(textbook_id: str):
    """Serve the PDF file for a textbook - displays inline in browser"""
    check_database()
    try:
        try:
            textbook = textbooks_collection.find_one({"_id": ObjectId(textbook_id)})
        except:
            textbook = textbooks_collection.find_one({"_id": textbook_id})
        
        if not textbook:
            raise HTTPException(status_code=404, detail="Textbook not found")
        
        pdf_path = textbook.get("pdf_path", f"uploads/{textbook_id}.pdf")
        
        if not os.path.exists(pdf_path):
            raise HTTPException(status_code=404, detail="PDF file not found")
        
        # Read PDF file
        with open(pdf_path, "rb") as f:
            pdf_content = f.read()
        
        # Return PDF with headers to display inline, not download
        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={
                "Content-Disposition": "inline",  # Display inline instead of download
                "Content-Type": "application/pdf",
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error serving PDF: {str(e)}")

# Helper function to hash password
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# Authentication endpoints
@app.post("/register")
def register(request: RegisterRequest):
    check_database()
    
    try:
        # Check if user already exists
        existing_user = users_collection.find_one({"email": request.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password
        hashed_password = hash_password(request.password)
        
        # Create user document
        user_doc = {
            "name": request.name,
            "email": request.email,
            "password": hashed_password,
            "created_at": datetime.utcnow()
        }
        
        # Insert user
        result = users_collection.insert_one(user_doc)
        user_id = str(result.inserted_id)
        
        # Generate simple token (in production, use JWT)
        token = secrets.token_urlsafe(32)
        
        return {
            "success": True,
            "message": "User registered successfully",
            "user_id": user_id,
            "token": token,
            "name": request.name
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration error: {str(e)}")

@app.post("/login")
def login(request: LoginRequest):
    check_database()
    
    try:
        # Find user by email
        user = users_collection.find_one({"email": request.email})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Hash provided password and compare
        hashed_password = hash_password(request.password)
        if user["password"] != hashed_password:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Generate token
        token = secrets.token_urlsafe(32)
        
        return {
            "success": True,
            "message": "Login successful",
            "user_id": str(user["_id"]),
            "token": token,
            "name": user["name"]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login error: {str(e)}")

@app.get("/check-auth")
def check_auth(token: str = Query(...)):
    """Check if token is valid (simplified - in production use proper JWT validation)"""
    check_database()
    # For now, just return success if token exists
    # In production, validate token against stored sessions
    return {"authenticated": True}

