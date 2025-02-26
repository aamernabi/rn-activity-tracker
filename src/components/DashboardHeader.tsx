import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import Icon from '@react-native-vector-icons/ionicons';

export default function DashboardHeader() {
  return (
    <View style={styles.header}>
      <Image
        source={{uri: 'https://randomuser.me/api/portraits/men/1.jpg'}}
        style={styles.profilePic}
      />
      <Text style={styles.greeting}>
        Good morning,{'\n'}
        <Text style={styles.userName}>Aamer!</Text>
      </Text>
      <Icon name="notifications-outline" size={24} color="#333" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8F9FA', paddingHorizontal: 16},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  profilePic: {width: 50, height: 50, borderRadius: 25},
  greeting: {fontSize: 16, color: '#555'},
  userName: {fontWeight: 'bold', fontSize: 18, color: '#000'},
});
