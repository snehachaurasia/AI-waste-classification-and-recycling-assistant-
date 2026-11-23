import os
import json
import numpy as np
import tensorflow as tf

# Get main project directory
BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

# Path of the newly trained MobileNetV2 model
MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "EcoSort_AI_MobileNetV2_90.keras"
)

# Path of class names
CLASS_NAMES_PATH = os.path.join(
    BASE_DIR,
    "models",
    "class_names.json"
)

# Check whether model exists
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"Model not found: {MODEL_PATH}"
    )

# Check whether class names exist
if not os.path.exists(CLASS_NAMES_PATH):
    raise FileNotFoundError(
        f"Class names not found: {CLASS_NAMES_PATH}"
    )

# Load trained model
model = tf.keras.models.load_model(MODEL_PATH)

# Load class names
with open(CLASS_NAMES_PATH, "r") as file:
    class_names = json.load(file)

# Image size used during training
IMAGE_SIZE = (256, 256)

# Verify model and class names
if model.input_shape[1:3] != IMAGE_SIZE:
    raise ValueError(
        f"Model input size does not match {IMAGE_SIZE}"
    )

if model.output_shape[-1] != len(class_names):
    raise ValueError(
        "Number of model outputs does not match class names."
    )


def predict_image(image):
    """
    Predict waste category from an uploaded image.
    """

    # Convert image to RGB
    image = image.convert("RGB")

    # Resize image to 256 x 256
    image = image.resize(IMAGE_SIZE)

    # Convert image into NumPy array
    image_array = tf.keras.utils.img_to_array(image)

    # Add batch dimension
    image_array = np.expand_dims(
        image_array,
        axis=0
    )

    # IMPORTANT:
    # Do not apply preprocess_input() here.
    # MobileNetV2 preprocessing is already
    # included inside the saved model.

    # Generate prediction
    predictions = model.predict(
        image_array,
        verbose=0
    )[0]

    # Get top 3 predictions
    top_indices = np.argsort(predictions)[-3:][::-1]

    top_predictions = []

    for index in top_indices:
        top_predictions.append({
            "category": class_names[int(index)],
            "confidence": round(
                float(predictions[index]) * 100, 2
            )
        })

    # Get highest prediction
    predicted_index = int(top_indices[0])

    return {
        "predicted_class": class_names[predicted_index],
        "confidence": round(
            float(predictions[predicted_index]) * 100, 2
        ),
        "top_predictions": top_predictions
    }