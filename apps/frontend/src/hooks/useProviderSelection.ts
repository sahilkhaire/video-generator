import { useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/api/client';
import { ProvidersModels, ProviderOption } from '@/types/api';
import { ProviderStorage } from '@/lib/storage';

interface UseProviderSelectionReturn {
  providersModels: ProvidersModels | null;
  loading: boolean;
  error: string | null;
  
  // Script Provider
  scriptProvider: string | null;
  setScriptProvider: (provider: string) => void;
  scriptProviders: ProviderOption[];
  scriptModels: { id: string; name: string; displayName: string }[];
  scriptModel: string | null;
  setScriptModel: (model: string) => void;

  // Image Provider
  imageProvider: string | null;
  setImageProvider: (provider: string) => void;
  imageProviders: ProviderOption[];
  imageModels: { id: string; name: string; displayName: string }[];
  imageModel: string | null;
  setImageModel: (model: string) => void;

  // TTS Provider
  ttsProvider: string | null;
  setTtsProvider: (provider: string) => void;
  ttsProviders: ProviderOption[];
  ttsModels: { id: string; name: string; displayName: string }[];
  ttsModel: string | null;
  setTtsModel: (model: string) => void;
}

export const useProviderSelection = (): UseProviderSelectionReturn => {
  const [providersModels, setProvidersModels] = useState<ProvidersModels | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Script Provider state
  const [scriptProvider, setScriptProviderState] = useState<string | null>(
    ProviderStorage.getScriptProvider()
  );
  const [scriptModel, setScriptModelState] = useState<string | null>(
    ProviderStorage.getScriptModel()
  );

  // Image Provider state
  const [imageProvider, setImageProviderState] = useState<string | null>(
    ProviderStorage.getImageProvider()
  );
  const [imageModel, setImageModelState] = useState<string | null>(
    ProviderStorage.getImageModel()
  );

  // TTS Provider state
  const [ttsProvider, setTtsProviderState] = useState<string | null>(
    ProviderStorage.getTtsProvider()
  );
  const [ttsModel, setTtsModelState] = useState<string | null>(
    ProviderStorage.getTtsModel()
  );

  // Fetch providers and models on mount
  useEffect(() => {
    const fetchProvidersModels = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getProvidersModels();
        setProvidersModels(data);
        setError(null);

        // Set defaults from stored values or first available
        if (!scriptProvider && data.script.length > 0) {
          const defaultScriptProvider = data.defaults?.script?.provider || data.script[0].name;
          setScriptProviderState(defaultScriptProvider);
          ProviderStorage.setScriptProvider(defaultScriptProvider);

          const scriptProviderModels =
            data.script.find((provider) => provider.name === defaultScriptProvider)?.models ||
            data.script[0].models;

          if (!scriptModel && scriptProviderModels.length > 0) {
            const defaultScriptModel = data.defaults?.script?.model || scriptProviderModels[0].id;
            setScriptModelState(defaultScriptModel);
            ProviderStorage.setScriptModel(defaultScriptModel);
          }
        }

        if (!imageProvider && data.image.length > 0) {
          const defaultImageProvider = data.defaults?.image?.provider || data.image[0].name;
          setImageProviderState(defaultImageProvider);
          ProviderStorage.setImageProvider(defaultImageProvider);

          const imageProviderModels =
            data.image.find((provider) => provider.name === defaultImageProvider)?.models ||
            data.image[0].models;

          if (!imageModel && imageProviderModels.length > 0) {
            const defaultImageModel = data.defaults?.image?.model || imageProviderModels[0].id;
            setImageModelState(defaultImageModel);
            ProviderStorage.setImageModel(defaultImageModel);
          }
        }

        if (!ttsProvider && data.tts.length > 0) {
          const defaultTtsProvider = data.defaults?.tts?.provider || data.tts[0].name;
          setTtsProviderState(defaultTtsProvider);
          ProviderStorage.setTtsProvider(defaultTtsProvider);

          const ttsProviderModels =
            data.tts.find((provider) => provider.name === defaultTtsProvider)?.models ||
            data.tts[0].models;

          if (!ttsModel && ttsProviderModels.length > 0) {
            const defaultTtsModel = data.defaults?.tts?.model || ttsProviderModels[0].id;
            setTtsModelState(defaultTtsModel);
            ProviderStorage.setTtsModel(defaultTtsModel);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load providers');
        console.error('Error fetching providers-models:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProvidersModels();
  }, []);

  const setScriptProvider = useCallback((provider: string) => {
    setScriptProviderState(provider);
    ProviderStorage.setScriptProvider(provider);
    // Reset model when provider changes
    const newModel = providersModels?.script.find((p) => p.name === provider)?.models[0]?.id || null;
    if (newModel) {
      setScriptModel(newModel);
    }
  }, [providersModels]);

  const setScriptModel = useCallback((model: string) => {
    setScriptModelState(model);
    ProviderStorage.setScriptModel(model);
  }, []);

  const setImageProvider = useCallback((provider: string) => {
    setImageProviderState(provider);
    ProviderStorage.setImageProvider(provider);
    // Reset model when provider changes
    const newModel = providersModels?.image.find((p) => p.name === provider)?.models[0]?.id || null;
    if (newModel) {
      setImageModel(newModel);
    }
  }, [providersModels]);

  const setImageModel = useCallback((model: string) => {
    setImageModelState(model);
    ProviderStorage.setImageModel(model);
  }, []);

  const setTtsProvider = useCallback((provider: string) => {
    setTtsProviderState(provider);
    ProviderStorage.setTtsProvider(provider);
    // Reset model when provider changes
    const newModel = providersModels?.tts.find((p) => p.name === provider)?.models[0]?.id || null;
    if (newModel) {
      setTtsModel(newModel);
    }
  }, [providersModels]);

  const setTtsModel = useCallback((model: string) => {
    setTtsModelState(model);
    ProviderStorage.setTtsModel(model);
  }, []);

  const scriptProviders = providersModels?.script || [];
  const scriptModels =
    providersModels?.script.find((p) => p.name === scriptProvider)?.models || [];

  const imageProviders = providersModels?.image || [];
  const imageModels =
    providersModels?.image.find((p) => p.name === imageProvider)?.models || [];

  const ttsProviders = providersModels?.tts || [];
  const ttsModels =
    providersModels?.tts.find((p) => p.name === ttsProvider)?.models || [];

  return {
    providersModels,
    loading,
    error,
    scriptProvider,
    setScriptProvider,
    scriptProviders,
    scriptModels,
    scriptModel,
    setScriptModel,
    imageProvider,
    setImageProvider,
    imageProviders,
    imageModels,
    imageModel,
    setImageModel,
    ttsProvider,
    setTtsProvider,
    ttsProviders,
    ttsModels,
    ttsModel,
    setTtsModel,
  };
};
