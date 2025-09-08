"use client";

import React, { useState } from 'react';
import FaceAnalysis from './FaceAnalysis'; // Make sure the path is correct

// ... (keep your existing interfaces)
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

// UPDATE: Add eye_strain to the prediction result
interface PredictionResult {
  stress_level: string;
  tips: string[];
  eye_strain?: {
    level: 'low' | 'medium' | 'high';
    message: string;
    exercises: string[];
  };
  error?: string;
}

type AppStep = 'welcome' | 'face_analysis' | 'form' | 'results';

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
  const [currentStep, setCurrentStep] = useState<AppStep>('welcome');

  const moods = ['happy', 'sad', 'angry', 'surprise', 'fear', 'disgust', 'neutral'];
  // We no longer need the 'emotions' array, as it's detected automatically.

  // --- NEW: Function to handle completion of face analysis ---
  const handleAnalysisComplete = (analysis: { emotion: string; blinkRate: number }) => {
    setFormData(prevData => ({
      ...prevData,
      face_emotion: analysis.emotion,
      blink_rate: analysis.blinkRate,
    }));
    setCurrentStep('form'); // Move to the form step
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      setPrediction(result);
      setCurrentStep('results'); // Move to results step
    } catch (error) {
      console.error('Fetch error:', error);
      setPrediction({
        stress_level: 'error',
        tips: ['Unable to connect to prediction service.'],
        error: 'Connection failed'
      });
      setCurrentStep('results'); // Show error on results step
    } finally {
      setLoading(false);
    }
  };

  // Reset function to go back to the beginning
  const handleReset = () => {
      setPrediction(null);
      setCurrentStep('welcome');
  }

  // ... (keep getStressColor and getStressIcon functions)
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
                Wellness Tracker
            </h1>
            <p className="text-muted-foreground text-lg">
                Get AI-powered insights into your stress and eye strain.
            </p>
        </div>

        {/* --- Step 1: Welcome Screen --- */}
        {currentStep === 'welcome' && (
          <div className="text-center">
            <div className="bg-card rounded-lg shadow-lg p-8">
              <div className="text-6xl mb-6">🧠+👁️</div>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">
                Ready for your wellness check-in?
              </h2>
              <p className="text-muted-foreground mb-6">
                We'll start with a quick face analysis to check for signs of eye strain and emotion, then ask a few questions.
              </p>
              <button
                onClick={() => setCurrentStep('face_analysis')}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Start Analysis
              </button>
            </div>
          </div>
        )}

        {/* --- Step 2: Face Analysis --- */}
        {currentStep === 'face_analysis' && (
          <FaceAnalysis onAnalysisComplete={handleAnalysisComplete} />
        )}

        {/* --- Step 3: The Form --- */}
        {currentStep === 'form' && (
          <div className="bg-card rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-card-foreground mb-6">
              Just a few more details...
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Current Mood (Manual) */}
                <div>
                  <label className="block text-card-foreground font-medium mb-2">Your Perceived Mood</label>
                  <select
                    required
                    value={formData.mood}
                    onChange={(e) => setFormData({...formData, mood: e.target.value})}
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="">Select your mood</option>
                    {moods.map(mood => (
                      <option key={mood} value={mood}>
                        {mood.charAt(0).toUpperCase() + mood.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Facial Expression (Auto-filled) */}
                <div>
                  <label className="block text-card-foreground font-medium mb-2">Detected Facial Expression</label>
                  <input
                    type="text"
                    readOnly
                    value={formData.face_emotion.charAt(0).toUpperCase() + formData.face_emotion.slice(1)}
                    className="w-full p-3 border border-border rounded-lg bg-muted text-muted-foreground"
                  />
                </div>
                
                {/* Blink Rate (Auto-filled) */}
                <div>
                  <label className="block text-card-foreground font-medium mb-2">Detected Blink Rate (per minute)</label>
                  <input
                    type="number"
                    readOnly
                    value={formData.blink_rate}
                    className="w-full p-3 border border-border rounded-lg bg-muted text-muted-foreground"
                  />
                </div>
                
                {/* The rest of your form fields... */}
                {/* Sleep Hours */}
                <div>
                    <label className="block text-card-foreground font-medium mb-2">Sleep Hours (last night)</label>
                    <input type="number" min="0" max="24" value={formData.sleep_hours} onChange={(e) => setFormData({...formData, sleep_hours: parseInt(e.target.value) || 0})} className="w-full p-3 border border-border rounded-lg bg-background text-foreground" />
                </div>
                {/* Workload */}
                <div>
                    <label className="block text-card-foreground font-medium mb-2">Workload Level (1-10)</label>
                    <input type="number" min="1" max="10" value={formData.workload} onChange={(e) => setFormData({...formData, workload: parseInt(e.target.value) || 5})} className="w-full p-3 border border-border rounded-lg bg-background text-foreground" />
                </div>
                {/* Screen Time */}
                <div>
                    <label className="block text-card-foreground font-medium mb-2">Screen Time (hours today)</label>
                    <input type="number" min="0" max="24" value={formData.screen_time} onChange={(e) => setFormData({...formData, screen_time: parseInt(e.target.value) || 0})} className="w-full p-3 border border-border rounded-lg bg-background text-foreground" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                {loading ? 'Analyzing...' : 'Get My Full Analysis'}
              </button>
            </form>
          </div>
        )}

        {/* --- Step 4: Results --- */}
        {currentStep === 'results' && prediction && (
            <div className="bg-card rounded-lg shadow-lg p-8 animate-fade-in">
                {/* Stress Level Analysis */}
                <div className="text-center mb-8 border-b border-border pb-8">
                    <h2 className="text-2xl font-semibold text-card-foreground mb-4">Your Stress Level Analysis</h2>
                    <div className="text-6xl mb-4">{getStressIcon(prediction.stress_level)}</div>
                    <div className={`text-3xl font-bold mb-2 ${getStressColor(prediction.stress_level)}`}>
                        {prediction.stress_level.toUpperCase()} STRESS
                    </div>
                </div>

                {/* NEW: Eye Strain Analysis */}
                {prediction.eye_strain && (
                    <div className="mb-8 border-b border-border pb-8">
                        <h3 className="text-xl font-semibold text-foreground mb-4 text-center">👁️ Eye Strain Report</h3>
                        <div className="text-center mb-4">
                            <p className="text-lg font-medium text-foreground">Level: <span className="font-bold">{prediction.eye_strain.level.toUpperCase()}</span></p>
                            <p className="text-muted-foreground">{prediction.eye_strain.message}</p>
                        </div>
                        {prediction.eye_strain.exercises.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-foreground mb-2">Recommended Exercises:</h4>
                                <ul className="space-y-2">
                                    {prediction.eye_strain.exercises.map((exercise, index) => (
                                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                                            <span>✅</span><span>{exercise}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
                
                {/* Personalized Tips for Stress */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-foreground mb-4 text-center">💡 Personalized Tips for Stress</h3>
                    <ul className="space-y-2">
                        {prediction.tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2 text-muted-foreground">
                            <span className="text-accent mt-1">•</span><span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <button onClick={handleReset} className="w-full bg-secondary text-secondary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
                    Start Over
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;