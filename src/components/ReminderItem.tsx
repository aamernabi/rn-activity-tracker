import Icon from '@react-native-vector-icons/material-design-icons';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Reminder from '../models/Reminder';

interface ReminderItemProps {
  reminder: Reminder;
  onDelete: (id: number) => void;
  style?: StyleProp<ViewStyle>;
}

const ReminderItem: React.FC<ReminderItemProps> = ({
  reminder,
  onDelete,
  style,
}) => {
  return (
    <View style={[style, styles.card]}>
      <Icon
        name="medication-outline"
        size={24}
        color="#444"
        style={styles.prefixIcon}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.medicineName}>{reminder.name}</Text>
        <Text style={styles.time}>{reminder.time}</Text>
      </View>

      <TouchableOpacity
        onPress={() => onDelete(reminder.id)}
        style={styles.deleteButton}>
        <Icon name="trash-can" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#d3d3d3',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  infoContainer: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  time: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8d7da',
  },
  prefixIcon: {
    marginEnd: 8,
  },
});

export default ReminderItem;
