class Node {
    constructor(data = null, previousNode = null) {
        this.data = data;
        this.previousNode = previousNode;
    }
}

class Stack {
    // Classe que representa um nó da pilha.

    constructor() {
        this.top = null;
    }

    push(data) {
        const newNode = new Node(data, this.top);
        this.top = newNode;
    }

    pop() {
        if (this.top !== null) {
            const data = this.top.data;
            this.top = this.top.previousNode;
            return data;
        } else {
            return null;
        }
    }
}

class StackAutomatonNominationChord {
    constructor() {
        this.stack = new Stack();

        this.alfabeto = ['C', ['C#', 'Db'], 'D', ['D#', 'Eb'], 'E', 'F', ['F#', 'Gb'], 'G', ['G#', 'Ab'], 'A', ['A#', 'Bb'], 'B'];
        this.distancia = {
            "M": [9, 8],
            "m": [8, 9],
            "sus4": [10, 7],
            "7M": [8, 9, 8],
            "7": [9, 8, 9],
            "9": [8, 9, 9, 8],
            "m7": [9, 8, 9],
            "m7(9)": [8, 9, 8, 9],
            "º": [9, 9, 9],
            "m7b5": [8, 9, 9],
            "aug": [8, 8],
            "/3": [5, 4],
            "/5": [8, 7],
            "7alt": [8, 9, 8, 8]
        };
    }

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
        return -1;
    }

    identifyChord(intervals, input) {
        for (const [chord, pattern] of Object.entries(this.distancia)) {
            if (JSON.stringify(intervals) === JSON.stringify(pattern)) {
                return chord;
            }
        }
        return false;
    }

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
        return [intervals, tonica];
    }

    nomination(inputSequence) {
        for (const note of inputSequence) {
            this.stack.push(note);
        }
        const [intervalsResult, tonica] = this.getIntervals();
        const chord = this.identifyChord(intervalsResult, inputSequence);
        if (!chord) {
            return ["Acorde Desconhecido","",""];
        } else {
            let chord_full = tonica + chord
            return [tonica, chord_full, chord];
        }
    }
}

module.exports = { StackAutomatonNominationChord };

