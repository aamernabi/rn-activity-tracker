import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {Card} from 'react-native-paper';
import {format} from 'date-fns';
import Icon from '@react-native-vector-icons/material-design-icons';

interface DailyChallengeCardProps {
  targetHours: number;
  targetCalories: number;
  targetDistance: number;
  onStartClick: () => void;
  style?: StyleProp<ViewStyle>;
}

const DailyChallengeCard: React.FC<DailyChallengeCardProps> = props => {
  const date = format(new Date(), 'EEEE, dd MMM yyyy');
  return (
    <Card style={StyleSheet.flatten([props.style, styles.card])}>
      <Image
        source={require('../assets/map-placeholder.jpg')}
        style={styles.mapImage}
      />
      <Text style={styles.cardTitle}>Daily Challenge</Text>
      <Text style={styles.date}>{date}</Text>
      <View style={styles.statsRow}>
        <Text style={styles.stat}>⏳ {props.targetHours} hours</Text>
        <Text style={styles.stat}>🔥 {props.targetCalories} kcal</Text>
        <Text style={styles.stat}>🚩 {props.targetDistance} km</Text>
      </View>
      <TouchableOpacity style={styles.startButton} onPress={props.onStartClick}>
        <View style={styles.startButtonContainer}>
          <Icon name="run-fast" size={16} color="#fff" />
          <Text style={styles.startButtonText}>Start</Text>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
  },
  mapImage: {width: '100%', height: 164, borderRadius: 10},
  cardTitle: {fontSize: 18, fontWeight: 'bold', marginTop: 10},
  date: {fontSize: 14, color: '#888'},
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  stat: {fontSize: 14, color: '#333'},
  startButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  startButtonContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
});

export default DailyChallengeCard;
