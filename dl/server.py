import os
from classify_app import app
from dotenv import load_dotenv

# Load environment variables from a specific path
from pathlib import Path
load_dotenv(Path("..") / ".env")  # Adjust the path to the .env file

PORT = int(os.getenv("FASTAPI_PORT", 5050))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
