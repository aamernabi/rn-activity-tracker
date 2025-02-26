import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SessionsScreen from '../screens/SessionsScreen';
import Icon from '@react-native-vector-icons/feather';
import MaterialIcon from '@react-native-vector-icons/material-design-icons';
import MedicineRemindersList from './MedicineRemindersList';

const Tab = createBottomTabNavigator();

const getTabBarIcon = (route: string, color: string, size: number) => {
  if (route === 'Reminders') {
    return <MaterialIcon name="medication" size={size} color={color} />;
  }
  const iconName = route === 'Sessions' ? 'list' : 'home';
  return <Icon name={iconName} size={size} color={color} />;
};

const RootScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({color, size}) => getTabBarIcon(route.name, color, size),
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Sessions" component={SessionsScreen} />
      <Tab.Screen name="Reminders" component={MedicineRemindersList} />
    </Tab.Navigator>
  );
};

export default RootScreen;
