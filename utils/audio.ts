// Simple audio synthesizer using Web Audio API and SpeechSynthesis

let audioCtx: AudioContext | null = null;

// OPTIONAL: If you have real audio files, map the ItemType labels to URLs here.
// Example: { '萝卜': '/audio/luobo.mp3' }
const CUSTOM_AUDIO_MAP: Record<string, string> = {
  // '萝卜': 'https://example.com/audio/carrot_girl_voice.mp3',
};

export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const playSuccessSound = (comboPitch = 1.0) => {
  if (!audioCtx) initAudio();
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  // Higher pitch for higher combos
  const baseFreq = 600 * Math.min(1.5, Math.max(1.0, 1 + (comboPitch * 0.05)));

  osc.type = 'sine';
  osc.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 2, audioCtx.currentTime + 0.1);
  
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.3);
};

export const playErrorSound = () => {
  if (!audioCtx) initAudio();
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, audioCtx.currentTime);
  osc.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.3);
  
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.3);
};

export const speak = (text: string) => {
  // 1. Check if we have a custom audio file for this word
  if (CUSTOM_AUDIO_MAP[text]) {
    const audio = new Audio(CUSTOM_AUDIO_MAP[text]);
    audio.play().catch(e => console.log("Audio play failed", e));
    return;
  }

  // 2. Fallback to Browser TTS
  if (!window.speechSynthesis) return;
  
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  // Try to find a Chinese voice
  const voices = window.speechSynthesis.getVoices();
  const zhVoice = voices.find(v => v.lang.includes('zh'));
  if (zhVoice) utterance.voice = zhVoice;
  
  utterance.lang = 'zh-CN'; 
  utterance.rate = 1.4; // Faster
  utterance.pitch = 1.4; // Higher pitch (female/child-like)
  utterance.volume = 1.0;

  window.speechSynthesis.speak(utterance);
};