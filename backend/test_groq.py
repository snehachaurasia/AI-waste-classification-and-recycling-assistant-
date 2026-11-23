
import os
from pathlib import Path
from dotenv import load_dotenv
from groq import Groq

# Load API key from the main project folder
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env", override=True)

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    print("ERROR: API key not found.")
else:
    try:
        client = Groq(api_key=api_key)

        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "user",
                    "content": "Reply exactly: Groq connection successful!"
                }
            ],
            max_completion_tokens=100
        )

        print("SUCCESS!")
        print(response.choices[0].message.content)

    except Exception as e:
        print("Groq API error:", e)
