# Get Exact Connection String from MongoDB Atlas

## Step-by-Step Guide

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com/
2. **Click on your cluster** (edutechai)
3. **Click the "Connect" button** (big green button)
4. **Select "Connect your application"**
5. **Choose**:
   - Driver: **Python**
   - Version: **3.12 or later**
6. **Copy the connection string** shown
   - It will look like: `mongodb+srv://<username>:<password>@edutechai.ljukli1.mongodb.net/...`
7. **Replace the placeholders**:
   - Replace `<username>` with: `mohammedsohail` (or `mohammedsohail@admin` if that's what it shows)
   - Replace `<password>` with: `edutachai`
8. **Copy the FULL connection string** and share it (you can hide the password part)

## Or Reset Password

If the password isn't working:

1. Go to **Database Access**
2. Find user `mohammedsohail@admin`
3. Click **"..."** → **"Edit"**
4. Click **"Edit Password"**
5. Set a new password (remember it!)
6. Click **"Update User"**
7. Use the new password in the connection string

## Test After Getting Connection String

Once you have the correct connection string, I'll update the .env file and test it.






