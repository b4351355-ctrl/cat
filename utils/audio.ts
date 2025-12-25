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

// Helper for TTS
const triggerTTS = (text: string, pitch = 1.5, rate = 1.6) => {
  if (!window.speechSynthesis) return;
  
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const zhVoice = voices.find(v => v.lang.includes('zh'));
  if (zhVoice) utterance.voice = zhVoice;
  
  utterance.lang = 'zh-CN'; 
  utterance.rate = rate; 
  utterance.pitch = pitch; 
  utterance.volume = 1.0;

  window.speechSynthesis.speak(utterance);
};

export const stopAudio = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

export const playSuccessSound = (comboPitch = 1.0) => {
  // 1. Try playing custom file first
  if (playFile(AUDIO_CONFIG.SOUND_CORRECT)) return;

  // 2. Play "Zhen Bang" via TTS - Rate set to 2.2 as requested
  triggerTTS("真棒", 1.6, 2.2); 

  // 3. Play ding sound effect (Web Audio API)
  if (!audioCtx) initAudio();
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  const baseFreq = 800 * Math.min(1.5, Math.max(1.0, 1 + (comboPitch * 0.05)));

  osc.type = 'sine';
  osc.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 2, audioCtx.currentTime + 0.1);
  
  gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.2);
};

export const playErrorSound = () => {
  if (window.speechSynthesis) window.speechSynthesis.cancel();

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
  if (itemType && AUDIO_CONFIG.ITEMS[itemType]) {
    playFile(AUDIO_CONFIG.ITEMS[itemType]);
    return;
  }
  // Speak the item name even faster (raised rate from 2.0 to 2.8)
  triggerTTS(text, 1.6, 2.8);
};