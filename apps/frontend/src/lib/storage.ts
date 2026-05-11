/**
 * localStorage utilities for persisting user selections across sessions
 */

const STORAGE_KEYS = {
  SCRIPT_PROVIDER: 'video-gen:scriptProvider',
  SCRIPT_MODEL: 'video-gen:scriptModel',
  IMAGE_PROVIDER: 'video-gen:imageProvider',
  IMAGE_MODEL: 'video-gen:imageModel',
  TTS_PROVIDER: 'video-gen:ttsProvider',
  TTS_MODEL: 'video-gen:ttsModel',
};

export const ProviderStorage = {
  // Script Provider
  getScriptProvider: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.SCRIPT_PROVIDER);
    } catch {
      return null;
    }
  },
  setScriptProvider: (provider: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCRIPT_PROVIDER, provider);
    } catch (e) {
      console.warn('Failed to save script provider:', e);
    }
  },

  // Script Model
  getScriptModel: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.SCRIPT_MODEL);
    } catch {
      return null;
    }
  },
  setScriptModel: (model: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCRIPT_MODEL, model);
    } catch (e) {
      console.warn('Failed to save script model:', e);
    }
  },

  // Image Provider
  getImageProvider: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.IMAGE_PROVIDER);
    } catch {
      return null;
    }
  },
  setImageProvider: (provider: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.IMAGE_PROVIDER, provider);
    } catch (e) {
      console.warn('Failed to save image provider:', e);
    }
  },

  // Image Model
  getImageModel: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.IMAGE_MODEL);
    } catch {
      return null;
    }
  },
  setImageModel: (model: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.IMAGE_MODEL, model);
    } catch (e) {
      console.warn('Failed to save image model:', e);
    }
  },

  // TTS Provider
  getTtsProvider: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.TTS_PROVIDER);
    } catch {
      return null;
    }
  },
  setTtsProvider: (provider: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.TTS_PROVIDER, provider);
    } catch (e) {
      console.warn('Failed to save TTS provider:', e);
    }
  },

  // TTS Model
  getTtsModel: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.TTS_MODEL);
    } catch {
      return null;
    }
  },
  setTtsModel: (model: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.TTS_MODEL, model);
    } catch (e) {
      console.warn('Failed to save TTS model:', e);
    }
  },

  // Clear all
  clearAll: (): void => {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    } catch (e) {
      console.warn('Failed to clear provider storage:', e);
    }
  },
};
