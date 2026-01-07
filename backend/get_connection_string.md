# Get MongoDB Connection String from Atlas

## Best Way: Get Connection String Directly from MongoDB Atlas

1. Go to MongoDB Atlas: https://cloud.mongodb.com/
2. Click **"Connect"** button on your cluster
3. Select **"Connect your application"**
4. Choose **"Python"** and version **"3.12 or later"**
5. Copy the connection string shown
6. It will look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=EduTechAI
   ```
7. Replace `<username>` and `<password>` with your actual credentials
8. Use that exact connection string in the .env file

## Or Verify Current User

1. Go to **Database Access**
2. Find the user `mohammedsohail@admin` or similar
3. Click the **"..."** menu next to the user
4. Click **"Edit"** to see/reset the password
5. Make sure you're using the exact password shown there

## Common Issues

- Username might be just `mohammedsohail` (without @admin)
- Password might have special characters that need encoding
- User might need to be recreated

## Quick Test

After getting the connection string from Atlas, update the .env file and test:
```bash
python test_mongodb_direct.py
```





