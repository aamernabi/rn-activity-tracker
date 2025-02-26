import {View, Text, StyleSheet, FlatList} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {fetchSessions} from '../data/db';
import {useDatabase} from '../hooks/useDatabase';
import Session from '../models/Sessions';
import HomeHeader from '../components/HomeHeader';
import Icon from '@react-native-vector-icons/feather';
import IonIcon from '@react-native-vector-icons/ionicons';
import MaterialIcon from '@react-native-vector-icons/material-design-icons';
import {formatSeconds} from '../utils/datetime';
import {format} from 'date-fns';
import ErrorView from '../components/ErrorView';
import {useFocusEffect} from '@react-navigation/native';

interface SessionItemProps {
  item: Session;
}

const SessionItem: React.FC<SessionItemProps> = ({item}: SessionItemProps) => {
  const statusIcon = item.status === 'completed' ? 'check' : 'x';
  return (
    <View style={styles.sessionItem}>
      <View style={styles.sessionHeader}>
        <Text style={styles.activity}>
          {item.activity || 'Unknown Activity'}
        </Text>
        <Icon
          name={statusIcon}
          size={20}
          color={item.status === 'completed' ? 'green' : 'red'}
        />
      </View>

      <View style={styles.sessionDetails}>
        <Text style={styles.detailText}>
          <MaterialIcon name="clock" size={16} /> Duration:{' '}
          {formatSeconds(item.duration)}
        </Text>
        <Text style={styles.detailText}>
          <IonIcon name="footsteps-outline" size={16} /> Distance:{' '}
          {item.distance.toFixed(2)} m
        </Text>
        <Text style={styles.detailText}>
          <MaterialIcon name="run" size={16} /> Started at:{' '}
          {format(item.startDate, 'EEE, dd MMM yyyy, hh:mm a')}
        </Text>
      </View>
    </View>
  );
};

export default function SessionsScreen() {
  const db = useDatabase();
  const [sessions, setSessions] = useState<Session[]>([]);

  const loadSessions = useCallback(() => {
    if (db) {
      fetchSessions(db, data => setSessions(data));
    }
  }, [db]);

  useFocusEffect(useCallback(() => loadSessions(), [loadSessions]));

  useEffect(() => {}, [db]);

  if (sessions.length === 0) {
    return <ErrorView title="No results" message="No sessions found" />;
  }

  return (
    <View style={styles.container}>
      <HomeHeader
        name="Aamer"
        profileUrl="https://randomuser.me/api/portraits/men/1.jpg"
        style={styles.header}
        onNotificationClick={() => {}}
      />
      <FlatList
        data={sessions}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => <SessionItem item={item} />}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 10},
  sessionItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#d3d3d3',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 16,
  },
  header: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
  },
  activity: {fontSize: 16, fontWeight: 'bold'},
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  sessionDetails: {
    marginVertical: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  detailsButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loading: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 50,
  },
  error: {
    textAlign: 'center',
    color: 'red',
    fontSize: 16,
    marginTop: 50,
  },
  listContainer: {
    gap: 16,
    paddingVertical: 16,
  },
});
