import {useEffect, useState} from 'react';
import {
  accelerometer,
  gyroscope,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import {PermissionsAndroid, Platform} from 'react-native';
import {Subscription} from 'rxjs';
import useSmoothedActivity from './useSmoothedActivity';

const IGNORE_READING_COUNT = 30;

const useActivityTracker = () => {
  const [activityHistory, setActivityHistory] = useState<string[]>([]);
  const [duration, setDuration] = useState(0);
  const smoothedActivity = useSmoothedActivity(activityHistory);
  const alpha = 0.1; // Low-pass filter factor
  const maxHistorySize = 10;

  const requestPermissions = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 29) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  useEffect(() => {
    let accelerometerSubscription: Subscription;
    let gyroscopeSubscription: Subscription;
    let startTime = Date.now();

    let lastAcceleration = {x: 0, y: 0, z: 0};
    let readingsCount = 0;

    const interval = setInterval(() => {
      setDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    const startTracking = async () => {
      const permissionGranted = await requestPermissions();
      if (!permissionGranted) {
        return;
      }

      setUpdateIntervalForType(SensorTypes.accelerometer, 500);

      accelerometerSubscription = accelerometer.subscribe({
        next: ({x, y, z}) => {
          if (readingsCount <= IGNORE_READING_COUNT) {
            readingsCount++;
            return;
          }

          // Apply Low-pass filter to smooth values
          lastAcceleration.x = alpha * x + (1 - alpha) * lastAcceleration.x;
          lastAcceleration.y = alpha * y + (1 - alpha) * lastAcceleration.y;
          lastAcceleration.z = alpha * z + (1 - alpha) * lastAcceleration.z;

          const filteredAcceleration = Math.sqrt(
            lastAcceleration.x ** 2 +
              lastAcceleration.y ** 2 +
              lastAcceleration.z ** 2,
          );

          // Normalize against gravity (Earth's gravitational force is ~9.81 m/s²)
          const normalizedAcceleration = Math.abs(filteredAcceleration - 9.81);
          console.log(normalizedAcceleration);

          let newActivity = 'Stationary';
          if (normalizedAcceleration >= 0.2 && normalizedAcceleration < 1.5) {
            newActivity = 'Walking';
          } else if (normalizedAcceleration >= 1.5) {
            newActivity = 'Running';
          }

          setActivityHistory(prevHistory => {
            const updatedHistory = [...prevHistory, newActivity];
            return updatedHistory.length > maxHistorySize
              ? updatedHistory.slice(-maxHistorySize)
              : updatedHistory;
          });
        },
        error: e => console.log('Accelerometer error:', e),
      });

      setUpdateIntervalForType(SensorTypes.gyroscope, 500);
      gyroscopeSubscription = gyroscope.subscribe({
        next: ({x, y, z}) => {
          if (Math.abs(x) > 2 || Math.abs(y) > 2 || Math.abs(z) > 2) {
            setActivityHistory(prevHistory => {
              const updatedHistory = [...prevHistory, 'Running'];
              return updatedHistory.length > maxHistorySize
                ? updatedHistory.slice(-maxHistorySize)
                : updatedHistory;
            });
          }
        },
        error: err => console.log('Gyroscope error:', err),
      });
    };

    startTracking();

    return () => {
      accelerometerSubscription?.unsubscribe();
      gyroscopeSubscription?.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return {
    activity: smoothedActivity,
    duration: duration,
    setDuration: setDuration,
  };
};

export default useActivityTracker;
