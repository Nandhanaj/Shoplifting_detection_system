// Audio Alert Engine using Web Audio API and Speech Synthesis
class AudioAlertEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  setMuted(isMuted) {
    this.muted = isMuted;
  }

  isMuted() {
    return this.muted;
  }

  // Play high-urgency shoplifting detection alert chime
  playThreatAlert() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;

      // Two-tone warning beep (880Hz -> 1174Hz)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(880, now); // A5
      osc1.frequency.setValueAtTime(1174.66, now + 0.12); // D6
      osc1.frequency.setValueAtTime(880, now + 0.24);
      osc1.frequency.setValueAtTime(1174.66, now + 0.36);

      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.5);
    } catch (e) {
      console.warn("Audio alert play error:", e);
    }
  }

  // Play subtle confirmation beep (e.g. guard dispatched, settings saved)
  playAcknowledge() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {
      console.warn("Audio play error:", e);
    }
  }

  // Play store public address deterrent announcement
  playStoreDeterrent(zoneName = "Zone 4") {
    if (this.muted) return;
    // Play PA chime first
    this.playAcknowledge();

    // Use SpeechSynthesis if available
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // cancel previous
      const phrase = `Attention store personnel: Customer assistance requested in ${zoneName}. Security monitor is active.`;
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 0.85;

      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David')));
      if (preferred) utterance.voice = preferred;

      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 300);
    }
  }
}

export const audioAlertEngine = new AudioAlertEngine();
