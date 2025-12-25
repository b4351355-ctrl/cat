import { AUDIO_CONFIG } from '../constants';
import { ItemType } from '../types';

let audioCtx: AudioContext | null = null;
const audioCache: Record<string, HTMLAudioElement> = {};

export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  // Preload audios if URLs are present
  Object.values(AUDIO_CONFIG.ITEMS).forEach(url => {
    if (url) {
      const audio = new Audio(url);
      audioCache[url] = audio;
    }
  });
};

const playFile = (url: string) => {
  if (!url) return false;
  try {
    const audio = audioCache[url] || new Audio(url);
    audio.currentTime = 0;
    audio.play().catch(e => console.warn("Playback failed", e));
    return true;
  } catch (e) {
    return false;
  }
};

export const playSuccessSound = (comboPitch = 1.0) => {
  // Try playing custom "Great" sound first
  if (playFile(AUDIO_CONFIG.SOUND_CORRECT)) return;

  // Fallback to synth
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
  if (playFile(AUDIO_CONFIG.SOUND_WRONG)) return;

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

export const speak = (text: string, itemType?: ItemType) => {
  // 1. Check Custom Audio File
  if (itemType && AUDIO_CONFIG.ITEMS[itemType]) {
    playFile(AUDIO_CONFIG.ITEMS[itemType]);
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
  utterance.rate = 1.4; 
  utterance.pitch = 1.4;
  utterance.volume = 1.0;

  window.speechSynthesis.speak(utterance);
};