import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export interface ErrorViewProps {
  title?: string;
  message: string;
}

const ErrorView: React.FC<ErrorViewProps> = props => {
  return (
    <View style={styles.container}>
      {props.title ? <Text style={styles.text}>{props.title}</Text> : <></>}
      <Text style={styles.subText}>{props.message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  subText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ErrorView;
