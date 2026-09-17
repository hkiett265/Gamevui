// nitroAudio.ts - Web Audio API Synthesis for Nitro Velocity
class NitroAudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  
  // Engine
  private engineOsc1: OscillatorNode | null = null;
  private engineOsc2: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  
  // Nitro
  private nitroNoise: AudioBufferSourceNode | null = null;
  private nitroGain: GainNode | null = null;
  
  // Tire Screech
  private screechNoise: AudioBufferSourceNode | null = null;
  private screechGain: GainNode | null = null;
  
  private isInitialized = false;
  private enabled = true;

  init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Master Chain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.5;
      
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -12;
      this.compressor.knee.value = 30;
      this.compressor.ratio.value = 12;
      this.compressor.attack.value = 0.003;
      this.compressor.release.value = 0.25;
      
      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);
      
      this.isInitialized = true;
      this.setupEngine();
      this.setupNitro();
      this.setupScreech();
    } catch (e) {
      console.error('Failed to init Web Audio API', e);
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(enabled ? 0.5 : 0, this.ctx?.currentTime || 0, 0.1);
    }
  }

  private createNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  private setupEngine() {
    if (!this.ctx || !this.masterGain) return;
    
    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.value = 0;
    
    // Low rumble
    this.engineOsc1 = this.ctx.createOscillator();
    this.engineOsc1.type = 'sawtooth';
    this.engineOsc1.frequency.value = 50;
    
    // Mid harmonic
    this.engineOsc2 = this.ctx.createOscillator();
    this.engineOsc2.type = 'square';
    this.engineOsc2.frequency.value = 100;
    
    // Lowpass filter for engine
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    
    this.engineOsc1.connect(filter);
    this.engineOsc2.connect(filter);
    filter.connect(this.engineGain);
    this.engineGain.connect(this.masterGain);
    
    this.engineOsc1.start();
    this.engineOsc2.start();
  }
  
  private setupNitro() {
    if (!this.ctx || !this.masterGain) return;
    this.nitroGain = this.ctx.createGain();
    this.nitroGain.gain.value = 0;
    
    const noiseBuffer = this.createNoiseBuffer();
    if (noiseBuffer) {
      this.nitroNoise = this.ctx.createBufferSource();
      this.nitroNoise.buffer = noiseBuffer;
      this.nitroNoise.loop = true;
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400; // Deep roar
      
      this.nitroNoise.connect(filter);
      filter.connect(this.nitroGain);
      this.nitroGain.connect(this.masterGain);
      this.nitroNoise.start();
    }
  }

  private setupScreech() {
    if (!this.ctx || !this.masterGain) return;
    this.screechGain = this.ctx.createGain();
    this.screechGain.gain.value = 0;
    
    const noiseBuffer = this.createNoiseBuffer();
    if (noiseBuffer) {
      this.screechNoise = this.ctx.createBufferSource();
      this.screechNoise.buffer = noiseBuffer;
      this.screechNoise.loop = true;
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2500;
      filter.Q.value = 1.5;
      
      this.screechNoise.connect(filter);
      filter.connect(this.screechGain);
      this.screechGain.connect(this.masterGain);
      this.screechNoise.start();
    }
  }

  // --- PUBLIC API ---

  updateEngine(rpm: number, isAccelerating: boolean) {
    if (!this.isInitialized || !this.ctx || !this.engineOsc1 || !this.engineOsc2 || !this.engineGain) return;
    
    // Map RPM (1000 - 9000) to Frequency
    const baseFreq = 40 + (rpm / 9000) * 120;
    const time = this.ctx.currentTime;
    
    this.engineOsc1.frequency.setTargetAtTime(baseFreq, time, 0.1);
    this.engineOsc2.frequency.setTargetAtTime(baseFreq * 2.01, time, 0.1); // Slight detune
    
    // Volume based on acceleration
    const targetVol = isAccelerating ? 0.6 : 0.3;
    this.engineGain.gain.setTargetAtTime(targetVol, time, 0.2);
  }

  setNitro(active: boolean) {
    if (!this.isInitialized || !this.ctx || !this.nitroGain) return;
    const time = this.ctx.currentTime;
    this.nitroGain.gain.setTargetAtTime(active ? 0.8 : 0, time, active ? 0.05 : 0.2);
  }

  setDrift(active: boolean, intensity: number = 1) {
    if (!this.isInitialized || !this.ctx || !this.screechGain) return;
    const time = this.ctx.currentTime;
    const targetVol = active ? 0.4 * intensity : 0;
    this.screechGain.gain.setTargetAtTime(targetVol, time, 0.1);
  }

  playCloseCall() {
    if (!this.isInitialized || !this.ctx || !this.masterGain || !this.enabled) return;
    
    // Create a Doppler whoosh
    const time = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    
    osc.type = 'sine';
    
    // Frequency drops rapidly (Doppler)
    osc.frequency.setValueAtTime(600, time);
    osc.frequency.exponentialRampToValueAtTime(100, time + 0.4);
    
    filter.type = 'lowpass';
    filter.frequency.value = 1000;
    
    // Volume envelope
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.5, time + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(time);
    osc.stop(time + 0.5);
  }

  playTurboBlowoff() {
    if (!this.isInitialized || !this.ctx || !this.masterGain || !this.enabled) return;
    
    const time = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.05)); // Decay noise
    }
    
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 3000;
    
    const gain = this.ctx.createGain();
    gain.gain.value = 0.4;
    
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    source.start(time);
  }

  cleanup() {
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
      this.isInitialized = false;
    }
  }
}

export const nitroAudio = new NitroAudioManager();
