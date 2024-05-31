import React, { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import {styles} from "@/styles/Main";

import { useRouter } from 'expo-router';

import { createAndSaveMidi } from '@/lib/create-midi';
import { StackAutomatonNominationChord } from '@/lib/automato';

export default function HomeScreen() {
  const [notes, setNotes] = useState<string[][]>([]);
  const [value, setValue] = useState<string>('');
  const [chords, setChords] = useState<string[] | any>([]);

  const router = useRouter();

  const handleChangeNote = (note: string) => setValue(note);

  const addNotes = () => {
    if (value.trim() === '') return;
    const chordArray = value.split(' ').filter(note => note.trim() !== '');
    
    const stackAutomatonNominationChord = new StackAutomatonNominationChord();
    const [result, acorde, tipo] = stackAutomatonNominationChord.nomination(chordArray);

    if (result === "Acorde Desconhecido") {
      console.log("Acorde Desconhecido");
    } else {
      setNotes([...notes, chordArray]);
      setChords([...chords, acorde]);
      setValue('');
    }
  };

  const createMidi = async () => {
    const uri = await createAndSaveMidi(notes);
    if (uri && notes.length != 0) {
      router.push({ pathname: 'play', params: { uri } });
    }
  };


  return (
    <View style={styles.Container}>
      <View>
        <Image 
          source={require('../assets/images/claveG.png')} 
          style={styles.image} 
        />
      </View>
      <View style={styles.Division}>
        <Text style={styles.titleContainer}>Autômato de Nomeação de Acordes</Text>
      </View>
      <View style={styles.Division}>
        <Text>Digite as notas</Text>
        <Text style={styles.exemplo}>Separado por espaços</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={handleChangeNote}
            value={value}
          />
          <TouchableOpacity onPress={addNotes} style={styles.addButton}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.Division}>
        <TouchableOpacity onPress={createMidi} style={styles.button}>
          <Text style={styles.buttonText}>Criar MIDI</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollContainer}>
        {chords.length > 0 && (
          <View>
            <Text>Acordes:</Text>
            {chords.map((chord: string, index: number) => (
              <Text key={index} style={styles.chordText}>{chord}</Text>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}