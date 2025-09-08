from fastapi import APIRouter
from .schemas import StressInput, StressOutput
import joblib
import os
import pandas as pd

router = APIRouter()

# Load model
model_path = os.path.join(os.path.dirname(__file__), "../models/stress_model.pkl")
model = joblib.load(model_path)

@router.post("/predict", response_model=StressOutput)
def predict_stress(data: StressInput):
    # Convert input to DataFrame
    X = pd.DataFrame([{
        "mood": data.mood,
        "sleep": data.sleep,
        "workload": data.workload
    }])
    
    prediction = model.predict(X)[0]

    # Simple tips
    tips = []
    if prediction == "low":
        tips = ["Keep it up!", "Maintain good sleep habits."]
    elif prediction == "medium":
        tips = ["Take short breaks.", "Practice deep breathing."]
    else:
        tips = ["Talk to a friend.", "Get enough rest."]

    return {"stress_level": prediction, "tips": tips}
