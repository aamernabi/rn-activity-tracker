import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useDatabase} from '../hooks/useDatabase';
import Reminder from '../models/Reminder';
import {getReminders, deleteReminder} from '../data/db';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ActionView from '../components/ActionView';
import ReminderItem from '../components/ReminderItem';
import NotificationService from '../utils/NotificationService';
import notifee from '@notifee/react-native';
import Icon from '@react-native-vector-icons/material-design-icons';

const checkBatteryOptimzations = async () => {
  const batteryOptimizationEnabled =
    await notifee.isBatteryOptimizationEnabled();
  if (batteryOptimizationEnabled) {
    Alert.alert(
      'Restrictions Detected',
      'To ensure notifications are delivered, please disable battery optimization for the app.',
      [
        {
          text: 'OK, open settings',
          onPress: async () => await notifee.openBatteryOptimizationSettings(),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  }
};

const checkPowerManager = async () => {
  const powerManagerInfo = await notifee.getPowerManagerInfo();
  console.log(powerManagerInfo);

  if (powerManagerInfo.activity) {
    // 2. ask your users to adjust their settings
    Alert.alert(
      'Restrictions Detected',
      'To ensure notifications are delivered, please adjust your settings to prevent the app from being killed',
      [
        // 3. launch intent to navigate the user to the appropriate screen
        {
          text: 'OK, open settings',
          onPress: async () => await notifee.openPowerManagerSettings(),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  }
};

interface DisableOptimizationsViewProps {
  message: string;
  onClick: () => void;
}

const DisableOptimizationsView: React.FC<
  DisableOptimizationsViewProps
> = props => {
  return (
    <View style={styles.optimizationContainer}>
      <Text style={styles.optimizationText}>{props.message}</Text>
      <TouchableOpacity onPress={props.onClick}>
        <Icon name="arrow-right" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

export default function MedicineRemindersList() {
  const db = useDatabase();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [reminderToDelete, setReminderToDelete] = useState<Reminder | null>(
    null,
  );
  const loadReminders = useCallback(() => {
    if (db) {
      getReminders(db, list => setReminders(list));
    }
  }, [db]);

  useFocusEffect(useCallback(() => loadReminders(), [loadReminders]));

  //useEffect(() => {
  //  if (db) {
  //    getReminders(db, result => setReminders(result));
  //  }
  //}, [db]);

  const cancelReminder = (id: number) => {
    if (db) {
      deleteReminder(db, id);
      NotificationService.cancelNotification(id.toString());
      getReminders(db, result => setReminders(result));
    }
  };

  if (reminderToDelete) {
    Alert.alert(
      'Confirmation!',
      `Are you sure you want to delete ${reminderToDelete.name}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'YES',
          onPress: () => {
            cancelReminder(reminderToDelete.id);
            setReminderToDelete(null);
          },
        },
      ],
    );
  }

  if (reminders.length === 0) {
    return (
      <ActionView
        title="No results"
        message="No reminders found"
        btnText="Add Medicine"
        onPress={() => navigation.navigate('AddReminder')}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medicine Reminder List</Text>
      <DisableOptimizationsView
        message="To ensure notifications are delivered, please disable battery optimization for the app."
        onClick={async () => await notifee.openBatteryOptimizationSettings()}
      />
      <DisableOptimizationsView
        message="To ensure notifications are delivered, please turn on auto startup"
        onClick={async () => await notifee.openPowerManagerSettings()}
      />

      <FlatList
        data={reminders}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <ReminderItem
            reminder={item}
            onDelete={() => setReminderToDelete(item)}
          />
        )}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddReminder')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  reminderCard: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#333',
    borderRadius: 16,
  },
  title: {fontSize: 16, fontWeight: 'bold', marginBottom: 24},
  time: {fontSize: 14, color: 'gray'},
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 50,
    alignItems: 'center',
  },
  fabText: {color: '#fff', fontSize: 24, fontWeight: 'bold'},
  optimizationContainer: {
    flexDirection: 'row',
    marginRight: 24,
    gap: 8,
    marginBottom: 8,
  },
  optimizationText: {
    flexGrow: 1,
    fontSize: 12,
    fontWeight: '400',
    color: 'gray',
  },
});
