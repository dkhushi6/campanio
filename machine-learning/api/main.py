from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Absolute paths to your models
MODEL_PATH = r"D:\companio\campanio\machine-learning\training\stress_model.pkl"
ENCODERS_PATH = r"D:\companio\campanio\machine-learning\training\encoders.pkl"

try:
    # Load trained model + encoders
    model = joblib.load(MODEL_PATH)
    encoders = joblib.load(ENCODERS_PATH)
    logger.info("Model and encoders loaded successfully")
    
    # Get the classes that the encoders were trained on
    mood_classes = set(encoders["mood"].classes_)
    face_emotion_classes = set(encoders["face_emotion"].classes_)
    
    logger.info(f"Available mood classes: {mood_classes}")
    logger.info(f"Available face emotion classes: {face_emotion_classes}")
    
except Exception as e:
    logger.error(f"Error loading model or encoders: {e}")
    model = None
    encoders = None
    mood_classes = set()
    face_emotion_classes = set()

app = FastAPI(title="Stress Level Prediction API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input data model
class InputData(BaseModel):
    mood: str
    sleep_hours: int
    workload: int
    face_emotion: str
    blink_rate: int
    caffeine_intake: int
    exercise_hours: int
    screen_time: int

# Stress tips mapping
tips_mapping = {
    "low": [
        "Keep up the good routine!",
        "Maintain a balanced lifestyle.",
        "Stay hydrated and active.",
        "Continue your healthy habits."
    ],
    "medium": [
        "Take short walks or stretch breaks.",
        "Try breathing or meditation exercises.",
        "Reduce screen time when possible.",
        "Consider taking short breaks throughout the day."
    ],
    "high": [
        "Consider journaling your feelings.",
        "Talk to a friend, family member, or counselor.",
        "Limit caffeine intake and get enough sleep.",
        "Try relaxation techniques like deep breathing or yoga."
    ]
}

# Mapping for unseen labels to known labels
mood_mapping = {
    "fear": "sad",  # Map fear to sad as they're similar negative emotions
    "disgust": "angry",  # Map disgust to angry as they're both negative
    # Add more mappings as needed
}

face_emotion_mapping = {
    "fear": "sad",
    "disgust": "angry",
    # Add more mappings as needed
}

def map_to_known_label(value: str, known_classes: set, mapping: dict) -> str:
    """Map unknown labels to known ones, or return closest match"""
    if value in known_classes:
        return value
    
    if value in mapping:
        mapped_value = mapping[value]
        if mapped_value in known_classes:
            logger.info(f"Mapped unknown label '{value}' to '{mapped_value}'")
            return mapped_value
    
    # If no mapping found, use the first available class as default
    if known_classes:
        default_value = list(known_classes)[0]
        logger.warning(f"No mapping found for '{value}', using default '{default_value}'")
        return default_value
    
    # If no classes available, return the original value
    return value

def validate_numeric_ranges(data: InputData) -> InputData:
    """Validate and clamp numeric values to reasonable ranges"""
    # Clamp values to reasonable ranges
    data.sleep_hours = max(0, min(24, data.sleep_hours))
    data.workload = max(1, min(10, data.workload))
    data.blink_rate = max(5, min(60, data.blink_rate))
    data.caffeine_intake = max(0, min(20, data.caffeine_intake))
    data.exercise_hours = max(0, min(12, data.exercise_hours))
    data.screen_time = max(0, min(24, data.screen_time))
    
    return data

@app.get("/")
def read_root():
    return {
        "message": "Stress Level Prediction API",
        "status": "online",
        "model_loaded": model is not None,
        "available_moods": list(mood_classes) if mood_classes else [],
        "available_emotions": list(face_emotion_classes) if face_emotion_classes else []
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy" if model is not None else "unhealthy",
        "model_loaded": model is not None,
        "encoders_loaded": encoders is not None
    }

@app.post("/predict")
def predict(data: InputData):
    try:
        # Check if model is loaded
        if model is None or encoders is None:
            raise HTTPException(
                status_code=503, 
                detail="Model or encoders not loaded. Please check server logs."
            )
        
        # Validate and clamp numeric inputs
        data = validate_numeric_ranges(data)
        
        # Map unknown labels to known ones
        mapped_mood = map_to_known_label(data.mood, mood_classes, mood_mapping)
        mapped_face_emotion = map_to_known_label(data.face_emotion, face_emotion_classes, face_emotion_mapping)
        
        logger.info(f"Processing prediction for mood: {data.mood} -> {mapped_mood}, emotion: {data.face_emotion} -> {mapped_face_emotion}")
        
        # Encode categorical inputs with error handling
        try:
            mood_enc = encoders["mood"].transform([mapped_mood])[0]
        except Exception as e:
            logger.error(f"Error encoding mood '{mapped_mood}': {e}")
            # Use a default encoding (first class)
            mood_enc = 0
            
        try:
            face_enc = encoders["face_emotion"].transform([mapped_face_emotion])[0]
        except Exception as e:
            logger.error(f"Error encoding face emotion '{mapped_face_emotion}': {e}")
            # Use a default encoding (first class)
            face_enc = 0

        # Prepare input array for model
        X = np.array([[
            mood_enc,
            data.sleep_hours,
            data.workload,
            face_enc,
            data.blink_rate,
            data.caffeine_intake,
            data.exercise_hours,
            data.screen_time
        ]], dtype=float)

        logger.info(f"Input array shape: {X.shape}, values: {X[0]}")

        # Make prediction
        pred = model.predict(X)[0]
        logger.info(f"Model prediction: {pred}")
        
        # Decode stress level with error handling
        try:
            stress_level = encoders["stress_level"].inverse_transform([pred])[0]
        except Exception as e:
            logger.error(f"Error decoding stress level {pred}: {e}")
            # Default to medium if decoding fails
            stress_level = "medium"

        # Get tips for the stress level
        tips = tips_mapping.get(stress_level, tips_mapping["medium"])
        
        logger.info(f"Prediction successful: {stress_level}")

        # Return stress level and tips
        return {
            "stress_level": stress_level,
            "tips": tips,
            "input_mappings": {
                "original_mood": data.mood,
                "mapped_mood": mapped_mood,
                "original_face_emotion": data.face_emotion,
                "mapped_face_emotion": mapped_face_emotion
            } if (data.mood != mapped_mood or data.face_emotion != mapped_face_emotion) else None
        }

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}", exc_info=True)
        return {
            "error": f"Prediction failed: {str(e)}",
            "tips": ["Unable to analyze your data right now. Please try again later."]
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)