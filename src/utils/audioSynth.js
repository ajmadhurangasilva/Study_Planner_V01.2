// Offline Web Audio API Synthesizer for Ambient Study Sounds & Alarms

class AudioSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.activeSource = null;
    this.gainNode = null;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  stopSound() {
    if (this.activeSource) {
      try {
        this.activeSource.stop();
        this.activeSource.disconnect();
      } catch (e) {
        // ignore
      }
      this.activeSource = null;
    }
  }

  playRain(volume = 0.3) {
    this.initContext();
    this.stopSound();

    const bufferSize = 2 * this.audioCtx.sampleRate;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11; // Pink noise formula for rain sound
      b6 = white * 0.115926;
    }

    const whiteNoiseSource = this.audioCtx.createBufferSource();
    whiteNoiseSource.buffer = noiseBuffer;
    whiteNoiseSource.loop = true;

    // Filter for soft rain sound
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.audioCtx.currentTime);

    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.setValueAtTime(volume, this.audioCtx.currentTime);

    whiteNoiseSource.connect(filter);
    filter.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);

    whiteNoiseSource.start();
    this.activeSource = whiteNoiseSource;
  }

  playOcean(volume = 0.3) {
    this.initContext();
    this.stopSound();

    const bufferSize = 2 * this.audioCtx.sampleRate;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoiseSource = this.audioCtx.createBufferSource();
    whiteNoiseSource.buffer = noiseBuffer;
    whiteNoiseSource.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, this.audioCtx.currentTime);

    // Modulation LFO for wave surges
    const lfo = this.audioCtx.createOscillator();
    lfo.frequency.setValueAtTime(0.1, this.audioCtx.currentTime); // 10s wave period

    const lfoGain = this.audioCtx.createGain();
    lfoGain.gain.setValueAtTime(250, this.audioCtx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.setValueAtTime(volume, this.audioCtx.currentTime);

    whiteNoiseSource.connect(filter);
    filter.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);

    lfo.start();
    whiteNoiseSource.start();
    this.activeSource = whiteNoiseSource;
  }

  playChime() {
    this.initContext();
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, this.audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.1); // A5

    gain.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 1.5);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 1.5);
  }
}

export const soundSynth = new AudioSynthesizer();
