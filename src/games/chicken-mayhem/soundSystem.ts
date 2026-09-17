// Web Audio API Procedural Sound Synthesizer for Chicken Mayhem 3D
// 100% code-generated audio - zero external audio assets required.

class SoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicPlaying: boolean = false;
  private musicTimer: number | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  constructor() {
    // Initialized lazily on first user gesture
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.8;
      this.sfxGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.25;
      this.musicGain.connect(this.ctx.destination);
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ctx && this.sfxGain && this.musicGain) {
      const targetGain = this.isMuted ? 0 : 1;
      this.sfxGain.gain.setTargetAtTime(targetGain * 0.8, this.ctx.currentTime, 0.05);
      this.musicGain.gain.setTargetAtTime(targetGain * 0.25, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // --- SOUND EFFECTS ---

  // 1. Heavy Punchy Shotgun Gunshot
  public playGunshot() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;

    // Sub thump / punch
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.22);
    oscGain.gain.setValueAtTime(1.0, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.26);

    // Noise blast (blast powder)
    const bufferSize = this.ctx.sampleRate * 0.35;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3000, t);
    filter.frequency.exponentialRampToValueAtTime(200, t + 0.35);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(1.2, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);
    noise.start(t);
  }

  // 2. Dry Fire (Empty ammo click)
  public playEmptyClick() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, t);
    osc.frequency.exponentialRampToValueAtTime(150, t + 0.04);
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  // 3. Reload Stages (Open, Insert Shell, Pump Slide)
  public playReloadStep(step: 1 | 2 | 3) {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    if (step === 1) {
      // Breach open clack
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(450, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.08);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.09);
    } else if (step === 2) {
      // Shell load metallic clink
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1100, t);
      osc.frequency.exponentialRampToValueAtTime(1400, t + 0.07);
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.1);
    } else {
      // Pump slide snap
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.exponentialRampToValueAtTime(650, t + 0.06);
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.11);
    }
  }

  // 4. Cartoon Chicken Cluck / Squawk
  public playChickenCluck(pitch = 1.0) {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';

    // Bawk bawk profile
    const baseFreq = 420 * pitch;
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.linearRampToValueAtTime(baseFreq * 1.5, t + 0.05);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, t + 0.14);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.16);

    // Lowpass filter to make it sound organic
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800 * pitch, t);
    filter.Q.value = 2.0;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.17);
  }

  // 5. Chicken Hit / Pop reaction
  public playChickenHit(isHeadshot = false) {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    // Squawk
    this.playChickenCluck(isHeadshot ? 1.6 : 1.2);

    // Cartoon POP sound
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isHeadshot ? 900 : 600, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.12);
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.13);
  }

  // 6. Feather Poof (gentle air sweep)
  public playFeatherPoof() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1500, t);
    filter.frequency.exponentialRampToValueAtTime(400, t + 0.15);
    filter.Q.value = 3;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(t);
  }

  // 7. Golden Chicken Magical Chime
  public playGoldenChime() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const t = this.ctx.currentTime + idx * 0.05;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.25);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.26);
    });
  }

  // 8. Combo Up Sound (rising chords)
  public playCombo(comboCount: number) {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    // Pitch scales with combo count (up to 12)
    const scale = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25, 587.33, 659.25, 783.99, 1046.5];
    const baseIndex = Math.min(comboCount, scale.length - 1);
    const baseFreq = scale[baseIndex];

    const t = this.ctx.currentTime;
    [baseFreq, baseFreq * 1.25].forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + i * 0.03);
      gain.gain.setValueAtTime(0.3, t + i * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.25);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t + i * 0.03);
      osc.stop(t + 0.26);
    });
  }

  // 9. Countdown Beeps (3, 2, 1, GO)
  public playCountdown(isGo = false) {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = isGo ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(isGo ? 880 : 440, t);
    if (isGo) {
      osc.frequency.exponentialRampToValueAtTime(1174, t + 0.2);
    }
    gain.gain.setValueAtTime(isGo ? 0.45 : 0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + (isGo ? 0.35 : 0.15));

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + (isGo ? 0.36 : 0.16));
  }

  // 10. UI Click & Hover
  public playUiClick() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.05);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.06);
  }

  // 11. Event Announcement Siren / Fanfare
  public playEventAlert() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    [440, 554.37, 659.25, 880].forEach((f, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(f, t + i * 0.08);
      gain.gain.setValueAtTime(0.2, t + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.08 + 0.12);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1400;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 0.13);
    });
  }

  // 12. Game Over Fanfare
  public playGameOver() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    const notes = [440, 392, 349.23, 261.63]; // A4, G4, F4, C4
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const noteTime = t + idx * 0.16;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);
      gain.gain.setValueAtTime(0.3, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(noteTime);
      osc.stop(noteTime + 0.32);
    });
  }

  // 13. Soft grass footstep sound
  public playFootstep() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140 + Math.random() * 30, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.06);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.07);
  }

  // 14. Procedural Cartoon Farm Background Music
  public startMusic() {
    if (this.musicPlaying) return;
    this.initContext();
    if (!this.ctx || !this.musicGain) return;

    this.musicPlaying = true;
    let step = 0;

    // Upbeat country/cartoon farm chord progression (C - G - Am - F)
    const chords = [
      { bass: 130.81, arps: [261.63, 329.63, 392.0, 523.25] }, // C
      { bass: 98.0, arps: [196.0, 246.94, 293.66, 392.0] },    // G
      { bass: 110.0, arps: [220.0, 261.63, 329.63, 440.0] },   // Am
      { bass: 87.31, arps: [174.61, 220.0, 261.63, 349.23] }   // F
    ];

    const bpm = 126;
    const stepDuration = 60 / bpm / 2; // 1/8 note duration

    const playStep = () => {
      if (!this.musicPlaying || !this.ctx || !this.musicGain) return;
      const t = this.ctx.currentTime;

      const chordIdx = Math.floor((step % 32) / 8);
      const chord = chords[chordIdx];
      const beatInChord = step % 8;

      // Play Bass on beats 0 and 4
      if (beatInChord === 0 || beatInChord === 4) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(beatInChord === 0 ? chord.bass : chord.bass * 1.5, t);
        bassGain.gain.setValueAtTime(0.35, t);
        bassGain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);

        bassOsc.connect(bassGain);
        bassGain.connect(this.musicGain);
        bassOsc.start(t);
        bassOsc.stop(t + 0.24);
      }

      // Play Banjo-like pluck arpeggio
      const noteFreq = chord.arps[beatInChord % chord.arps.length];
      const arpOsc = this.ctx.createOscillator();
      const arpGain = this.ctx.createGain();
      arpOsc.type = 'sawtooth';
      arpOsc.frequency.setValueAtTime(noteFreq, t);

      // Filter for warm wooden banjo tone
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, t);
      filter.frequency.exponentialRampToValueAtTime(400, t + 0.12);

      arpGain.gain.setValueAtTime(0.12, t);
      arpGain.gain.exponentialRampToValueAtTime(0.005, t + 0.14);

      arpOsc.connect(filter);
      filter.connect(arpGain);
      arpGain.connect(this.musicGain);
      arpOsc.start(t);
      arpOsc.stop(t + 0.15);

      step++;
      this.musicTimer = window.setTimeout(playStep, stepDuration * 1000);
    };

    playStep();
  }

  public stopMusic() {
    this.musicPlaying = false;
    if (this.musicTimer !== null) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }
}

// Export singleton instance
export const soundSystem = new SoundSystem();
