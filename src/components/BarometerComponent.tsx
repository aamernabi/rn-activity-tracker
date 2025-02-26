import Icon from '@react-native-vector-icons/material-design-icons';
import {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Card} from 'react-native-paper';
import {
  SensorTypes,
  setUpdateIntervalForType,
  barometer,
} from 'react-native-sensors';

const AtmosphericPressureCard = () => {
  const [pressure, setPressure] = useState<number | null>(null);

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.barometer, 1000); // Update every second

    const subscription = barometer.subscribe({
      next: result => setPressure(result.pressure),
      error: err => console.log('Barometer error:', err),
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Card style={styles.card} elevation={4}>
      <View style={styles.content}>
        <Icon name="gauge" size={40} color="#6200ea" />
        <View style={styles.textContainer}>
          <Text style={styles.label}>Atmospheric Pressure</Text>
          <Text style={styles.value}>
            {pressure !== null ? `${pressure.toFixed(2)} hPa` : 'N/A'}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 15,
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 18,
    color: '#6200ea',
    fontWeight: '600',
    marginTop: 4,
  },
});

export default AtmosphericPressureCard;
