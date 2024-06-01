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
        this.alfabeto = [
            ['B#', 'C', 'Dbb'],  // C natural, B# (enharmonicamente igual a C), Dbb (duplo bemol de D)
            ['C#', 'Db', 'Bx'],  // C# e Db são a mesma nota, Bx (B duplo sustenido)
            ['Cx', 'D', 'Ebb'],  // D natural, Cx (C duplo sustenido), Ebb (duplo bemol de E)
            ['D#', 'Eb', 'Fbb'],  // D# e Eb são a mesma nota, Fbb (duplo bemol de F)
            ['Dx', 'E', 'Fb'],  // E natural, Dx (D duplo sustenido), Fb (bemol de F)
            ['E#', 'F', 'Gbb'],  // F natural, E# (enharmonicamente igual a F), Gbb (duplo bemol de G)
            ['F#', 'Gb', 'Ex'],  // F# e Gb são a mesma nota, Ex (E duplo sustenido)
            ['Fx', 'G', 'Abb'],  // G natural, Fx (F duplo sustenido), Abb (duplo bemol de A)
            ['G#', 'Ab'],  // G# e Ab são a mesma nota
            ['Gx', 'A', 'Bbb'],  // A natural, Gx (G duplo sustenido), Bbb (duplo bemol de B)
            ['A#', 'Bb', 'Cbb'],  // A# e Bb são a mesma nota, Cbb (duplo bemol de C)
            ['Ax', 'B', 'Cb']  // B natural, Ax (A duplo sustenido), Cb (bemol de C)
        ];

        this.distancia = {
            "M": [9, 8], // Acorde Maior: Tônica, terça maior, quinta justa. Exemplo: C (C, E, G)
            "m": [8, 9], // Acorde Menor: Tônica, terça menor, quinta justa. Exemplo: Cm (C, Eb, G)
            "sus4": [10, 7], // Acorde sus4: Tônica, quarta justa, quinta justa. Exemplo: Csus4 (C, F, G)
            "7M": [8, 9, 8], // Acorde Maior com Sétima: Tônica, terça maior, quinta justa, sétima menor. Exemplo: C7 (C, E, G, B)
            "7": [9, 8, 9], // Acorde Dominante: Tônica, terça maior, quinta justa, sétima menor. Exemplo: C7 (C, E, G, Bb)
            "9": [8, 9, 9, 8], // Acorde de Nona: Tônica, terça maior, quinta justa, sétima menor, nona maior. Exemplo: C9 (C, E, G, Bb, D)
            "m7": [9, 8, 9], // Acorde Menor com Sétima: Tônica, terça menor, quinta justa, sétima menor. Exemplo: Cm7 (C, Eb, G, Bb)
            "m7(9)": [8, 9, 8, 9], // Acorde Menor com Sétima e Nona: Tônica, terça menor, quinta justa, sétima menor, nona maior. Exemplo: Cm7(9) (C, Eb, G, Bb, D)
            "º": [9, 9, 9], // Acorde Diminuto: Tônica, terça menor, quinta diminuta, sétima bemol. Exemplo: Cº (C, Eb, Gb, A)
            "m7b5": [8, 9, 9], // Acorde Menor com Quinta Diminuta e Sétima: Tônica, terça menor, quinta diminuta, sétima menor. Exemplo: Cm7b5 (C, Eb, Gb, Bb)
            "aug": [8, 8], // Acorde Aumentado: Tônica, terça maior, quinta aumentada. Exemplo: Caug (C, E, Ab)
            "/3": [5, 4], // Acordes com Baixo Alternado (/3): Indicam uma nota de baixo diferente. Exemplo: C/E (E, C, G)
            "/5": [8, 7], // Acordes com Baixo Alternado (/5): Indicam uma nota de baixo diferente. Exemplo: C/G (G, C, E)
            "7alt": [7, 10, 8, 8], // Acorde Alterado: Tônica, terça maior, quinta diminuta, sétima menor e nona aumentada. Exemplo: C7alt (C, E, Ab, Bb, Eb)
            "M6": [10, 9, 8], // Acorde Maior com Sexta: Tônica, terça maior, quinta justa, sexta maior. Exemplo: CM6 (C, E, G, A)
            "m6": [10, 8, 9], // Acorde Menor com Sexta: Tônica, terça menor, quinta justa, sexta maior. Exemplo: Cm6 (C, Eb, G, A)
            "M7#11": [5, 8, 9, 8], // Acorde Maior com Sétima e Dó# Elevado: Tônica, terça maior, quinta justa, sétima menor e Dó# elevado. Exemplo: CM7#11 (C, E, G, B, F#)
            "m7b9": [9, 9, 8, 9], // Acorde Menor com Sétima e Sib Bemol: Tônica, terça menor, quinta justa, sétima menor e Sib bemol. Exemplo: Cm7b9 (C, Eb, G, Bb, Db)
            "m9": [8, 9, 8, 9], // Acorde Menor com Nona: Tônica, terça menor, quinta justa, sétima menor, nona maior. Exemplo: Cm9 (C, Eb, G, Bb, D)
            "dim7": [9, 9, 9], // Acorde Diminuto com Sétima bemol: Tônica, terça menor, quinta diminuta, sétima bemol. Exemplo: Cº7 (C, Eb, Gb, A)
            "madd9": [5, 8, 9], // Acorde Menor com Nonã: Tônica, terça menor, quinta justa e nona maior. Exemplo: Cmadd9 (C, Eb, G, D)
            "add9": [5, 9, 8], // Acorde com Nonã: Tônica, terça maior, quinta justa e nona maior. Exemplo: Cadd9 (C, E, G, D)
            "sus2": [7, 10], // Acorde sus2: Tônica, segunda maior, quinta justa. Exemplo: Csus2 (C, D, G)
            "5": [5], // Acorde Quinta Justa: Tônica, quinta justa. Exemplo: C5 (C, G)
            "13": [2, 8, 9, 8], // Acorde de Décima Terceira: Tônica, terça maior, quinta justa, sétima menor, nona maior, Exemplo: C13 (C, E, G, Bb, D)
            "m13": [1, 9, 8, 9], // Acorde Menor de Décima Terceira: Tônica, terça menor, quinta justa, sétima menor, nona maior, décima maior. Exemplo: Cm13 (C, Eb, G, Bb, D, A)
            "7#9": [7, 9, 9, 8], // Acorde Dominante com Nona Sustenida: Tônica, terça maior, quinta justa, sétima menor, nona sustenida. Exemplo: C7#9 (C, E, G, Bb, D#)
            "7b9": [9, 9, 9, 8], // Acorde Dominante com Nona Bemol: Tônica, terça maior, quinta justa, sétima menor, nona bemol. Exemplo: C7b9 (C, E, G, Bb, Db)
            "9sus4": [8, 9, 10, 7], // Acorde de Nona com Quarta Suspensa: Tônica, terça maior, quinta justa, sétima menor, nona maior, quarta justa. Exemplo: C9sus4 (C, E, G, Bb, F)
            "6/9": [7, 10, 9, 8], // Acorde de Sexta com Nona: Tônica, terça maior, quinta justa, sexta maior, nona maior. Exemplo: C6/9 (C, E, G, A, D)
            "7b5": [8, 10, 8], // Acorde Dominante com Quinta Diminuta: Tônica, terça maior, quinta diminuta, sétima menor. Exemplo: C7b5 (C, E, Gb, Bb)
            "7#5": [10, 8, 8] // Acorde Dominante com Quinta Aumentada: Tônica, terça maior, quinta aumentada, sétima menor. Exemplo: C7#5 (C, E, G#, Bb)
        }
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
        console.log(intervalsResult)
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
