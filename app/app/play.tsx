import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { styles } from "@/styles/Main";

import {convertMidiToMp3} from "@/lib/create-midi";

export default function PlayScreen() {
  const route = useRoute();
  const { uri } = route.params;
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const url = convertMidiToMp3(uri);
  console.log(url)

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
       { uri: url }
    );
    setSound(sound);

    console.log('Playing sound');
    await sound.playAsync(); 
  }

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
  }

  return (
    <View style={styles.Container}>
      <Text>URI Recebida: {uri}</Text>
      <Button title="Parar" onPress={stopSound} />
      <Button title="Play" onPress={playSound} />
    </View>
  );
}
