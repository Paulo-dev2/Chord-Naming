import React, { useEffect, useState } from 'react';
import { View, Text, Button, PermissionsAndroid, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { styles } from "@/styles/Main";

//import {playMidi} from "@/lib/extrator-midi";

export default function PlayScreen() {
  const route = useRoute();
  const { uri } = route.params;

  useEffect(() => {
    const requestPermission = async () => {
      const granted = await requestStoragePermission();
      if (!granted) {
        console.log('Storage permission denied.');
        // Aqui você pode adicionar tratamento para quando a permissão é negada
      }
    };

    requestPermission();
  }, []);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your storage to read MIDI files',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };
  
  const Play = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) return;
    if (!uri) return;
    console.log(uri)
  }

  return (
    <View style={styles.Container}>
      <Text>URI Recebida: {uri}</Text>
      {/* <Button title="Parar" onPress={stopSound} /> */}
      <Button title="Play" onPress={Play} />
    </View>
  );
}
