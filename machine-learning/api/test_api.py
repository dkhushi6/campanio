import requests

data = {
  "mood": "sad",
  "sleep_hours": 1,
  "workload": 3,
  "face_emotion": "sad",
  "blink_rate": 18,
  "caffeine_intake": 10,
  "exercise_hours": 2,
  "screen_time": 3
}


res = requests.post("http://127.0.0.1:8000/predict", json=data)
print(res.json())
