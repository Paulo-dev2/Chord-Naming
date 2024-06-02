import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

import { extractorMidi } from "@/lib/extrator-midi";

export default function PlayScreen() {
  const route = useRoute();
  const { uri, chords } : any = route.params;
  const chordsMap: Array<string> = chords.split(",")
  const [notes, setNotes] = useState();

  useEffect(() => {
    // Carrega as notas quando o componente for montado
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const loadedNotes: any = await extractorMidi(uri);
      const notesArray: any = Object.values(loadedNotes);
      console.log(notesArray)
      setNotes(notesArray);
    } catch (error) {
      console.error('Error loading MIDI file:', error);
    }
  };

  const renderNoteItem = ({ item }: any) => (
    <View style={styles.noteItem}>
      <Text>{item.name}</Text>
      <Text>{item.time}</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.headerText}>Acordes</Text>
        <Text style={styles.headerText}>Notas</Text>
      </View>
      <FlatList
        data={chordsMap}
        renderItem={({ item, index }) => (
          <View style={styles.chordItem}>
            <Text>{item}</Text>
            <FlatList
              data={notes}
              renderItem={renderNoteItem}
              keyExtractor={(item, index) => index.toString()}
              horizontal
            />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  chordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  noteItem: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
