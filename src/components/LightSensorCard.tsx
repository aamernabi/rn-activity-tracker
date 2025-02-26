import React, {useEffect, useState} from 'react';
import {
  hasLightSensor,
  startLightSensor,
  stopLightSensor,
} from 'react-native-ambient-light-sensor';
import {
  View,
  Text,
  DeviceEventEmitter,
  StyleSheet,
  ViewProps,
} from 'react-native';
import {Card} from 'react-native-paper';
import Icon from '@react-native-vector-icons/material-design-icons';

const LightSensorCard: React.FC<ViewProps> = props => {
  const [lightValue, setLightValue] = useState<number | undefined>();
  const [hasSensor, setHasSensor] = useState<boolean | undefined>();

  useEffect(() => {
    hasLightSensor().then(setHasSensor);
    startLightSensor();

    const subscription = DeviceEventEmitter.addListener(
      'LightSensor',
      (data: {lightValue: number}) => {
        setLightValue(data.lightValue);
      },
    );

    return () => {
      stopLightSensor();
      subscription?.remove();
    };
  }, []);

  return (
    <Card style={[props.style, styles.card]} elevation={4}>
      <View style={styles.content}>
        <Icon name="weather-sunny" size={40} color="#33" />
        <View style={styles.textContainer}>
          <Text style={styles.label} numberOfLines={2} ellipsizeMode="tail">
            Ambient Light Level
          </Text>
          <Text style={styles.value}>
            {hasSensor ? `${lightValue?.toFixed(2)} lx` : 'N/A'}
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

export default LightSensorCard;
