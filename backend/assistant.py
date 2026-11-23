
import os
import json
from pathlib import Path

from dotenv import load_dotenv
from groq import Groq


# --------------------------------------------------
# FILE PATHS AND API CONFIGURATION
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent

KNOWLEDGE_BASE_PATH = BASE_DIR / "knowledge_base.json"

load_dotenv(PROJECT_DIR / ".env")

API_KEY = os.getenv("GROQ_API_KEY")

if not API_KEY:
    raise RuntimeError("GROQ_API_KEY not found in the project .env file.")

client = Groq(api_key=API_KEY)


# --------------------------------------------------
# LOAD WASTE KNOWLEDGE BASE
# --------------------------------------------------

try:
    with open(KNOWLEDGE_BASE_PATH, "r", encoding="utf-8") as file:
        KNOWLEDGE_BASE = json.load(file)

except FileNotFoundError:
    raise RuntimeError("knowledge_base.json was not found in the backend folder.")

except json.JSONDecodeError:
    raise RuntimeError("knowledge_base.json contains invalid JSON.")


# --------------------------------------------------
# GENERATE RECYCLING GUIDANCE
# --------------------------------------------------

def get_waste_guidance(waste_category):

    category = str(waste_category).strip().lower()

    # Check whether the predicted category exists
    if category not in KNOWLEDGE_BASE:
        return {
            "success": False,
            "guidance": "Sorry, recycling guidance is not available for this waste category."
        }

    # Retrieve information about the detected waste
    waste_info = KNOWLEDGE_BASE[category]

    system_prompt = """
    You are EcoSort AI, a helpful waste management and recycling assistant.

    Your responsibility is to educate users about waste segregation,
    recycling, safe disposal, and environmental protection.

    Use the supplied knowledge base as your primary source of information.

    Rules:
    1. Explain everything in simple and easy English.
    2. Give practical, step-by-step recycling instructions.
    3. Explain how to prepare the waste before recycling.
    4. Include reuse ideas where appropriate.
    5. Mention important safety precautions.
    6. Explain the environmental benefits.
    7. Never invent recycling centres, addresses, or collection services.
    8. If local recycling availability is unknown, tell users to check
       their municipal waste collection guidelines.
    9. Do not recommend unsafe handling or disposal practices.
    10. Use clear headings and bullet points.
    """

    user_prompt = f"""
    Detected waste category: {waste_info.get("name", category)}

    Knowledge base information:

    {json.dumps(waste_info, indent=2)}

    Generate recycling guidance using these sections:

    1. About This Waste
    2. How to Prepare It
    3. Recycling Process
    4. How to Dispose of It
    5. Reuse Ideas
    6. Environmental Impact
    7. Safety Precautions

    Make the explanation informative, practical, and easy to understand.
    """

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_prompt
                }
            ],
            temperature=0.3,
            max_completion_tokens=1200
        )

        guidance = response.choices[0].message.content

        return {
            "success": True,
            "category": category,
            "guidance": guidance
        }

    except Exception as error:
        print("Groq guidance error:", error)

        return {
            "success": False,
            "category": category,
            "guidance": "AI guidance is temporarily unavailable. Please try again later."
        }

# --------------------------------------------------
# GENERAL ECO SORT AI CHATBOT
# --------------------------------------------------

def chat_with_assistant(user_message):

    system_prompt = """
    You are EcoSort AI, an intelligent waste management
    and environmental protection chatbot.

    Your responsibilities:
    1. Answer questions about waste management.
    2. Explain waste segregation and recycling.
    3. Provide information about plastic, paper, glass,
       metal, electronic and organic waste.
    4. Explain environmental protection and sustainability.
    5. Give practical waste disposal instructions.
    6. Use simple and easy English.
    7. Keep answers clear and helpful.
    8. If a question is unrelated to waste management,
       politely explain that you specialize in waste
       management and environmental topics.
    """

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            temperature=0.3,
            max_completion_tokens=1000
        )

        answer = response.choices[0].message.content

        return {
            "success": True,
            "response": answer
        }

    except Exception as error:
        print("Chatbot error:", error)

        return {
            "success": False,
            "response": "Sorry, I am unable to answer right now. Please try again."
        }
