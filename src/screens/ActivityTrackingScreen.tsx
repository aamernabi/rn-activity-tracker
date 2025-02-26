import {View, StyleSheet, Platform} from 'react-native';
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
import {completeSession, startSession} from '../data/db';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ActivityTrackingContent from '../components/ActivityTrackingContent';

export default function ActivityTrackingScreen() {
  const {isConnected} = useNetInfo();
  const db = useDatabase();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [sessionId, setSessionId] = useState(-1);

  const checkPermissions = async () => {
    const permissions = Platform.select({
      android: [
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
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

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    const createSession = async () => {
      const id = await startSession(db);
      setSessionId(id);
    };

    if (isConnected && permissionsGranted) {
      createSession();
    }
  }, [db, permissionsGranted, isConnected]);

  if (!isConnected) {
    return <NoInternetView />;
  }

  if (!permissionsGranted) {
    return (
      <ActionView
        title="Permission Required"
        message="App need 'Location' and 'Activity Recognition' permissions. Allow these permissions to start."
        btnText="Grant permissions"
        onPress={() => requestPermissions()}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ActivityTrackingContent
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
