import * as FileSystem from 'expo-file-system';
import { Midi } from '@tonejs/midi';
import { Buffer } from 'buffer';

// Função para tocar o arquivo MIDI
export const playMidi = async (uri) => {
  try {
    // Leia o conteúdo do arquivo MIDI como base64
    const midiBase64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    }); // Lê o conteúdo do arquivo MIDI como base64

    // Verifica se o conteúdo foi lido corretamente
    if (!midiBase64) {
      throw new Error('Failed to read the MIDI file content.'); // Lança um erro se o conteúdo não for lido corretamente
    }

    // Converte base64 para Uint8Array
    const midiUint8Array = Buffer.from(midiBase64, 'base64'); // Converte o conteúdo base64 em um Uint8Array
    
    // Cria um ArrayBuffer a partir do Uint8Array
    const midiArrayBuffer = midiUint8Array.buffer; // Cria um ArrayBuffer a partir do Uint8Array
    
    // Verifica se o ArrayBuffer foi criado corretamente
    if (!midiArrayBuffer) {
      throw new Error('Failed to convert base64 to ArrayBuffer.'); // Lança um erro se o ArrayBuffer não for criado corretamente
    }

    // Cria um objeto MIDI a partir do ArrayBuffer
    const midi = new Midi(midiArrayBuffer); // Cria um objeto MIDI a partir do ArrayBuffer

    // Inicializa uma lista vazia para armazenar as notas MIDI
    const notes = [];

    // Itera sobre todas as faixas do arquivo MIDI
    midi.tracks.forEach(track => {
      // Itera sobre todas as notas de cada faixa
      track.notes.forEach(note => {
        // Adiciona a nota à lista de notas
        notes.push(note);
      });
    });

    return notes; // Retorna a lista de notas MIDI extraída do arquivo MIDI

  } catch (error) { // Se ocorrer algum erro durante o processo
    console.error('Error loading MIDI file:', error); // Registra o erro no console
  }
};
