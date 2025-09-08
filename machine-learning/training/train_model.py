import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
import joblib
import os

def create_synthetic_data_if_needed(df):
    """
    Ensure all expected emotions and moods are represented in the dataset
    by creating synthetic data if needed
    """
    expected_moods = ['happy', 'sad', 'angry', 'surprise', 'fear', 'disgust', 'neutral']
    expected_emotions = ['happy', 'sad', 'angry', 'surprise', 'fear', 'disgust', 'neutral']
    expected_stress_levels = ['low', 'medium', 'high']
    
    # Check what's missing
    existing_moods = set(df['mood'].unique())
    existing_emotions = set(df['face_emotion'].unique())
    existing_stress = set(df['stress_level'].unique())
    
    missing_moods = set(expected_moods) - existing_moods
    missing_emotions = set(expected_emotions) - existing_emotions
    missing_stress = set(expected_stress_levels) - existing_stress
    
    print(f"Existing moods: {sorted(existing_moods)}")
    print(f"Missing moods: {sorted(missing_moods)}")
    print(f"Existing emotions: {sorted(existing_emotions)}")
    print(f"Missing emotions: {sorted(missing_emotions)}")
    print(f"Existing stress levels: {sorted(existing_stress)}")
    print(f"Missing stress levels: {sorted(missing_stress)}")
    
    # Create synthetic data for missing combinations
    synthetic_data = []
    
    # Define typical patterns for each mood/emotion combination
    mood_emotion_patterns = {
        'happy': {'stress': 'low', 'sleep': 8, 'workload': 4, 'blink': 15, 'caffeine': 1, 'exercise': 1.5, 'screen': 4},
        'sad': {'stress': 'medium', 'sleep': 6, 'workload': 6, 'blink': 25, 'caffeine': 2, 'exercise': 0.5, 'screen': 7},
        'angry': {'stress': 'high', 'sleep': 5, 'workload': 8, 'blink': 30, 'caffeine': 3, 'exercise': 0, 'screen': 8},
        'surprise': {'stress': 'medium', 'sleep': 7, 'workload': 5, 'blink': 20, 'caffeine': 1, 'exercise': 1, 'screen': 5},
        'fear': {'stress': 'high', 'sleep': 4, 'workload': 7, 'blink': 35, 'caffeine': 2, 'exercise': 0, 'screen': 6},
        'disgust': {'stress': 'medium', 'sleep': 6, 'workload': 6, 'blink': 22, 'caffeine': 2, 'exercise': 0.5, 'screen': 6},
        'neutral': {'stress': 'low', 'sleep': 7, 'workload': 5, 'blink': 18, 'caffeine': 1, 'exercise': 1, 'screen': 5}
    }
    
    # Generate synthetic samples for missing moods/emotions
    for mood in expected_moods:
        for emotion in expected_emotions:
            # Create a few samples for each combination
            for _ in range(3):  # 3 samples per combination
                pattern = mood_emotion_patterns.get(mood, mood_emotion_patterns['neutral'])
                
                # Add some randomness to make it more realistic
                synthetic_row = {
                    'mood': mood,
                    'face_emotion': emotion,
                    'stress_level': pattern['stress'],
                    'sleep_hours': max(1, min(12, pattern['sleep'] + np.random.normal(0, 1))),
                    'workload': max(1, min(10, pattern['workload'] + np.random.randint(-2, 3))),
                    'blink_rate': max(5, min(50, pattern['blink'] + np.random.randint(-5, 6))),
                    'caffeine_intake': max(0, min(8, pattern['caffeine'] + np.random.randint(-1, 2))),
                    'exercise_hours': max(0, min(5, pattern['exercise'] + np.random.uniform(-0.5, 0.5))),
                    'screen_time': max(1, min(16, pattern['screen'] + np.random.randint(-2, 3)))
                }
                synthetic_data.append(synthetic_row)
    
    # Add synthetic data to dataframe
    if synthetic_data:
        synthetic_df = pd.DataFrame(synthetic_data)
        df = pd.concat([df, synthetic_df], ignore_index=True)
        print(f"✅ Added {len(synthetic_data)} synthetic samples")
    
    return df

def main():
    # Check if dataset exists
    if not os.path.exists("stress_data.csv"):
        print("❌ stress_data.csv not found!")
        print("Creating a sample dataset for demonstration...")
        
        # Create a sample dataset
        np.random.seed(42)
        n_samples = 1000
        
        moods = ['happy', 'sad', 'angry', 'surprise', 'fear', 'disgust', 'neutral']
        emotions = ['happy', 'sad', 'angry', 'surprise', 'fear', 'disgust', 'neutral']
        stress_levels = ['low', 'medium', 'high']
        
        sample_data = []
        for _ in range(n_samples):
            mood = np.random.choice(moods)
            emotion = np.random.choice(emotions)
            
            # Create correlations between mood and stress
            if mood in ['happy', 'neutral']:
                stress = np.random.choice(['low', 'medium'], p=[0.7, 0.3])
                sleep = np.random.normal(8, 1)
                workload = np.random.randint(1, 6)
                blink = np.random.randint(10, 20)
            elif mood in ['sad', 'surprise', 'disgust']:
                stress = np.random.choice(['medium', 'high'], p=[0.6, 0.4])
                sleep = np.random.normal(6, 1.5)
                workload = np.random.randint(4, 8)
                blink = np.random.randint(20, 30)
            else:  # angry, fear
                stress = np.random.choice(['medium', 'high'], p=[0.3, 0.7])
                sleep = np.random.normal(5, 1.5)
                workload = np.random.randint(6, 10)
                blink = np.random.randint(25, 40)
            
            sample_data.append({
                'mood': mood,
                'sleep_hours': max(1, min(12, sleep)),
                'workload': workload,
                'face_emotion': emotion,
                'blink_rate': blink,
                'caffeine_intake': np.random.randint(0, 5),
                'exercise_hours': max(0, np.random.normal(1, 0.5)),
                'screen_time': np.random.randint(2, 12),
                'stress_level': stress
            })
        
        df = pd.DataFrame(sample_data)
        df.to_csv("stress_data.csv", index=False)
        print("✅ Sample dataset created!")
    
    # Load dataset
    print("📊 Loading dataset...")
    df = pd.read_csv("stress_data.csv")
    print(f"Dataset shape: {df.shape}")
    print(f"Dataset columns: {list(df.columns)}")
    
    # Display basic info about the dataset
    print("\n📈 Dataset Info:")
    print(df.describe())
    print(f"\nUnique moods: {sorted(df['mood'].unique())}")
    print(f"Unique emotions: {sorted(df['face_emotion'].unique())}")
    print(f"Unique stress levels: {sorted(df['stress_level'].unique())}")
    
    # Ensure all expected labels are present
    df = create_synthetic_data_if_needed(df)
    
    # Encode categorical columns
    print("\n🔄 Encoding categorical variables...")
    encoders = {}
    for col in ["mood", "face_emotion", "stress_level"]:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        encoders[col] = le
        print(f"Encoded {col}: {list(le.classes_)}")

    # Features and target
    feature_columns = [
        "mood",
        "sleep_hours",
        "workload", 
        "face_emotion",
        "blink_rate",
        "caffeine_intake",
        "exercise_hours",
        "screen_time"
    ]
    
    X = df[feature_columns]
    y = df["stress_level"]
    
    print(f"\n🎯 Feature matrix shape: {X.shape}")
    print(f"Target distribution:")
    stress_counts = pd.Series(y).value_counts()
    for idx, count in stress_counts.items():
        stress_name = encoders["stress_level"].inverse_transform([idx])[0]
        print(f"  {stress_name}: {count} samples")

    # Split dataset
    print("\n✂️ Splitting dataset...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"Training set: {X_train.shape}")
    print(f"Test set: {X_test.shape}")

    # Train Random Forest
    print("\n🌳 Training Random Forest model...")
    model = RandomForestClassifier(
        n_estimators=150,
        max_depth=None,
        min_samples_split=3,
        max_features="sqrt",
        random_state=42,
        class_weight='balanced'  # Handle class imbalance
    )

    model.fit(X_train, y_train)

    # Evaluate with cross-validation
    print("\n📊 Evaluating model...")
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(model, X_train, y_train, cv=cv, scoring='accuracy')
    
    print(f"✅ Cross-validated Accuracy (train): {np.mean(cv_scores):.4f} (+/- {np.std(cv_scores) * 2:.4f})")
    print(f"✅ Accuracy on test set: {model.score(X_test, y_test):.4f}")

    # Detailed evaluation
    y_pred = model.predict(X_test)
    print("\n📋 Classification Report:")
    target_names = encoders["stress_level"].classes_
    print(classification_report(y_test, y_pred, target_names=target_names))

    # Feature importance
    print("\n🎯 Feature Importance:")
    feature_importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    for _, row in feature_importance.iterrows():
        print(f"  {row['feature']}: {row['importance']:.4f}")

    # Save model + encoders
    print("\n💾 Saving model and encoders...")
    joblib.dump(model, "stress_model.pkl")
    joblib.dump(encoders, "encoders.pkl")
    print("✅ Model + encoders saved successfully!")
    
    # Test the model with sample data
    print("\n🧪 Testing model with sample predictions...")
    test_samples = [
        {'mood': 'happy', 'face_emotion': 'happy', 'sleep_hours': 8, 'workload': 3, 'blink_rate': 15, 'caffeine_intake': 1, 'exercise_hours': 1, 'screen_time': 4},
        {'mood': 'sad', 'face_emotion': 'sad', 'sleep_hours': 5, 'workload': 8, 'blink_rate': 30, 'caffeine_intake': 3, 'exercise_hours': 0, 'screen_time': 8},
        {'mood': 'fear', 'face_emotion': 'fear', 'sleep_hours': 4, 'workload': 9, 'blink_rate': 35, 'caffeine_intake': 4, 'exercise_hours': 0, 'screen_time': 10}
    ]
    
    for i, sample in enumerate(test_samples):
        # Encode the sample
        encoded_sample = []
        encoded_sample.append(encoders["mood"].transform([sample['mood']])[0])
        encoded_sample.append(sample['sleep_hours'])
        encoded_sample.append(sample['workload'])
        encoded_sample.append(encoders["face_emotion"].transform([sample['face_emotion']])[0])
        encoded_sample.append(sample['blink_rate'])
        encoded_sample.append(sample['caffeine_intake'])
        encoded_sample.append(sample['exercise_hours'])
        encoded_sample.append(sample['screen_time'])
        
        # Make prediction
        pred = model.predict([encoded_sample])[0]
        stress_level = encoders["stress_level"].inverse_transform([pred])[0]
        
        print(f"Sample {i+1}: {sample['mood']}/{sample['face_emotion']} -> {stress_level} stress")

if __name__ == "__main__":
    main()