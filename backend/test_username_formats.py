"""
Test different username formats for MongoDB
"""
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os

load_dotenv()

host = "edutechai.ljukli1.mongodb.net"
password = "mohammedsohail"

# Try different username formats
username_formats = [
    ("mohammedsohail%40admin", "mohammedsohail@admin (URL encoded)"),  # URL encoded @
    ("mohammedsohail@admin", "mohammedsohail@admin (raw)"),  # Raw @
    ("mohammedsohail", "mohammedsohail (without @admin)"),  # Without @admin
]

print("Testing different username formats...\n")

for username, description in username_formats:
    try:
        uri = f"mongodb+srv://{username}:{password}@{host}/?appName=EduTechAI"
        print(f"Testing: {description}")
        print(f"URI: mongodb+srv://{username}:***@{host}/?appName=EduTechAI")
        
        client = MongoClient(uri, server_api=ServerApi('1'), serverSelectionTimeoutMS=10000)
        result = client.admin.command('ping')
        print(f"[SUCCESS] Username format '{username}' works!")
        client.close()
        break
    except Exception as e:
        error_msg = str(e)
        if "bad auth" in error_msg.lower() or "authentication" in error_msg.lower():
            print(f"[FAILED] Authentication error with '{username}'")
        else:
            print(f"[FAILED] Other error with '{username}': {error_msg[:100]}")
    print()

