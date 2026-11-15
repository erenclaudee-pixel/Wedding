const fs = require('fs');

const sampleRate = 44100;
const duration = 12; // 12 seconds loop
const numSamples = sampleRate * duration;
const buffer = Buffer.alloc(44 + numSamples * 2);

// WAV Header
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + numSamples * 2, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16); // PCM chunk size
buffer.writeUInt16LE(1, 20);  // Format: PCM
buffer.writeUInt16LE(1, 22);  // Channels: 1
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * 2, 28); // Byte rate
buffer.writeUInt16LE(2, 32);  // Block align
buffer.writeUInt16LE(16, 34); // Bits per sample
buffer.write('data', 36);
buffer.writeUInt32LE(numSamples * 2, 40);

// Pachelbel Canon Chord progression (D, A, Bm, F#m, G, D, G, A)
const chords = [
  [293.66, 369.99, 440.0, 587.33], // D, F#, A, D
  [220.0, 277.18, 329.63, 440.0],  // A, C#, E, A
  [246.94, 293.66, 369.99, 493.88],// B, D, F#, B
  [185.0, 220.0, 277.18, 369.99],  // F#, A, C#, F#
  [196.0, 246.94, 293.66, 392.0],  // G, B, D, G
  [146.83, 220.0, 293.66, 369.99], // D, A, D, F#
  [196.0, 246.94, 293.66, 392.0],  // G, B, D, G
  [220.0, 277.18, 329.63, 440.0]   // A, C#, E, A
];

const chordDuration = duration / chords.length;

let offset = 44;
for (let i = 0; i < numSamples; i++) {
  const t = i / sampleRate;
  const chordIdx = Math.min(chords.length - 1, Math.floor(t / chordDuration));
  const chord = chords[chordIdx];
  const localT = t - chordIdx * chordDuration;
  
  // Arpeggiate through 4 notes in the chord
  const noteIdx = Math.min(3, Math.floor((localT / chordDuration) * 4));
  const freq = chord[noteIdx];
  const noteT = localT % (chordDuration / 4);

  // Soft piano decay envelope
  const envelope = Math.exp(-3.2 * noteT);
  
  // Pure sine wave fundamental + soft 2nd harmonic
  let sample = (0.75 * Math.sin(2 * Math.PI * freq * t) + 0.25 * Math.sin(4 * Math.PI * freq * t)) * envelope;
  
  // Master gain
  sample = sample * 0.25;

  let val = Math.floor(sample * 32767);
  val = Math.max(-32768, Math.min(32767, val));
  
  buffer.writeInt16LE(val, offset);
  offset += 2;
}

fs.writeFileSync('assets/music/wedding-melody.mp3', buffer);
console.log('Audio file generated successfully! Size:', buffer.length);

