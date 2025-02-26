import {useEffect, useState} from 'react';

const useSmoothedActivity = (activityHistory: string[], weightFactor = 0.7) => {
  const [smoothedActivity, setSmoothedActivity] = useState('Stationary');

  useEffect(() => {
    if (activityHistory.length === 0) {
      return;
    }

    const activityWeights: Record<string, number> = {
      Stationary: 0,
      Walking: 0,
      Running: 0,
    };
    let weight = 1;

    // Apply exponential moving average (recent values weigh more)
    for (let i = activityHistory.length - 1; i >= 0; i--) {
      const act = activityHistory[i];
      activityWeights[act] = (activityWeights[act] || 0) + weight;
      weight *= weightFactor;
    }

    // Find the dominant activity
    let mostFrequent = 'Stationary';
    let maxWeight = 0;
    Object.keys(activityWeights).forEach(key => {
      if (activityWeights[key] > maxWeight) {
        mostFrequent = key;
        maxWeight = activityWeights[key];
      }
    });

    setSmoothedActivity(mostFrequent);
  }, [activityHistory, weightFactor]);

  return smoothedActivity;
};

export default useSmoothedActivity;
