import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import joblib
import numpy as np

# Load extended dataset
df = pd.read_csv("stress_data.csv")

# Encode categorical columns
encoders = {}
for col in ["mood", "face_emotion", "stress_level"]:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

# Features and target
X = df[["mood", "sleep_hours", "workload", "face_emotion", 
        "blink_rate", "caffeine_intake", "exercise_hours", "screen_time"]]
y = df["stress_level"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Train Random Forest
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=None,
    min_samples_split=3,
    max_features="sqrt",
    random_state=42
)

model.fit(X_train, y_train)

# Evaluate with cross-validation
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(model, X_train, y_train, cv=cv)
print("✅ Cross-validated Accuracy (train):", np.mean(cv_scores))
print("✅ Accuracy on test set:", model.score(X_test, y_test))

# Feature importances (optional, useful for platform insights)
importances = dict(zip(X.columns, model.feature_importances_))
print("📊 Feature importances:", importances)

# Save model + encoders
joblib.dump(model, "stress_model.pkl")
joblib.dump(encoders, "encoders.pkl")
print("✅ Updated model + encoders saved")
