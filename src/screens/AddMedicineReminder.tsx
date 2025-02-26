import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
//import DateTimePicker from '@react-native-community/datetimepicker';
import NotificationService from '../utils/NotificationService';
import {TimePickerModal} from 'react-native-paper-dates';
import Spacer from '../components/Spacer';
import {format} from 'date-fns';
import Icon from '@react-native-vector-icons/material-design-icons';
import {useNavigation} from '@react-navigation/native';
import {useDatabase} from '../hooks/useDatabase';
import {addReminder} from '../data/db';

export default function AddReminderScreen() {
  const navigation = useNavigation();
  const db = useDatabase();
  const [medicineName, setMedicineName] = useState('');
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const scheduleReminder = useCallback(() => {
    if (!medicineName) {
      Alert.alert('Error', 'Please enter medicine name');
      return;
    }

    if (db) {
      addReminder(db, medicineName, reminderTime, id => {
        NotificationService.scheduleNotification(
          id.toString(),
          medicineName,
          `Reminder for ${medicineName}`,
          reminderTime.getHours(),
          reminderTime.getMinutes(),
        );
        Alert.alert('Reminder Set', `Reminder for ${medicineName} added.`, [
          {
            text: 'Okay',
            onPress: () => navigation.goBack(),
          },
        ]);
      });
    }
  }, [medicineName, reminderTime, db, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Medicine Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter medicine name"
        value={medicineName}
        onChangeText={setMedicineName}
      />

      <Text style={styles.label}>Reminder Time</Text>
      <View style={styles.timecontainer}>
        <Text style={styles.time}>{format(reminderTime, 'HH:mm')}</Text>
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <Icon name="clock" size={24} color="#4e4e4e" />
        </TouchableOpacity>
      </View>

      <TimePickerModal
        visible={showPicker}
        onDismiss={() => setShowPicker(false)}
        onConfirm={result => {
          const newDate = new Date();
          newDate.setHours(result.hours);
          newDate.setMinutes(result.minutes);
          setReminderTime(newDate);
          setShowPicker(false);
        }}
        hours={reminderTime.getHours()}
        minutes={reminderTime.getMinutes()}
      />

      <Spacer height={24} />

      <Button title="Add Reminder" onPress={scheduleReminder} color="#333" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, justifyContent: 'center'},
  label: {fontSize: 16, marginBottom: 8},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
  timecontainer: {
    flexDirection: 'row',
  },
  time: {
    flexGrow: 1,
    fontSize: 18,
    color: '#4e4e4e',
    fontWeight: 'bold',
  },
});
