import {View, StyleSheet, Platform, NativeModules} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNetInfo} from '@react-native-community/netinfo';
import NoInternetView from '../components/NoInternetView';
import {
  PERMISSIONS,
  RESULTS,
  checkMultiple,
  requestMultiple,
} from 'react-native-permissions';
import ActionView from '../components/ActionView';
import {useDatabase} from '../hooks/useDatabase';
import {completeSession, getLastOngoingSession, startSession} from '../data/db';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ActivityTrackingContent from '../components/ActivityTrackingContent';
import Session from '../models/Sessions';

const AndroidLocationEnabler = NativeModules.AndroidLocationEnabler;
const TrackingModule = NativeModules.TrackingModule;

export default function ActivityTrackingScreen() {
  const {isConnected} = useNetInfo();
  const db = useDatabase();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [isLocationEnabled, setLocationEnabled] = useState(false);
  const [sessionId, setSessionId] = useState(-1);
  const [lastSession, setLastSession] = useState<Session>();

  const checkPermissions = async () => {
    const permissions = Platform.select({
      android: [
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
        PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION,
      ],
      ios: [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, PERMISSIONS.IOS.MOTION],
    });

    if (!permissions) {
      return;
    }

    const statuses = await checkMultiple(permissions);
    const allGranted = Object.values(statuses).every(
      status => status === RESULTS.GRANTED,
    );
    setPermissionsGranted(allGranted);
  };

  const requestPermissions = async () => {
    const permissions = Platform.select({
      android: [
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
        PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION,
      ],
      ios: [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, PERMISSIONS.IOS.MOTION],
    });

    if (!permissions) {
      return;
    }

    const results = await requestMultiple(permissions);
    const allGranted = Object.values(results).every(
      status => status === RESULTS.GRANTED,
    );
    setPermissionsGranted(allGranted);
  };

  const checkLocationStatus = async () => {
    if (Platform.OS === 'android') {
      const checkEnabled: boolean =
        await AndroidLocationEnabler.isLocationEnabled();
      setLocationEnabled(checkEnabled);
    } else {
      setLocationEnabled(true);
    }
  };

  useEffect(() => {
    checkLocationStatus();
    checkPermissions();
  }, []);

  useEffect(() => {
    const createSession = async () => {
      const isServiceRunning = await TrackingModule.isTrackingServiceRunning();
      if (isServiceRunning && db) {
        getLastOngoingSession(db, session => {
          if (session) {
            setSessionId(session.id);
            setLastSession(session);
          }
        });
      } else if (db) {
        const id = await startSession(db);
        setSessionId(id);
      }
    };

    if (isConnected && permissionsGranted) {
      createSession();
    }
  }, [db, permissionsGranted, isConnected]);

  if (!isConnected) {
    return <NoInternetView />;
  }

  if (!isLocationEnabled) {
    return (
      <ActionView
        title="Location disabled"
        message="Location is turn off on your device. Click 'Turn on' to turn on the location."
        btnText="Turn on"
        onPress={async () => {
          if (Platform.OS === 'android') {
            try {
              const enableResult =
                await AndroidLocationEnabler.promptForEnableLocationIfNeeded(
                  {},
                );
              if (enableResult) {
                setLocationEnabled(true);
              }
            } catch (error: unknown) {
              if (error instanceof Error) {
                //console.error(error.message);
              }
            }
          }
        }}
      />
    );
  }

  if (!permissionsGranted) {
    return (
      <ActionView
        title="Permission Required"
        message="App need 'Location' and 'Activity Recognition' permissions. Allow these permissions to start. Also, make sure to 'Allow all the time' location permission is selected"
        btnText="Grant permissions"
        onPress={() => requestPermissions()}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ActivityTrackingContent
        lastSession={lastSession}
        onStop={(activity, distance) => {
          if (db) {
            completeSession(db, sessionId, activity, distance);
          }
          navigation.pop();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
