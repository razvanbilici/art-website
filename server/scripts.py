# Check for creator requests once every hour

from pymongo import MongoClient
from time import sleep
from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

CONNECTION_STRING = os.getenv("DB_CONNECTION_STRING")
client = MongoClient(CONNECTION_STRING)

def fetch():
    db = client["test"]
    collection = db["users"]
    
    return collection.find({"creatorRequest": True})

while True:
    requests = fetch()

    with open("creator_requests.txt", "w") as file:
        for request in requests:
            userID = request.get("userID")
            name = request.get("name")

            file.write(f"userID: {userID}, name: {name}\n")

    sleep(3600)
