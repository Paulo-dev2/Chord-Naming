import * as FileSystem from 'expo-file-system'; // Importa o módulo FileSystem do Expo para manipulação de arquivos
import { Midi } from '@tonejs/midi'; // Importa a biblioteca Tone.js MIDI para manipulação de arquivos MIDI
import { Buffer } from 'buffer'; // Importa o módulo buffer do Node.js para manipulação de buffers
import { StackAutomatonNominationChord } from '@/lib/automato'; // Importa um módulo personalizado para manipulação de acordes

const BPM = 120; // Define o BPM (batidas por minuto) padrão como 120
let currentTime = 0.5; // Inicializa o tempo atual como 0.5 segundos

// Função para converter um nome de nota para seu número MIDI
function noteToMidi(note) {
  const noteMap = { // Mapeia os nomes das notas para seus números MIDI correspondentes
    "C": 60, "C#": 61, "Db": 61,
    "D": 62, "D#": 63, "Eb": 63,
    "E": 64,
    "F": 65, "F#": 66, "Gb": 66,
    "G": 67, "G#": 68, "Ab": 68,
    "A": 69, "A#": 70, "Bb": 70,
    "B": 71
  };
  return noteMap[note]; // Retorna o número MIDI correspondente ao nome da nota
}

// Função para calcular a duração total de uma sequência de acordes
function calculateTotalDuration(chordType) {
  const durationMap = { // Mapeia os tipos de acordes para suas durações totais correspondentes
    "M": 2, "m": 2, "sus4": 1, "7M": 1.5,
    "7": 1.5, "9": 2, "m7": 1.5, "m7(9)": 2,
    "º": 2, "m7b5": 1.5, "aug": 1, "/3": 0.5,
    "/5": 1, "7alt": 1.5
  };
  let totalDuration = 0; // Inicializa a duração total como 0
  const duration = durationMap[chordType]; // Obtém a duração do tipo de acorde
  if (duration) {
    totalDuration = (BPM / 60) * duration; // Calcula a duração total com base no BPM e na duração do acorde
  }
  return totalDuration; // Retorna a duração total calculada
}

// Função para converter a sequência de acordes em uma sequência de notas MIDI
function sequenceToMidiNotes(tonica, duration, sequence, isFirstChord) {
  const midiNotes = []; // Inicializa um array para armazenar as notas MIDI
  if (!isFirstChord) { // Se não for o primeiro acorde
    // Adiciona uma nota de silêncio entre os acordes
    midiNotes.push({
      midi: 0, // Define o MIDI 0 para representar uma nota de silêncio
      time: currentTime, // Define o tempo da nota
      duration: duration, // Define a duração da nota
      velocity: 0, // Define a velocidade como 0 para uma nota de silêncio
      noteOffVelocity: 0 // Define a velocidade de desligamento da nota como 0
    });
    currentTime += duration; // Aumenta o tempo atual para a duração do silêncio
  }
  sequence.forEach(note => { // Para cada nota na sequência de acordes
    const rootNote = noteToMidi(note); // Converte o nome da nota para o número MIDI correspondente
    // Adiciona a nota MIDI ao array de notas MIDI
    midiNotes.push({
      midi: rootNote, // Define o número MIDI da nota
      time: currentTime, // Define o tempo da nota
      duration: duration, // Define a duração da nota
      velocity: 1, // Define a velocidade da nota como 1
      noteOffVelocity: 0 // Define a velocidade de desligamento da nota como 0
    });
  });
  currentTime += duration; // Aumenta o tempo atual para a duração do acorde
  return midiNotes; // Retorna o array de notas MIDI
}

// Função para criar e salvar o arquivo MIDI
export const createAndSaveMidi = async (sequenceNotes) => {
  const midi = new Midi(); // Cria um novo arquivo MIDI

  // Para cada sequência de acordes na lista de sequências
  sequenceNotes.forEach((sequence, index) => {
    const stackAutomatonNominationChord = new StackAutomatonNominationChord(); // Cria uma instância de StackAutomatonNominationChord
    const [tonica, chord, type_chord] = stackAutomatonNominationChord.nomination(sequence); // Obtém o tom, acorde e tipo de acorde da sequência
    const totalDuration = calculateTotalDuration(type_chord); // Calcula a duração total do acorde
    const track = midi.addTrack(); // Adiciona uma nova faixa MIDI ao arquivo MIDI
    const isFirstChord = 0; // Define se é o primeiro acorde como 0
    const midiNotes = sequenceToMidiNotes(tonica, totalDuration, sequence, isFirstChord); // Converte a sequência de acordes em notas MIDI
    midiNotes.forEach(note => { // Para cada nota MIDI na lista de notas MIDI
      // Adiciona a nota MIDI à faixa MIDI
      track.addNote({
        midi: note.midi, // Número MIDI da nota
        time: note.time, // Tempo da nota
        duration: note.duration // Duração da nota
      });
    });
  });

  const midiArrayBuffer = midi.toArray(); // Converte o arquivo MIDI em um ArrayBuffer
  const midiBase64 = Buffer.from(midiArrayBuffer).toString('base64'); // Converte o ArrayBuffer em uma string base64
  const fileName = `output${Date.now()}.midi`; // Gera um nome de arquivo baseado na data e hora atual

  const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(); // Solicita permissões de acesso ao diretório
  if (permissions.granted) { //
    try {
      const uri = await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        fileName,
        'application/midi'
      ); // Cria um novo arquivo MIDI no diretório especificado
      await FileSystem.writeAsStringAsync(uri, midiBase64, { encoding: FileSystem.EncodingType.Base64 }); // Escreve os dados MIDI no arquivo
      return uri; // Retorna o URI do arquivo MIDI criado e salvo
    } catch (error) { // Em caso de erro durante a criação ou salvamento do arquivo MIDI
      console.error('Error saving MIDI file:', error); // Registra o erro no console
    }
  } else { // Se as permissões não forem concedidas
    console.error('Permission not granted to access storage'); // Registra uma mensagem de erro no console
  }

  return null; // Retorna nulo caso não seja possível criar ou salvar o arquivo MIDI
}
