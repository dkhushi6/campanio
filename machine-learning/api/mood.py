import cv2
from deepface import DeepFace
import requests

API_URL = "http://127.0.0.1:8000/predict"  # FastAPI backend URL

# Example fixed values for other features
DEFAULT_DATA = {
    "sleep_hours": 6,
    "workload": 5,
    "blink_rate": 20,
    "caffeine_intake": 1,
    "exercise_hours": 1,
    "screen_time": 5
}

# Open webcam
cap = cv2.VideoCapture(0)

print("🎥 Press 'q' to quit.")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    try:
        # Detect emotions
        result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
        mood = result[0]['dominant_emotion']
        print("Detected mood:", mood)

        # Send to FastAPI
        payload = {
            "mood": mood,
            "sleep_hours": DEFAULT_DATA["sleep_hours"],
            "workload": DEFAULT_DATA["workload"],
            "face_emotion": mood,
            "blink_rate": DEFAULT_DATA["blink_rate"],
            "caffeine_intake": DEFAULT_DATA["caffeine_intake"],
            "exercise_hours": DEFAULT_DATA["exercise_hours"],
            "screen_time": DEFAULT_DATA["screen_time"]
        }

        response = requests.post(API_URL, json=payload)
        if response.status_code == 200:
            print("Stress Prediction:", response.json())
        else:
            print("API Error:", response.text)

    except Exception as e:
        print("Error:", str(e))

    # Quit with q
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
