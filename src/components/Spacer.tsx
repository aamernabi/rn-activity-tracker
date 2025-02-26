import React from 'react';
import {View, StyleSheet} from 'react-native';

const Spacer = ({height = 0, width = 0, flex = 0}) => {
  return <View style={[styles.spacer, {height, width, flex}]} />;
};

const styles = StyleSheet.create({
  spacer: {},
});

export default Spacer;
