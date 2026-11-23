
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError
from io import BytesIO
from backend.predictor import predict_image
from backend.assistant import get_waste_guidance, chat_with_assistant
from pydantic import BaseModel

# Create FastAPI application
app = FastAPI(
    title="EcoSort AI API",
    description="AI-powered waste classification API",
    version="1.0.0"
)


# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:5501",
        "http://localhost:5501"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Home route
@app.get("/")
def home():
    return {
        "message": "Welcome to EcoSort AI API",
        "status": "Running"
    }


# Waste prediction route
@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    # Check file type
    if file.content_type not in [
        "image/jpeg",
        "image/png",
        "image/webp"
    ]:
        raise HTTPException(
            status_code=400,
            detail="Please upload a JPG, PNG, or WEBP image."
        )

    try:
        # Read uploaded image
        contents = await file.read()

        if not contents:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty."
            )

        # Open and validate image
        image = Image.open(BytesIO(contents)).convert("RGB")

        # Predict waste category
        result = predict_image(image)

        # Generate AI recycling guidance
        guidance_result = get_waste_guidance(
            result["predicted_class"]
        )

        # Return prediction and recycling guidance
        return {
            "filename": file.filename,
            "predicted_class": result["predicted_class"],
            "confidence": result["confidence"],
            "top_predictions": result["top_predictions"],
            "waste_guidance": guidance_result
        }

    except UnidentifiedImageError:
        raise HTTPException(
            status_code=400,
            detail="Invalid image file."
        )
     
# --------------------------------------------------
# CHATBOT API
# --------------------------------------------------

class ChatRequest(BaseModel):
    message: str


@app.post("/ask")
async def ask_question(request: ChatRequest):

    if not request.message.strip():
        raise HTTPException(
            status_code=400,
            detail="Please enter a message."
        )

    result = chat_with_assistant(request.message)

    return result
