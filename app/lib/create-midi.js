import * as FileSystem from 'expo-file-system';
import { Midi } from '@tonejs/midi';
import { Buffer } from 'buffer';
import { StackAutomatonNominationChord } from '@/lib/automato';

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
  const fileName = `output${Date.now()}.midi`;

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

export async function convertMidiToMp3(midiFileUri) {
  try {
    const response = await fetch('https://api.convertio.co/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY', // Substitua YOUR_API_KEY pelo seu token de API
      },
      body: JSON.stringify({
        'apikey': 'e85265ea22d207c91cb5ea7d76d4ffa8', // Substitua YOUR_API_KEY pelo seu token de API
        'input': 'upload',
        'file': midiFileUri,
        'outputformat': 'mp3',
      }),
    });

    const data = await response.json();
    if (!data.data || !data.data.id) {
      throw new Error('Failed to convert MIDI to MP3. Response: ' + JSON.stringify(data));
    }

    const mp3Id = data.data.id;
    const mp3Response = await fetch(`https://api.convertio.co/convert/${mp3Id}/download`);
    const mp3Data = await mp3Response.json();
    if (!mp3Data.url) {
      throw new Error('Failed to get MP3 download URL. Response: ' + JSON.stringify(mp3Data));
    }

    const mp3Url = mp3Data.url;
    return mp3Url;
  } catch (error) {
    console.error('Error converting MIDI to MP3:', error);
    throw new Error('Error converting MIDI to MP3: ' + error.message);
  }
}

