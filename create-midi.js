const fs = require('fs');
const { Midi } = require('@tonejs/midi');
const { StackAutomatonNominationChord } = require('./automato');

const outputMidiFilePath = './teste.mid';

const sequenceNotes =  [
    ["G", "Bb", "Db", "E"],
    ["C", "E", "G"],
    //["C#", "A", "E"],
    ["C", "D#", "G"]
];

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
        "M": 1, "m": 1, "sus4": 1, "7M": 1.5,
        "7": 1.5, "9": 2, "m7": 1.5, "m7(9)": 2,
        "º": 2, "m7b5": 1.5, "aug": 1, "/3": 0.5,
        "/5": 1, "7alt": 1.5
    };
    let totalDuration = 0;
    const duration = durationMap[chordType];
    if (duration) {
        totalDuration += duration;
    }
    
    return totalDuration;
}

// Função para converter a sequência de acordes em uma sequência de notas MIDI
function sequenceToMidiNotes(tonica, duration) {
    const midiNotes = [];
    let currentTime = 0.5;
    const rootNote = noteToMidi(tonica);
    midiNotes.push({
        midi: rootNote,
        time: currentTime,
        duration: duration  // Usa a duração calculada
    });
    return midiNotes;
}

// Criação do arquivo MIDI com base na sequência de acordes
const midi = new Midi();
const track = midi.addTrack();
let sequenceMidiNotes = []
sequenceNotes.forEach(sequence => {
    const stackAutomatonNominationChord = new StackAutomatonNominationChord();
    const [tonica, result, type_chord] = stackAutomatonNominationChord.nomination(sequence);
    const totalDuration = calculateTotalDuration(type_chord); // Calcula a duração total
    const midiNotes = sequenceToMidiNotes(tonica, totalDuration); // Usa a duração total
    midiNotes.forEach(note => {
        track.addNote({
            midi: note.midi,
            time: note.time,
            duration: note.duration
        });
    });
    sequenceMidiNotes.push(midiNotes);
});

// Escreve o arquivo MIDI
//fs.writeFileSync(outputMidiFilePath, Buffer.from(midi.toArray()));
