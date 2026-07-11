// @ts-ignore
import notificationTone from '../assets/notification_tone.mp3';

/**
 * Plays the premium notification MP3 audio file from assets.
 */
export const playNotificationSound = () => {
  try {
    const audio = new Audio(notificationTone);
    audio.play().catch(err => {
      console.warn('Audio playback was prevented by browser auto-play policy:', err);
    });
  } catch (err) {
    console.error('Failed to play notification sound file:', err);
  }
};
