import cv2

def detect_face_emotion(image_path: str):
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)

    if len(faces) == 0:
        return "neutral"
    else:
        # For demo, assume sad if face found (replace with real classifier later)
        return "sad"

def detect_fatigue(image_path: str):
    # Placeholder: always return False
    return False
