import {
  View,
  Text,
  Image,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from '@react-native-vector-icons/ionicons';

const getGreeting = () => {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return 'Good Morning';
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};

interface HomeHeaderProps {
  name: string;
  profileUrl: string;
  onNotificationClick: () => void;
  style?: StyleProp<ViewStyle>;
}

const HomeHeader: React.FC<HomeHeaderProps> = props => {
  const [greeting, setGreeting] = useState<string>();

  useEffect(() => setGreeting(getGreeting()), []);
  return (
    <View style={StyleSheet.flatten([props.style, styles.header])}>
      <Image source={{uri: props.profileUrl}} style={styles.profilePic} />
      <Text style={styles.greeting}>
        {greeting},{'\n'}
        <Text style={styles.userName}>{props.name}!</Text>
      </Text>
      <TouchableOpacity
        onPress={props.onNotificationClick}
        style={styles.notificationContainer}>
        <Icon name="notifications-outline" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profilePic: {width: 50, height: 50, borderRadius: 25},
  notificationContainer: {
    width: 34,
    height: 34,
    borderRadius: 25,
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: '#d3d3d3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  userName: {fontWeight: 'bold', fontSize: 18, color: '#000'},
});

export default HomeHeader;
