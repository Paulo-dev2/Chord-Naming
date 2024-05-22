import * as FileSystem from 'expo-file-system';
import { Midi } from '@tonejs/midi';
import { Buffer } from 'buffer';
import { StackAutomatonNominationChord } from '@/lib/automato';
import { Audio } from 'expo-av';

const BPM = 120;
let currentTime = 0.5;

// Função para converter um nome de nota para seu número MIDI
function noteToMidi(note) {
  const noteMap = {
    "C": 60, "C#": 61, "Db": 61,
    "D": 62, "D#": 63, "Eb": 63,
    "E": 64,
    "F": 65, "F#": 66, "Gb": 66,
    "G": 67, "G#": 68, "Ab": 68,
    "A": 69, "A#": 70, "Bb": 70,
    "B": 71
  };
  return noteMap[note];
}

// Função para calcular a duração total de uma sequência de acordes
function calculateTotalDuration(chordType) {
  const durationMap = {
    "M": 2, "m": 2, "sus4": 1, "7M": 1.5,
    "7": 1.5, "9": 2, "m7": 1.5, "m7(9)": 2,
    "º": 2, "m7b5": 1.5, "aug": 1, "/3": 0.5,
    "/5": 1, "7alt": 1.5
  };
  let totalDuration = 0;
  const duration = durationMap[chordType];
  if (duration) {
    totalDuration = (BPM / 60) * duration;
  }
  return totalDuration;
}

// Função para converter a sequência de acordes em uma sequência de notas MIDI
function sequenceToMidiNotes(tonica, duration, sequence) {
  const midiNotes = [];
  sequence.forEach(note => {
    const rootNote = noteToMidi(note);
    midiNotes.push({
      midi: rootNote,
      time: currentTime,
      duration: duration,
      velocity: 1,
      noteOffVelocity: 0
    });
  });
  currentTime += duration;
  return midiNotes;
}

// Função para criar e salvar o arquivo MIDI
export const createAndSaveMidi = async (sequenceNotes) => {
  const midi = new Midi();
  const track = midi.addTrack();

  sequenceNotes.forEach(sequence => {
    console.log(sequence)
    const stackAutomatonNominationChord = new StackAutomatonNominationChord();
    const [tonica, chord, type_chord] = stackAutomatonNominationChord.nomination(sequence);
    const totalDuration = calculateTotalDuration(type_chord);
    const midiNotes = sequenceToMidiNotes(tonica, totalDuration, sequence);
    midiNotes.forEach(note => {
      track.addNote({
        midi: note.midi,
        time: note.time,
        duration: note.duration
      });
    });
  });

  const midiArrayBuffer = midi.toArray();
  const midiBase64 = Buffer.from(midiArrayBuffer).toString('base64');
  const fileName = 'output.midi';

  const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  if (permissions.granted) {
    try {
      const uri = await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        fileName,
        'application/midi'
      );
      await FileSystem.writeAsStringAsync(uri, midiBase64, { encoding: FileSystem.EncodingType.Base64 });
      return uri;
    } catch (error) {
      console.error('Error saving MIDI file:', error);
    }
  } else {
    console.error('Permission not granted to access storage');
  }

  return null;
}

// Função para reproduzir o arquivo MIDI
// export const playMidi = async (uri) => {
//   try {
//     const { sound } = await Audio.Sound.createAsync({ uri });
//     await sound.playAsync();
//   } catch (error) {
//     console.error("Erro ao tentar reproduzir o MIDI:", error);
//   }
// }
