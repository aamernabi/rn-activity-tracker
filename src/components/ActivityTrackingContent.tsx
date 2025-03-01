import Icon from '@react-native-vector-icons/material-design-icons';
import useActivityTracker from '../hooks/useActivityTracker';
import LocationTracker from './LocationTracker2';
import {
  Alert,
  BackHandler,
  DeviceEventEmitter,
  NativeModules,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Spacer from './Spacer';
import React, {useEffect} from 'react';
import {Card} from 'react-native-paper';
import {formatSeconds} from '../utils/datetime';
import useDistanceTracker from '../hooks/useDistanceTracker';
import Session from '../models/Sessions';

const TrackingModule = NativeModules.TrackingModule;

const handleStopTracking = (onConfirm: () => void) => {
  Alert.alert('Confirmation!', 'Are you sure you want to stop tracking?', [
    {text: 'Cancel', style: 'cancel'},
    {
      text: 'YES',
      onPress: async () => {
        onConfirm();
        const isServiceRunning =
          await TrackingModule.isTrackingServiceRunning();
        if (isServiceRunning) {
          DeviceEventEmitter.removeAllListeners('onLocationUpdate');
          await TrackingModule.stopTrackingService();
        }
      },
    },
  ]);
};

export interface InfoCardProps {
  type: 'Activity' | 'Duration' | 'Distance';
  value: string;
}

export interface ActivityTrackingContentProps {
  lastSession?: Session;
  onStop: (activity: string, distance: number) => void;
}

const InfoCard: React.FC<InfoCardProps> = props => {
  return (
    <Card style={styles.infoCard}>
      <Text style={styles.infoCardTitle}>{props.type}</Text>
      <Spacer height={4} />
      <Text style={styles.infoCardValue}>{props.value}</Text>
    </Card>
  );
};

const ActivityTrackingContent: React.FC<
  ActivityTrackingContentProps
> = props => {
  const {activity, duration, setDuration} = useActivityTracker();
  const {distance, handleNewDistance, setDistance} = useDistanceTracker();

  useEffect(() => {
    const backAction = () => {
      handleStopTracking(() => props.onStop(activity, distance));
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [activity, distance, props]);

  useEffect(() => {
    if (props.lastSession) {
      setDuration(props.lastSession.duration);
      setDistance(props.lastSession.distance);
    }
  }, [props.lastSession, setDuration, setDistance]);

  return (
    <>
      <LocationTracker onNewDistance={handleNewDistance} />
      <View style={styles.cardsContainer}>
        <Spacer width={42} />
        <InfoCard type="Activity" value={activity} />
        <InfoCard type="Duration" value={`${formatSeconds(duration)}`} />
        <InfoCard type="Distance" value={`${Math.floor(distance)}m`} />
      </View>
      <Spacer flex={1} />
      <TouchableOpacity
        onPress={() =>
          handleStopTracking(() => props.onStop(activity, distance))
        }
        style={styles.stopButton}>
        <Icon name="stop-circle-outline" size={40} color="white" />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  stopButton: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: '#9c3333',
    opacity: 0.8,
    elevation: 3,
    shadowColor: '#d3d3d3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCard: {
    backgroundColor: '#fff',
    shadowColor: '#d3d3d3',
    padding: 16,
    elevation: 3,
    borderRadius: 8,
    marginHorizontal: 12,
    marginVertical: 6,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCardTitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  infoCardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ActivityTrackingContent;
