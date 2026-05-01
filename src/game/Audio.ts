export class AudioEngine {
  ctx: AudioContext | null = null;
  masterGain: GainNode | null = null;
  ambienceGain: GainNode | null = null;
  meowBuffer: AudioBuffer | null = null;
  
  // Theme nodes
  currentThemeSource: AudioNode | null = null;
  currentThemeFilter: BiquadFilterNode | null = null;
  currentThemeName: string = 'Underwater';

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.gain.value = 0.5;

    // Load custom meow sound
    fetch('/cat-meow.mp3')
      .then(response => response.arrayBuffer())
      .then(data => this.ctx?.decodeAudioData(data))
      .then(buffer => {
        if (buffer) this.meowBuffer = buffer;
      })
      .catch(console.error);

    // Start background ambience
    this._startAmbience();
  }

  _startAmbience() {
    if (!this.ctx || !this.masterGain) return;
    
    if (this.currentThemeSource) {
        try { (this.currentThemeSource as any).stop(); } catch(e){}
        this.currentThemeSource.disconnect();
    }

    this.ambienceGain = this.ctx.createGain();
    this.ambienceGain.gain.value = 0.05; // default volume very low
    this.ambienceGain.connect(this.masterGain);

    this.currentThemeFilter = this.ctx.createBiquadFilter();
    this.currentThemeFilter.connect(this.ambienceGain);

    if (this.currentThemeName === 'Underwater' || this.currentThemeName === 'Deep Ocean') {
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = this.currentThemeName === 'Deep Ocean' ? 80 : 150;

        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = this.currentThemeName === 'Deep Ocean' ? 0.2 : 0.5;
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 15;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        this.currentThemeFilter.type = 'lowpass';
        this.currentThemeFilter.frequency.value = this.currentThemeName === 'Deep Ocean' ? 200 : 400;

        osc.connect(this.currentThemeFilter);
        lfo.start();
        osc.start();
        this.currentThemeSource = osc;
    } else {
        // Noise-based themes (Rain, Forest, Cafe)
        const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of noise
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        if (this.currentThemeName === 'Rainy Day') {
            this.currentThemeFilter.type = 'lowpass';
            this.currentThemeFilter.frequency.value = 800;
        } else if (this.currentThemeName === 'Forest Stream') {
            this.currentThemeFilter.type = 'bandpass';
            this.currentThemeFilter.frequency.value = 1200;
            this.currentThemeFilter.Q.value = 0.5;
        } else if (this.currentThemeName === 'Lo-fi Cafe') {
            this.currentThemeFilter.type = 'lowpass';
            this.currentThemeFilter.frequency.value = 600;
        }

        noise.connect(this.currentThemeFilter);
        noise.start();
        this.currentThemeSource = noise;
    }
  }

  setTheme(themeName: string) {
      if (this.currentThemeName === themeName) return;
      this.currentThemeName = themeName;
      if (this.ctx) {
          // Fade out
          if (this.ambienceGain) {
              const currentVol = this.ambienceGain.gain.value;
              this.ambienceGain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 1);
              setTimeout(() => {
                  this._startAmbience();
                  // Fade back in
                  if (this.ambienceGain && this.ctx) {
                      this.ambienceGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
                      this.ambienceGain.gain.linearRampToValueAtTime(currentVol, this.ctx.currentTime + 1);
                  }
              }, 1000);
          }
      }
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
    if (!this.ctx || !this.masterGain || !this.meowBuffer) return;
    
    const source = this.ctx.createBufferSource();
    source.buffer = this.meowBuffer;
    
    // Add a little gain so it's clearly heard
    const gain = this.ctx.createGain();
    gain.gain.value = 1.0;
    
    source.connect(gain);
    gain.connect(this.masterGain);
    
    source.start();
  }

  playChime() {
    if (!this.ctx || !this.masterGain) return;
    
    // Play a lovely music-box ding / arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((freq, i) => {
        // Need non-null assertion since we checked above
        const ctx = this.ctx!;
        const master = this.masterGain!;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        const startTime = ctx.currentTime + i * 0.08;
        
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 1.5);
        
        osc.connect(gain);
        gain.connect(master);
        
        osc.start(startTime);
        osc.stop(startTime + 1.6);
    });
  }
}

export const audio = new AudioEngine();
