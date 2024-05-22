import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native';

import { createAndSaveMidi } from '@/lib/create-midi';
import { StackAutomatonNominationChord } from '@/lib/automato';

export default function HomeScreen() {
  const [notes, setNotes] = useState<string[][]>([]);
  const [value, setValue] = useState<string>('');
  const [chords, setChords] = useState<string[] | any>([]);

  const handleChangeNote = (note: string) => setValue(note.toUpperCase());

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
    console.log(uri);
    if (uri) {
      //await playMidi(uri);
    }
  };


  console.log(notes);

  return (
    <View style={styles.Container}>
      <View style={styles.Division}>
        <Text style={styles.titleContainer}>Autômato de Nomeação de Acordes</Text>
      </View>
      <View style={styles.Division}>
        <Text>Digite as notas</Text>
        <Text style={styles.exemplo}>Separado por espaços</Text>
        <TextInput
          style={styles.input}
          onChangeText={handleChangeNote}
          value={value}
        />
        <View style={styles.Division}>
          <TouchableOpacity onPress={addNotes} style={styles.button}>
            <Text style={styles.buttonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.Division}>
          <TouchableOpacity onPress={createMidi} style={styles.button}>
            <Text style={styles.buttonText}>Criar MIDI</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scrollContainer}>
          {chords.length > 0 && (
            <View>
              <Text>Resultado:</Text>
              {chords.map((chord, index) => (
                <Text key={index} style={styles.chordText}>{chord}</Text>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  exemplo: {
    fontSize: 10,
  },
  input: {
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  Division: {
    alignItems: 'center',
    marginTop: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  Container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  scrollContainer: {
    marginTop: 20,
    width: '100%',
  },
  chordText: {
    fontSize: 16,
    marginVertical: 5,
  },
});
