"""
Test script to verify MongoDB and Gemini API connections
"""
from dotenv import load_dotenv
import os
from google import genai
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

# Load environment variables
load_dotenv()

print("=" * 50)
print("Testing Connections")
print("=" * 50)

# Test 1: Check environment variables
print("\n1. Checking Environment Variables...")
google_api_key = os.getenv("GOOGLE_API_KEY")
mongodb_url = os.getenv("MONGODB_URL")

if google_api_key:
    print("[OK] GOOGLE_API_KEY is set")
    print(f"  Key starts with: {google_api_key[:10]}...")
else:
    print("[ERROR] GOOGLE_API_KEY is NOT set in .env file")

if mongodb_url:
    print("[OK] MONGODB_URL is set")
    # Mask password in URL for security
    if "<db_password>" in mongodb_url:
        print("  [WARNING] <db_password> placeholder found - replace with actual password!")
    else:
        print("  URL configured")
else:
    print("[ERROR] MONGODB_URL is NOT set in .env file")

# Test 2: Test Gemini API
print("\n2. Testing Gemini API Connection...")
if google_api_key:
    try:
        client = genai.Client(api_key=google_api_key)
        response = client.models.generate_content(
            model="models/gemini-flash-latest",
            contents="Reply with exactly: Gemini API working"
        )
        print("[OK] Gemini API is working!")
        print(f"  Response: {response.text}")
    except Exception as e:
        print(f"[ERROR] Gemini API Error: {str(e)}")
        print("  Check your API key and internet connection")
else:
    print("[ERROR] Cannot test Gemini API - API key not set")

# Test 3: Test MongoDB Connection
print("\n3. Testing MongoDB Connection...")
if mongodb_url:
    try:
        # Replace <db_password> if present
        if "<db_password>" in mongodb_url:
            print("  [WARNING] Cannot test - password placeholder found in URL")
            print("  Please replace <db_password> with your actual password in .env")
        else:
            # Create a new client and connect to the server with ServerApi
            client = MongoClient(mongodb_url, server_api=ServerApi('1'), serverSelectionTimeoutMS=10000)
            # Send a ping to confirm a successful connection
            client.admin.command('ping')
            print("[OK] MongoDB connection successful!")
            print("Pinged your deployment. You successfully connected to MongoDB!")
            
            # Test database access
            db = client["EduTechAI"]
            collections = db.list_collection_names()
            print(f"  Database: EduTechAI")
            print(f"  Collections: {collections if collections else 'None (will be created automatically)'}")
            
            client.close()
    except ServerSelectionTimeoutError:
        print("[ERROR] MongoDB connection timeout")
        print("  Possible issues:")
        print("  - Incorrect password")
        print("  - IP address not whitelisted in MongoDB Atlas")
        print("  - Network connectivity issues")
    except ConnectionFailure as e:
        print(f"[ERROR] MongoDB connection failed: {str(e)}")
        print("  Check your MongoDB URL and credentials")
    except Exception as e:
        print(f"[ERROR] MongoDB Error: {str(e)}")
else:
    print("[ERROR] Cannot test MongoDB - URL not set")

print("\n" + "=" * 50)
print("Connection Test Complete")
print("=" * 50)

