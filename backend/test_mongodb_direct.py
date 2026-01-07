"""
Direct MongoDB connection test
"""
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os

load_dotenv()

uri = os.getenv("MONGODB_URL")
print(f"Testing connection to: {uri.split('@')[1] if '@' in uri else 'MongoDB'}")

# Create a new client and connect to the server
try:
    print("\nAttempting connection with ServerApi...")
    client = MongoClient(uri, server_api=ServerApi('1'), serverSelectionTimeoutMS=15000)
    
    # Send a ping to confirm a successful connection
    result = client.admin.command('ping')
    print("[SUCCESS] Pinged your deployment. You successfully connected to MongoDB!")
    
    # Test database access
    db = client["EduTechAI"]
    print(f"[SUCCESS] Database 'EduTechAI' accessible")
    
    collections = db.list_collection_names()
    print(f"[SUCCESS] Collections: {collections if collections else 'None (will be created automatically)'}")
    
    client.close()
    
except Exception as e:
    print(f"\n[ERROR] Connection failed: {type(e).__name__}")
    print(f"Error details: {str(e)[:200]}...")
    
    # Try without ServerApi
    print("\nTrying connection without ServerApi...")
    try:
        client2 = MongoClient(uri, serverSelectionTimeoutMS=15000)
        result = client2.admin.command('ping')
        print("[SUCCESS] Connection works without ServerApi!")
        client2.close()
    except Exception as e2:
        print(f"[ERROR] Also failed: {str(e2)[:200]}...")
        print("\nPossible issues:")
        print("1. IP whitelisting may take 1-2 minutes to propagate")
        print("2. Check if IP address 171.76.215.51 is correctly added in MongoDB Atlas")
        print("3. Verify the password is correct: 'edutachai'")
        print("4. Check if there's a firewall blocking the connection")

