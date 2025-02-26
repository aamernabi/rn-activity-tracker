import {View, Text, ViewStyle, StyleProp, StyleSheet} from 'react-native';
import React from 'react';
import Icon from '@react-native-vector-icons/feather';
import IonIcon from '@react-native-vector-icons/ionicons';
import {Card} from 'react-native-paper';

interface OverAllStatusCardProps {
  calories: number;
  distance: number;
  duration: number;
  style?: StyleProp<ViewStyle>;
}

const OverAllStatusCard: React.FC<OverAllStatusCardProps> = props => {
  return (
    <Card style={StyleSheet.flatten([props.style, styles.card])}>
      <View>
        <Text style={styles.headingText}>Overall Status</Text>
        <View style={styles.statusContainer}>
          <View style={styles.statusBox}>
            <Icon name="clock" size={24} color="red" />
            <Text
              style={styles.statusValue}
              numberOfLines={3}
              ellipsizeMode="tail">
              {props.duration} Hours
            </Text>
            <Text style={styles.statusLabel}>Duration</Text>
          </View>
          <View style={styles.statusBox}>
            <IonIcon name="flame-outline" size={24} color="orange" />
            <Text
              style={styles.statusValue}
              numberOfLines={3}
              ellipsizeMode="tail">
              {props.calories} kcal
            </Text>
            <Text style={styles.statusLabel}>Calories</Text>
          </View>
          <View style={styles.statusBox}>
            <IonIcon name="footsteps-outline" size={24} color="purple" />
            <Text
              style={styles.statusValue}
              numberOfLines={3}
              ellipsizeMode="tail">
              {props.distance} km
            </Text>
            <Text style={styles.statusLabel}>Distance</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
  },
  headingText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'gray',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 24,
  },
  statusBox: {
    backgroundColor: '#fff',
    flex: 1,
    borderRadius: 10,
    borderColor: '#d3d3d3',
    borderWidth: 0.5,
    paddingVertical: 24,
    alignItems: 'center',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 2,
    textAlign: 'center',
  },
  statusLabel: {fontSize: 12, color: '#777'},
});

export default OverAllStatusCard;
