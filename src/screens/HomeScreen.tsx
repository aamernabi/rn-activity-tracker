import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import DailyChallengeCard from '../components/DailyChallengeCard';
import OverAllStatusCard from '../components/OverAllStatusCard';
import HomeHeader from '../components/HomeHeader';
import Spacer from '../components/Spacer';
import AtmosphericPressureCard from '../components/AtmosphericPressureCard';
import LightSensorCard from '../components/LightSensorCard';
import {useDatabase} from '../hooks/useDatabase';
import {fetchSessionSummary} from '../data/db';

// import { Container } from './styles';

// static for now
const TARGET_HOURS = 2;
const TARGET_CALORIES = 300;
const TARGET_DISTANCE = 4;

export default function HomeScreen() {
  const db = useDatabase();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [totalDistance, setTotalDistance] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    if (db) {
      fetchSessionSummary(db, result => {
        const distance = +(result.totalDistance / 1000).toFixed(1);
        const duration = +(result.totalDuration / 3600).toFixed(0);
        setTotalDistance(distance);
        setTotalDuration(duration);
        setTotalCalories(+result.totalCalories.toFixed(0));
      });
    }
  }, [db]);

  return (
    <View style={styles.container}>
      <HomeHeader
        name="Aamer"
        profileUrl="https://randomuser.me/api/portraits/men/1.jpg"
        style={styles.header}
        onNotificationClick={() => {}}
      />
      <ScrollView>
        <View style={styles.pressureSensorRow}>
          <AtmosphericPressureCard style={styles.sensorCard} />
          <LightSensorCard style={styles.sensorCard} />
        </View>
        <Spacer height={14} />
        <DailyChallengeCard
          style={styles.card}
          targetHours={TARGET_HOURS}
          targetCalories={TARGET_CALORIES}
          targetDistance={TARGET_DISTANCE}
          onStartClick={() => navigation.navigate('ActivityTracking')}
        />
        <Spacer height={24} />
        <OverAllStatusCard
          distance={totalDistance}
          calories={totalCalories}
          duration={totalDuration}
          style={styles.card}
        />
        <Spacer height={24} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    marginHorizontal: 16,
    shadowColor: '#d3d3d3',
  },
  pressureSensorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingHorizontal: 16,
    alignItems: 'stretch',
    flexWrap: 'nowrap',
  },
  sensorCard: {
    width: '48%',
    flexShrink: 1,
  },
});
