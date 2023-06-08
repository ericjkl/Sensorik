import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View} from 'react-native';
import React from 'react';
import SensorInfo from "./components/SensorInfo";


export default function App() {
  return (
      <View style={styles.container}>
        <SensorInfo/>
        <StatusBar style="auto"/>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
