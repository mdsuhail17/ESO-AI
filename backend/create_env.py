"""
Script to help create .env file
"""
import os

print("=" * 60)
print("Creating .env file for EduText AI Agent")
print("=" * 60)

# Check if .env already exists
if os.path.exists('.env'):
    response = input("\n.env file already exists. Overwrite? (y/n): ")
    if response.lower() != 'y':
        print("Cancelled.")
        exit()

# Get Gemini API Key
print("\n1. Google Gemini API Key")
print("   Get your API key from: https://makersuite.google.com/app/apikey")
gemini_key = input("   Enter your Gemini API Key: ").strip()

# Get MongoDB URL
print("\n2. MongoDB Connection URL")
print("   Your MongoDB URL: mongodb+srv://mohammedsohail:<db_password>@edutechai.ljukli1.mongodb.net/?appName=EduTechAI")
print("   Replace <db_password> with your actual MongoDB password")
mongodb_password = input("   Enter your MongoDB password: ").strip()

mongodb_url = f"mongodb+srv://mohammedsohail:{mongodb_password}@edutechai.ljukli1.mongodb.net/?appName=EduTechAI"

# Create .env file
env_content = f"""# Google Gemini API Key
GOOGLE_API_KEY={gemini_key}

# MongoDB Connection URL
MONGODB_URL={mongodb_url}
"""

try:
    with open('.env', 'w') as f:
        f.write(env_content)
    print("\n[SUCCESS] .env file created successfully!")
    print("\nFile contents:")
    print("-" * 60)
    print(env_content.replace(mongodb_password, "***HIDDEN***"))
    print("-" * 60)
    print("\nYou can now start the backend server with: uvicorn main:app --reload")
except Exception as e:
    print(f"\n[ERROR] Failed to create .env file: {e}")






