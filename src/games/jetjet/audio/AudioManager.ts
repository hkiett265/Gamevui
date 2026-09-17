// Comprehensive Professional Audio Engine for Jet Jet Miền Tây 3D
// High immersion Web Audio API architecture with Master Limiter, Audio Buses, 
// Layered Engine RPM synthesis, Rev/Nẹt Pô, Wind, Road Surfaces, Spatial Animals, and Dynamic Music.

import { SurfaceType } from '@/games/jetjet/store';

export class JetJetAudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  // Master Dynamics Compressor (Limiter - Headphone safety & anti-clipping)
  private masterLimiter: DynamicsCompressorNode | null = null;
  private masterGain: GainNode | null = null;

  // Audio Sub-Buses
  private engineBus: GainNode | null = null;
  private vehicleSfxBus: GainNode | null = null;
  private worldBus: GainNode | null = null;
  private npcBus: GainNode | null = null;
  private animalBus: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private uiBus: GainNode | null = null;
  private cinematicBus: GainNode | null = null;

  // Volumes
  private masterVol = 1.0;
  private musicVol = 0.8;
  private sfxVol = 0.9;

  // Engine Synthesis Nodes
  private isEngineRunning = false;
  private idleOsc: OscillatorNode | null = null;
  private lowOsc: OscillatorNode | null = null;
  private midOsc: OscillatorNode | null = null;
  private highOsc: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  private idleGain: GainNode | null = null;
  private lowGain: GainNode | null = null;
  private midGain: GainNode | null = null;
  private highGain: GainNode | null = null;
  private engineMasterGain: GainNode | null = null;

  // Wind Audio
  private windSource: AudioBufferSourceNode | null = null;
  private windGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;

  // Road Surface Audio
  private roadSource: AudioBufferSourceNode | null = null;
  private roadGain: GainNode | null = null;
  private roadFilter: BiquadFilterNode | null = null;

  // Ambience
  private cicadaInterval: any = null;
  private waterGain: GainNode | null = null;
  private shopHumGain: GainNode | null = null;

  // Dynamic Music Trackers
  private currentMusicState: 'NONE' | 'EXPLORATION' | 'CHASE' | 'TRANSFORMATION' = 'NONE';
  private musicInterval: any = null;
  private musicStep = 0;

  public init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      this.ctx = new AudioContextClass();

      // 1. Setup Master Limiter (DynamicsCompressorNode)
      this.masterLimiter = this.ctx.createDynamicsCompressor();
      this.masterLimiter.threshold.setValueAtTime(-3, this.ctx.currentTime); // -3 dB
      this.masterLimiter.knee.setValueAtTime(6, this.ctx.currentTime);
      this.masterLimiter.ratio.setValueAtTime(20, this.ctx.currentTime); // Hard limiting ratio
      this.masterLimiter.attack.setValueAtTime(0.003, this.ctx.currentTime); // Fast attack
      this.masterLimiter.release.setValueAtTime(0.2, this.ctx.currentTime);
      this.masterLimiter.connect(this.ctx.destination);

      // 2. Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVol, this.ctx.currentTime);
      this.masterGain.connect(this.masterLimiter);

      // 3. Setup Buses
      this.engineBus = this.ctx.createGain();
      this.vehicleSfxBus = this.ctx.createGain();
      this.worldBus = this.ctx.createGain();
      this.npcBus = this.ctx.createGain();
      this.animalBus = this.ctx.createGain();
      this.musicBus = this.ctx.createGain();
      this.uiBus = this.ctx.createGain();
      this.cinematicBus = this.ctx.createGain();

      this.updateBusVolumes();

      // Connect all buses to Master Gain
      const buses = [
        this.engineBus,
        this.vehicleSfxBus,
        this.worldBus,
        this.npcBus,
        this.animalBus,
        this.musicBus,
        this.uiBus,
        this.cinematicBus
      ];
      buses.forEach((b) => b?.connect(this.masterGain!));

      // Setup continuous wind & road surface noise
      this.setupContinuousNoise();
    } catch {
      // AudioContext init error
    }
  }

  private ensureContext(): AudioContext | null {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setVolumes(master: number, music: number, sfx: number) {
    this.masterVol = master;
    this.musicVol = music;
    this.sfxVol = sfx;
    this.updateBusVolumes();
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : this.masterVol, this.ctx.currentTime, 0.05);
    }
  }

  private updateBusVolumes() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const sfx = this.isMuted ? 0 : this.sfxVol;
    const mus = this.isMuted ? 0 : this.musicVol;

    this.engineBus?.gain.setTargetAtTime(sfx * 0.9, t, 0.05);
    this.vehicleSfxBus?.gain.setTargetAtTime(sfx * 0.85, t, 0.05);
    this.worldBus?.gain.setTargetAtTime(sfx * 0.65, t, 0.05);
    this.npcBus?.gain.setTargetAtTime(sfx * 0.8, t, 0.05);
    this.animalBus?.gain.setTargetAtTime(sfx * 0.75, t, 0.05);
    this.musicBus?.gain.setTargetAtTime(mus * 0.6, t, 0.05);
    this.uiBus?.gain.setTargetAtTime(sfx * 0.7, t, 0.05);
    this.cinematicBus?.gain.setTargetAtTime(sfx * 1.0, t, 0.05);
  }

  // --- CONTINUOUS WIND & ROAD NOISE ---
  private setupContinuousNoise() {
    const ctx = this.ensureContext();
    if (!ctx || !this.worldBus || !this.vehicleSfxBus) return;

    // Create 2-second pink noise buffer
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    // Wind channel
    this.windSource = ctx.createBufferSource();
    this.windSource.buffer = noiseBuffer;
    this.windSource.loop = true;
    this.windFilter = ctx.createBiquadFilter();
    this.windFilter.type = 'bandpass';
    this.windFilter.frequency.setValueAtTime(450, ctx.currentTime);
    this.windFilter.Q.setValueAtTime(1.2, ctx.currentTime);
    this.windGain = ctx.createGain();
    this.windGain.gain.setValueAtTime(0, ctx.currentTime);
    this.windSource.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.worldBus);
    this.windSource.start();

    // Road surface channel
    this.roadSource = ctx.createBufferSource();
    this.roadSource.buffer = noiseBuffer;
    this.roadSource.loop = true;
    this.roadFilter = ctx.createBiquadFilter();
    this.roadFilter.type = 'lowpass';
    this.roadFilter.frequency.setValueAtTime(320, ctx.currentTime);
    this.roadGain = ctx.createGain();
    this.roadGain.gain.setValueAtTime(0, ctx.currentTime);
    this.roadSource.connect(this.roadFilter);
    this.roadFilter.connect(this.roadGain);
    this.roadGain.connect(this.vehicleSfxBus);
    this.roadSource.start();
  }

  // --- MULTI-LAYER MOTORCYCLE ENGINE SYNTHESIS ---
  public startEngine() {
    const ctx = this.ensureContext();
    if (!ctx || this.isEngineRunning || !this.engineBus) return;

    try {
      this.engineMasterGain = ctx.createGain();
      this.engineMasterGain.gain.setValueAtTime(0.28, ctx.currentTime);

      this.engineFilter = ctx.createBiquadFilter();
      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.setValueAtTime(550, ctx.currentTime);
      this.engineFilter.Q.setValueAtTime(2.8, ctx.currentTime);

      // 4 RPM Layer Oscillators + Sub Bass
      this.idleOsc = ctx.createOscillator();
      this.idleOsc.type = 'triangle';
      this.idleGain = ctx.createGain();
      this.idleOsc.connect(this.idleGain);

      this.lowOsc = ctx.createOscillator();
      this.lowOsc.type = 'sawtooth';
      this.lowGain = ctx.createGain();
      this.lowOsc.connect(this.lowGain);

      this.midOsc = ctx.createOscillator();
      this.midOsc.type = 'square';
      this.midGain = ctx.createGain();
      this.midOsc.connect(this.midGain);

      this.highOsc = ctx.createOscillator();
      this.highOsc.type = 'sawtooth';
      this.highGain = ctx.createGain();
      this.highOsc.connect(this.highGain);

      this.subOsc = ctx.createOscillator();
      this.subOsc.type = 'sine';
      const subG = ctx.createGain();
      subG.gain.setValueAtTime(0.35, ctx.currentTime);
      this.subOsc.connect(subG);

      // Connect all layers to main filter
      this.idleGain.connect(this.engineFilter);
      this.lowGain.connect(this.engineFilter);
      this.midGain.connect(this.engineFilter);
      this.highGain.connect(this.engineFilter);
      subG.connect(this.engineFilter);

      this.engineFilter.connect(this.engineMasterGain);
      this.engineMasterGain.connect(this.engineBus);

      // Start all oscillators
      const t = ctx.currentTime;
      this.idleOsc.start(t);
      this.lowOsc.start(t);
      this.midOsc.start(t);
      this.highOsc.start(t);
      this.subOsc.start(t);

      this.isEngineRunning = true;
    } catch {}
  }

  public updateEngine(
    speedKmh: number, 
    rpm: number, 
    isAccelerating: boolean, 
    isRevving: boolean,
    surface: SurfaceType
  ) {
    if (!this.ctx || !this.isEngineRunning || !this.idleOsc) return;

    const t = this.ctx.currentTime;
    const effectiveRpm = isRevving ? Math.max(rpm, 8200) : rpm;
    const baseFreq = 38 + (effectiveRpm / 9500) * 195;

    // Frequencies
    this.idleOsc.frequency.setTargetAtTime(baseFreq, t, 0.04);
    this.lowOsc?.frequency.setTargetAtTime(baseFreq * 1.01, t, 0.04);
    this.midOsc?.frequency.setTargetAtTime(baseFreq * 1.99, t, 0.04);
    this.highOsc?.frequency.setTargetAtTime(baseFreq * 2.98, t, 0.04);
    this.subOsc?.frequency.setTargetAtTime(baseFreq * 0.5, t, 0.04);

    // Crossfade layer weights based on RPM
    const idleWeight = Math.max(0, 1 - effectiveRpm / 2500);
    const lowWeight = Math.max(0, Math.min(effectiveRpm / 3000, 1 - (effectiveRpm - 3000) / 3000));
    const midWeight = Math.max(0, Math.min((effectiveRpm - 2500) / 3000, 1 - (effectiveRpm - 5500) / 3000));
    const highWeight = Math.max(0, (effectiveRpm - 5000) / 4500);

    this.idleGain?.gain.setTargetAtTime(idleWeight * 0.4, t, 0.05);
    this.lowGain?.gain.setTargetAtTime(lowWeight * 0.35, t, 0.05);
    this.midGain?.gain.setTargetAtTime(midWeight * 0.3, t, 0.05);
    this.highGain?.gain.setTargetAtTime(highWeight * 0.35, t, 0.05);

    // Filter dynamics & rev limiter stutter (BRAP-BRAP-BRAP at 8500+)
    let targetCutoff = isAccelerating || isRevving
      ? Math.min(3200, 600 + speedKmh * 18 + (effectiveRpm / 9000) * 1600)
      : Math.min(1200, 420 + speedKmh * 7);

    if (effectiveRpm > 8400 && (isAccelerating || isRevving)) {
      // Limiter stutter modulation
      const stutter = Math.sin(t * 45) > 0 ? 1 : 0.45;
      targetCutoff *= stutter;
      this.engineMasterGain?.gain.setTargetAtTime(0.38 * stutter, t, 0.02);
    } else {
      const targetVol = isAccelerating || isRevving ? 0.38 : 0.22;
      this.engineMasterGain?.gain.setTargetAtTime(targetVol, t, 0.06);
    }

    this.engineFilter?.frequency.setTargetAtTime(targetCutoff, t, 0.05);

    // Wind Audio updates
    if (this.windGain && this.windFilter) {
      const speedNorm = Math.min(speedKmh / 100, 1);
      this.windGain.gain.setTargetAtTime(speedNorm * 0.28, t, 0.08);
      this.windFilter.frequency.setTargetAtTime(350 + speedNorm * 1800, t, 0.08);
    }

    // Road Surface Audio updates
    if (this.roadGain && this.roadFilter) {
      const speedNorm = Math.min(speedKmh / 80, 1);
      let surfaceVol = speedNorm * 0.18;
      let surfaceCutoff = 350;

      if (surface === 'CONCRETE') {
        surfaceCutoff = 420;
      } else if (surface === 'DIRT') {
        surfaceVol *= 1.4;
        surfaceCutoff = 650;
      } else if (surface === 'BRIDGE') {
        surfaceVol *= 1.6;
        surfaceCutoff = 280; // Hollow bridge low resonance
      }

      this.roadGain.gain.setTargetAtTime(surfaceVol, t, 0.08);
      this.roadFilter.frequency.setTargetAtTime(surfaceCutoff, t, 0.08);
    }
  }

  // Nẹt pô (Rev engine) burst & exhaust pop
  public playExhaustPop() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted || !this.vehicleSfxBus) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.08);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.vehicleSfxBus);
    osc.start(t);
    osc.stop(t + 0.09);
  }

  // Hard brake tire skid
  public playBrakeSkid() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted || !this.vehicleSfxBus) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1450, t);
    osc.frequency.linearRampToValueAtTime(1100, t + 0.25);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1300, t);
    filter.Q.setValueAtTime(4.0, t);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.26);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.vehicleSfxBus);

    osc.start(t);
    osc.stop(t + 0.26);
  }

  public stopEngine() {
    if (!this.isEngineRunning) return;
    try {
      this.idleOsc?.stop();
      this.lowOsc?.stop();
      this.midOsc?.stop();
      this.highOsc?.stop();
      this.subOsc?.stop();
    } catch {}
    this.isEngineRunning = false;
    this.idleOsc = null;
  }

  // --- FOOTSTEPS ---
  public playFootstep(surface: SurfaceType, isRunning: boolean) {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted || !this.worldBus) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = surface === 'GRASS' ? 'sine' : 'triangle';
    const basePitch = isRunning ? 110 : 85;
    osc.frequency.setValueAtTime(basePitch, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.06);

    gain.gain.setValueAtTime(isRunning ? 0.22 : 0.14, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    osc.connect(gain);
    gain.connect(this.worldBus);
    osc.start(t);
    osc.stop(t + 0.07);
  }

  // --- SPATIAL ANIMAL SOUNDS ---
  // Dog Barking (Spatial Panner)
  public playDogBark(distance: number, isPanLeft: boolean) {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted || !this.animalBus) return;

    // Attenuation by distance
    if (distance > 65) return;
    const distFactor = Math.max(0.05, 1 - distance / 65);

    const t = ctx.currentTime;
    const panner = ctx.createStereoPanner();
    panner.pan.setValueAtTime(isPanLeft ? -0.65 : 0.65, t);

    // Two rapid barks: "Gâu! Gâu!"
    [0, 0.16].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(360, t + offset);
      osc.frequency.exponentialRampToValueAtTime(140, t + offset + 0.12);

      gain.gain.setValueAtTime(0.3 * distFactor, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.13);

      osc.connect(gain);
      gain.connect(panner);
      panner.connect(this.animalBus!);
      osc.start(t + offset);
      osc.stop(t + offset + 0.13);
    });
  }

  // Chicken Clucking & Flapping
  public playChickenScatter(distance: number) {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted || !this.animalBus) return;
    if (distance > 35) return;

    const distFactor = Math.max(0.1, 1 - distance / 35);
    const t = ctx.currentTime;

    // Fast startled clucks
    [0, 0.08, 0.18].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(750 + Math.random() * 200, t + offset);
      osc.frequency.exponentialRampToValueAtTime(450, t + offset + 0.07);

      gain.gain.setValueAtTime(0.25 * distFactor, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.08);

      osc.connect(gain);
      gain.connect(this.animalBus!);
      osc.start(t + offset);
      osc.stop(t + offset + 0.08);
    });
  }

  // --- VIETNAMESE NPC VOICE REACTIONS ---
  public playNpcShout(type: 'EH_ANH_HAI' | 'CHAY_DI' | 'TROI_OI' | 'XE_DEP') {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted || !this.npcBus) return;

    const t = ctx.currentTime;
    // Synthesize comical pitch formant vocal bursts
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'bandpass';
    filter.Q.setValueAtTime(5.0, t);

    if (type === 'EH_ANH_HAI') {
      // "Ê ANH HAI!" - High shout rising then falling
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.linearRampToValueAtTime(440, t + 0.2);
      osc.frequency.linearRampToValueAtTime(260, t + 0.55);
      filter.frequency.setValueAtTime(1400, t);
      gain.gain.setValueAtTime(0.45, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      osc.start(t);
      osc.stop(t + 0.6);
    } else if (type === 'CHAY_DI') {
      // "CHẠY ĐI ANH HAI!"
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(420, t);
      osc.frequency.exponentialRampToValueAtTime(280, t + 0.45);
      filter.frequency.setValueAtTime(1600, t);
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.start(t);
      osc.stop(t + 0.5);
    } else {
      // Funny reaction
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380, t);
      osc.frequency.exponentialRampToValueAtTime(240, t + 0.35);
      filter.frequency.setValueAtTime(1200, t);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
      osc.start(t);
      osc.stop(t + 0.38);
    }

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.npcBus);
  }

  // --- PURSUER MOTORCYCLE SPATIAL AUDIO ---
  public playPursuerEngine(pursuerDist: number, pursuerAngle: number) {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted || !this.npcBus) return;
    if (pursuerDist > 55) return;

    const t = ctx.currentTime;
    const distFactor = Math.max(0.05, 1 - pursuerDist / 55);

    // Behind panner
    const panner = ctx.createStereoPanner();
    panner.pan.setValueAtTime(Math.sin(pursuerAngle) * 0.7, t);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(85 + Math.sin(t * 12) * 8, t);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, t);

    gain.gain.setValueAtTime(0.28 * distFactor, t);
    gain.gain.linearRampToValueAtTime(0.001, t + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(panner);
    panner.connect(this.npcBus);

    osc.start(t);
    osc.stop(t + 0.12);
  }

  // --- DYNAMIC MUSIC ARPEGGIATOR SYSTEM ---
  public setMusicState(state: 'NONE' | 'EXPLORATION' | 'CHASE' | 'TRANSFORMATION') {
    if (this.currentMusicState === state) return;
    this.currentMusicState = state;

    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }

    if (state === 'EXPLORATION') {
      // Relaxing Vietnamese countryside pentatonic theme (C, D, E, G, A)
      const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
      this.musicStep = 0;
      this.musicInterval = setInterval(() => {
        if (!this.isMuted && this.musicBus && this.ctx) {
          const note = scale[this.musicStep % scale.length];
          this.playMusicTone(note, 0.35, 'sine', 0.08);
          this.musicStep++;
        }
      }, 480);
    } else if (state === 'CHASE') {
      // High-energy fast driving bass pulse & driving chords (140 BPM, every 214ms)
      const bassNotes = [110, 110, 130.81, 146.83, 110, 164.81];
      this.musicStep = 0;
      this.musicInterval = setInterval(() => {
        if (!this.isMuted && this.musicBus && this.ctx) {
          const note = bassNotes[this.musicStep % bassNotes.length];
          this.playMusicTone(note, 0.18, 'sawtooth', 0.22);
          this.musicStep++;
        }
      }, 214);
    }
  }

  private playMusicTone(freq: number, duration: number, type: OscillatorType, volume: number) {
    const ctx = this.ensureContext();
    if (!ctx || !this.musicBus) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(this.musicBus);
    osc.start(t);
    osc.stop(t + duration);
  }

  // --- INTERACTION & CINEMATIC SFX ---
  public playMount() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted || !this.vehicleSfxBus) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(this.vehicleSfxBus);
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  }

  public playDismount() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted || !this.vehicleSfxBus) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(580, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(190, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(this.vehicleSfxBus);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  }

  public playBottleOpen() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted || !this.vehicleSfxBus) return;

    const t = ctx.currentTime;
    // Fizz noise burst
    const bufferSize = ctx.sampleRate * 0.22;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3400, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.vehicleSfxBus);
    noise.start(t);
  }

  public playGulp() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted || !this.vehicleSfxBus) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(340, t);
    osc.frequency.exponentialRampToValueAtTime(150, t + 0.22);
    gain.gain.setValueAtTime(0.36, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc.connect(gain);
    gain.connect(this.vehicleSfxBus);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  public playTransformationBlast() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted || !this.cinematicBus) return;

    const t = ctx.currentTime;

    // Sub-bass impact drop
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(130, t);
    sub.frequency.exponentialRampToValueAtTime(26, t + 0.9);
    subGain.gain.setValueAtTime(0.65, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
    sub.connect(subGain);
    subGain.connect(this.cinematicBus);
    sub.start(t);
    sub.stop(t + 0.9);

    // Energy chord fanfare
    [523.25, 659.25, 783.99, 1046.5].forEach((freq) => {
      const chord = ctx.createOscillator();
      const chordGain = ctx.createGain();
      chord.type = 'triangle';
      chord.frequency.setValueAtTime(freq, t + 0.25);
      chordGain.gain.setValueAtTime(0.18, t + 0.25);
      chordGain.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
      chord.connect(chordGain);
      chordGain.connect(this.cinematicBus!);
      chord.start(t + 0.25);
      chord.stop(t + 1.4);
    });
  }

  public playMissionPassed() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted || !this.uiBus) return;

    const t = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.09);
      gain.gain.setValueAtTime(0.24, t + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.09 + 0.6);
      osc.connect(gain);
      gain.connect(this.uiBus!);
      osc.start(t + idx * 0.09);
      osc.stop(t + idx * 0.09 + 0.6);
    });
  }

  public playUiClick() {
    const ctx = this.ensureContext();
    if (!ctx || this.isMuted || !this.uiBus) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(750, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
    osc.connect(gain);
    gain.connect(this.uiBus);
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  }

  // --- AMBIENCE ---
  public startAmbience() {
    this.setMusicState('EXPLORATION');
  }

  public cleanup() {
    this.stopEngine();
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.cicadaInterval) {
      clearInterval(this.cicadaInterval);
      this.cicadaInterval = null;
    }
  }
}

export const jetJetAudio = new JetJetAudioManager();
