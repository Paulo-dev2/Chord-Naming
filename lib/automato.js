// Definição da classe Node, que representa um nó da pilha.
class Node {
    constructor(data = null, previousNode = null) {
        this.data = data; // O dado armazenado no nó
        this.previousNode = previousNode; // Referência para o nó anterior na pilha
    }
}

// Definição da classe Stack, que implementa uma pilha.
class Stack {
    constructor() {
        this.top = null; // Inicializa o topo da pilha como nulo
    }

    // Método para adicionar um novo elemento à pilha
    push(data) {
        const newNode = new Node(data, this.top); // Cria um novo nó com o dado fornecido e o topo atual como nó anterior
        this.top = newNode; // Atualiza o topo da pilha para o novo nó
    }

    // Método para remover o elemento do topo da pilha
    pop() {
        if (this.top !== null) { // Verifica se a pilha não está vazia
            const data = this.top.data; // Armazena o dado do topo da pilha
            this.top = this.top.previousNode; // Atualiza o topo da pilha para o nó anterior
            return data; // Retorna o dado removido
        } else {
            return null; // Retorna nulo se a pilha estiver vazia
        }
    }
}

// Definição da classe StackAutomatonNominationChord, que implementa a lógica de identificação de acordes.
class StackAutomatonNominationChord {
    constructor() {
        this.stack = new Stack(); // Inicializa uma nova pilha para armazenar as notas

        // Definição do alfabeto de notas e suas distâncias em relação à tônica para identificar os acordes
        this.alfabeto = ['C', ['C#', 'Db'], 'D', ['D#', 'Eb'], 'E', 'F', ['F#', 'Gb'], 'G', ['G#', 'Ab'], 'A', ['A#', 'Bb'], 'B'];
        this.distancia = {
            "M": [9, 8], // C - E  - G
            "m": [8, 9], // C - Eb - G
            "sus4": [10, 7], // C - F - G
            "7M": [8, 9, 8], // C - E - G - B
            "7": [9, 8, 9], // C - E - G - Bb
            "9": [8, 9, 9, 8], // C - E - G - Bb - D
            "m7": [9, 8, 9], // C - Eb - G - Bb
            "m7(9)": [8, 9, 8, 9], // C - Eb - G - Bb - D
            "º": [9, 9, 9], // C - Eb - Gb - A
            "m7b5": [8, 9, 9], // C - Eb - Gb - Bb
            "aug": [8, 8], // C - E - Ab
            "/3": [5, 4], // E - C - G
            "/5": [8, 7], // G - C - E
            "7alt": [8, 9, 8, 8] // C - E - Ab - Bb - Eb
        };
    }

    // Método para encontrar o índice de uma nota no alfabeto de notas
    findNoteIndex(note) {
        for (let i = 0; i < this.alfabeto.length; i++) {
            const item = this.alfabeto[i];
            if (Array.isArray(item)) {
                if (item.includes(note)) {
                    return i;
                }
            } else if (note === item) {
                return i;
            }
        }
        return -1; // Retorna -1 se a nota não for encontrada
    }

    // Método para identificar o acorde com base nos intervalos entre as notas
    identifyChord(intervals, input) {
        for (const [chord, pattern] of Object.entries(this.distancia)) {
            if (JSON.stringify(intervals) === JSON.stringify(pattern)) {
                return chord;
            }
        }
        return false; // Retorna falso se o acorde não for identificado
    }

    // Método para calcular os intervalos entre as notas na pilha e a nota tônica
    getIntervals() {
        const intervals = [];
        let tonica = "";
        while (this.stack.top !== null && this.stack.top.previousNode !== null) {
            const note1 = this.stack.pop();
            tonica = this.stack.top.data;
            const startIndex = this.findNoteIndex(note1);
            const endIndex = this.findNoteIndex(tonica);
            const interval = (endIndex - startIndex + this.alfabeto.length) % this.alfabeto.length;
            intervals.push(interval);
        }
        return [intervals, tonica]; // Retorna os intervalos calculados e a nota tônica
    }

    // Método principal para identificar o acorde a partir da sequência de notas de entrada
    nomination(inputSequence) {
        for (const note of inputSequence) {
            this.stack.push(note); // Empilha cada nota da sequência de entrada
        }
        const [intervalsResult, tonica] = this.getIntervals(); // Calcula os intervalos entre as notas e a nota tônica
        const chord = this.identifyChord(intervalsResult, inputSequence); // Identifica o acorde com base nos intervalos
        if (!chord) {
            return ["Acorde Desconhecido", "", ""]; // Retorna uma mensagem de acorde desconhecido se o acorde não for identificado
        } else {
            let chord_full = tonica + chord; // Constrói o nome completo do acorde
            return [tonica, chord_full, chord]; // Retorna a tônica, o nome completo do acorde e o tipo de acorde
        }
    }
}

module.exports = { StackAutomatonNominationChord }; // Exporta a classe StackAutomatonNominationChord para uso externo
