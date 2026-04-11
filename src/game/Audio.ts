export class AudioEngine {
  ctx: AudioContext | null = null;
  masterGain: GainNode | null = null;
  ambienceGain: GainNode | null = null;

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.gain.value = 0.5;

    // Start background ambience
    this._startAmbience();
  }

  _startAmbience() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 60; // low rumble hum

    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.2; // very slow wave
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 15;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    this.ambienceGain = this.ctx.createGain();
    this.ambienceGain.gain.value = 0.5; // default volume
    
    osc.connect(this.ambienceGain);
    this.ambienceGain.connect(this.masterGain);
    
    lfo.start();
    osc.start();
  }

  setAmbienceVolume(val: number) {
    if (this.ambienceGain) {
        // Map 0-100 to 0-1
        this.ambienceGain.gain.value = val / 100;
    }
  }

  playBubble() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    const startFreq = 400 + Math.random() * 200;
    osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(startFreq + 200, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playSplash() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 0.5; // 0.5 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.5);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    noise.start();
  }

  playPurr() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(50, this.ctx.currentTime);
    
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 25; // 25hz modulation for rumble
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 20;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + 0.5);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 2.0);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    lfo.start();
    osc.start();
    lfo.stop(this.ctx.currentTime + 2.0);
    osc.stop(this.ctx.currentTime + 2.0);
  }

  playMeow() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Sweeping frequency that sounds like "meoooow"
    const now = this.ctx.currentTime;
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.6);

    // Filter to make it sound nasal/animalistic
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.frequency.linearRampToValueAtTime(500, now + 0.6);
    filter.Q.value = 5;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    // Envelope for the "mew" shape (attack-decay)
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.1); // Attack
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6); // Fade out

    osc.start(now);
    osc.stop(now + 0.6);
  }
}

export const audio = new AudioEngine();
