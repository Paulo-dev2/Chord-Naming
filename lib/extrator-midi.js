import RNFS from 'react-native-fs';
export const playMidi = async (uri) => {
  console.log(uri)
  const fileExists = await RNFS.exists(uri);
  if (!fileExists) {
    console.log('File does not exist:', uri);
    return;
  }
  try {
    const midiData = await RNFS.readFile(uri, 'base64');
    const midi = new Tone.Midi(midiData);

    const synth = new Tone.PolySynth().toDestination();

    midi.tracks.forEach(track => {
      track.notes.forEach(note => {
        synth.triggerAttackRelease(
          note.name,
          note.duration,
          note.time
        );
      });
    });
  } catch (error) {
    console.error('Error loading MIDI file:', error);
  }
}
