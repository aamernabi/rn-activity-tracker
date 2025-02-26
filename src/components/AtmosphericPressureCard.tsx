import Icon from '@react-native-vector-icons/material-design-icons';
import {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ViewProps} from 'react-native';
import {Card} from 'react-native-paper';
import {
  SensorTypes,
  setUpdateIntervalForType,
  barometer,
} from 'react-native-sensors';

const AtmosphericPressureCard: React.FC<ViewProps> = props => {
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
    <Card style={[props.style, styles.card]} elevation={4}>
      <View style={styles.content}>
        <Icon name="gauge" size={40} color="#333" />
        <View style={styles.textContainer}>
          <Text style={styles.label} numberOfLines={2} ellipsizeMode="tail">
            Atmospheric Pressure
          </Text>
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
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#d3d3d3',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
    flexShrink: 1,
  },
  label: {
    fontSize: 12,
    color: 'gray',
    fontWeight: '400',
    flexShrink: 1,
  },
  value: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    marginTop: 4,
  },
});

export default AtmosphericPressureCard;
