const fs = require('fs');
const { Midi } = require('@tonejs/midi')

const midiFilePath = './teste.mid';


// load a midi file in the browser
const midiData = fs.readFileSync(midiFilePath)
const midi = new Midi(midiData)
midi.tracks.map( track => {
    const notes = track.notes;
    notes.forEach(note => {
      console.log(JSON.stringify(note));
    });
    track.controlChanges[64]
})
