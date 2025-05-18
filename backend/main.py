from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import os

from openai import OpenAI


OPEN_AI_KEY = os.environ.get("OPENAI_API_KEY")

client = OpenAI(api_key=OPEN_AI_KEY)

# Create FastAPI instance
app = FastAPI()

# Allow all origins to make requests to this server (for development purposes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Create a Pydantic model for the incoming query
# Input model
  # Replace with your actual key

class SearchQuery(BaseModel):
    query: str

@app.post("/search")
async def search_jobs(search: SearchQuery):
    prompt = f"""
You are a job expert assistant.

Based on the following professional background, return a JSON array of 10 job listings. Each listing must include:
- company_name
- position_name
- location

Respond ONLY with JSON.

Example:
[
  {{
    "company_name": "Google",
    "position_name": "Software Engineer",
    "location": "Remote",
    "
  }},
  ...
]

{search.query}
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1000
        )

        result = response.choices[0].message.content.strip()

        # Try parsing the result into Python JSON (to validate)
        import json
        jobs = json.loads(result)
        return {"results": jobs}

    except Exception as e:
        print("Error:", str(e))
        return {"error": str(e)}
