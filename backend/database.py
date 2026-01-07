from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os

load_dotenv()

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb+srv://mohammedsohail:<db_password>@edutechai.ljukli1.mongodb.net/?appName=EduTechAI")

# Initialize client - connection will be tested on first use
client = None
try:
    # Only connect if password is not a placeholder
    if "<db_password>" not in MONGODB_URL:
        # Create a new client and connect to the server with ServerApi
        client = MongoClient(MONGODB_URL, server_api=ServerApi('1'), serverSelectionTimeoutMS=10000)
        # Send a ping to confirm a successful connection
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    else:
        print("MongoDB URL contains placeholder - please set MONGODB_URL in .env file")
        # Create a dummy client to avoid errors, but it won't work until URL is fixed
        client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=1000)
except Exception as e:
    print(f"MongoDB connection error: {e}")
    print("Please check your MONGODB_URL in .env file")
    print("Also ensure your IP address is whitelisted in MongoDB Atlas")
    # Create a dummy client to avoid import errors
    try:
        client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=1000)
    except:
        pass

if client:
    try:
        db = client["EduTechAI"]
        # Collections
        textbooks_collection = db["textbooks"]
        conversations_collection = db["conversations"]
        users_collection = db["users"]
    except Exception as e:
        print(f"Error accessing database: {e}")
        db = None
        textbooks_collection = None
        conversations_collection = None
        users_collection = None
else:
    # Fallback to avoid errors
    db = None
    textbooks_collection = None
    conversations_collection = None
    users_collection = None

