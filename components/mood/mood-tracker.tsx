"use client";

import React, { useState } from 'react';

interface MoodData {
  mood: string;
  sleep_hours: number;
  workload: number;
  face_emotion: string;
  blink_rate: number;
  caffeine_intake: number;
  exercise_hours: number;
  screen_time: number;
}

interface PredictionResult {
  stress_level: string;
  tips: string[];
  error?: string;
}

const MoodTracker = () => {
  const [formData, setFormData] = useState<MoodData>({
    mood: '',
    sleep_hours: 7,
    workload: 5,
    face_emotion: '',
    blink_rate: 20,
    caffeine_intake: 1,
    exercise_hours: 1,
    screen_time: 5
  });
  
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const moods = ['happy', 'sad', 'angry', 'surprise', 'fear', 'disgust', 'neutral'];
  const emotions = ['happy', 'sad', 'angry', 'surprise', 'fear', 'disgust', 'neutral'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Check if the API returned an error
      if (result.error) {
        setPrediction({
          stress_level: 'error',
          tips: [`API Error: ${result.error}`],
          error: result.error
        });
      } else {
        setPrediction(result);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setPrediction({
        stress_level: 'error',
        tips: ['Unable to connect to prediction service. Please try again later.'],
        error: 'Connection failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStressColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'high': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStressIcon = (level: string) => {
    switch (level) {
      case 'low': return '😌';
      case 'medium': return '😐';
      case 'high': return '😰';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Mood & Stress Tracker
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your daily mood and get personalized stress level insights
          </p>
        </div>

        {/* Main Content */}
        {!showForm && !prediction ? (
          <div className="text-center">
            <div className="bg-card rounded-lg shadow-lg p-8 mb-8">
              <div className="text-6xl mb-6">🧠</div>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">
                How are you feeling today?
              </h2>
              <p className="text-muted-foreground mb-6">
                Fill out a quick form to get AI-powered insights about your stress levels and personalized tips.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Start Tracking
              </button>
            </div>
          </div>
        ) : showForm ? (
          <div className="bg-card rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-card-foreground">
                Daily Mood Assessment
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Current Mood */}
                <div>
                  <label className="block text-card-foreground font-medium mb-2">
                    Current Mood
                  </label>
                  <select
                    required
                    value={formData.mood}
                    onChange={(e) => setFormData({...formData, mood: e.target.value})}
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select your mood</option>
                    {moods.map(mood => (
                      <option key={mood} value={mood}>
                        {mood.charAt(0).toUpperCase() + mood.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Face Emotion */}
                <div>
                  <label className="block text-card-foreground font-medium mb-2">
                    Facial Expression
                  </label>
                  <select
                    required
                    value={formData.face_emotion}
                    onChange={(e) => setFormData({...formData, face_emotion: e.target.value})}
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select expression</option>
                    {emotions.map(emotion => (
                      <option key={emotion} value={emotion}>
                        {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sleep Hours */}
                <div>
                  <label className="block text-card-foreground font-medium mb-2">
                    Sleep Hours (last night)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={formData.sleep_hours}
                    onChange={(e) => setFormData({...formData, sleep_hours: parseInt(e.target.value) || 0})}
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Workload */}
                <div>
                  <label className="block text-card-foreground font-medium mb-2">
                    Workload Level (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.workload}
                    onChange={(e) => setFormData({...formData, workload: parseInt(e.target.value) || 5})}
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Blink Rate */}
                <div>
                  <label className="block text-card-foreground font-medium mb-2">
                    Blink Rate (per minute)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={formData.blink_rate}
                    onChange={(e) => setFormData({...formData, blink_rate: parseInt(e.target.value) || 20})}
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Caffeine Intake */}
                <div>
                  <label className="block text-card-foreground font-medium mb-2">
                    Caffeine Intake (cups)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.caffeine_intake}
                    onChange={(e) => setFormData({...formData, caffeine_intake: parseInt(e.target.value) || 0})}
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Exercise Hours */}
                <div>
                  <label className="block text-card-foreground font-medium mb-2">
                    Exercise Hours (today)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="12"
                    step="0.5"
                    value={formData.exercise_hours}
                    onChange={(e) => setFormData({...formData, exercise_hours: parseFloat(e.target.value) || 0})}
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Screen Time */}
                <div>
                  <label className="block text-card-foreground font-medium mb-2">
                    Screen Time (hours today)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={formData.screen_time}
                    onChange={(e) => setFormData({...formData, screen_time: parseInt(e.target.value) || 0})}
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Analyzing...' : 'Get My Stress Analysis'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {/* Results */}
        {prediction && (
          <div className="bg-card rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">
                Your Stress Level Analysis
              </h2>
              {prediction.error ? (
                <div className="text-red-500">
                  <div className="text-4xl mb-2">⚠️</div>
                  <p>{prediction.tips && prediction.tips.length > 0 ? prediction.tips[0] : 'An error occurred during analysis'}</p>
                </div>
              ) : (
                <div>
                  <div className="text-6xl mb-4">
                    {getStressIcon(prediction.stress_level)}
                  </div>
                  <div className={`text-3xl font-bold mb-2 ${getStressColor(prediction.stress_level)}`}>
                    {prediction.stress_level.toUpperCase()} STRESS
                  </div>
                </div>
              )}
            </div>

            {!prediction.error && prediction.tips && (
              <div className="bg-muted rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Personalized Tips for You:
                </h3>
                <ul className="space-y-2">
                  {prediction.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-accent mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowForm(true);
                  setPrediction(null);
                }}
                className="flex-1 bg-secondary text-secondary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Track Again
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setPrediction(null);
                }}
                className="flex-1 border border-border py-3 rounded-lg font-medium text-foreground hover:bg-muted transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;