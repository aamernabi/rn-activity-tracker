import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {createStaticNavigation} from '@react-navigation/native';
import ActivityTrackingScreen from './src/screens/ActivityTrackingScreen';
import {DatabaseProvider} from './src/hooks/useDatabase';
import RootScreen from './src/screens/RootScreen';
import NotificationService from './src/utils/NotificationService';
import AddMedicineReminderScreen from './src/screens/AddMedicineReminder';

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Root',
  screens: {
    Root: {
      screen: RootScreen,
      options: {headerShown: false},
    },
    ActivityTracking: {
      screen: ActivityTrackingScreen,
      options: {headerShown: false},
    },
    AddReminder: AddMedicineReminderScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

function App(): React.JSX.Element {
  useEffect(() => {
    NotificationService.configure();
  }, []);

  return (
    <DatabaseProvider>
      <Navigation />
    </DatabaseProvider>
  );
}

export default App;
