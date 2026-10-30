import * as Speech from 'expo-speech';

// Pronunciation uses the phone's own text-to-speech engine, so it works offline and needs no server.
// Only English text is spoken: Uzbek voices are missing on most phones.

export async function speakEnglish(text: string, slow = false): Promise<void> {
  const value = text.trim();
  if (!value) return;
  try {
    // Pressing again while it talks restarts it instead of queueing.
    await Speech.stop();
    Speech.speak(value, { language: 'en-US', rate: slow ? 0.6 : 0.95 });
  } catch {
    // No TTS engine available: stay silent.
  }
}

export function stopSpeaking(): void {
  Speech.stop().catch(() => undefined);
}
