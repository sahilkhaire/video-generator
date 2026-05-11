/**
 * Central AI tools catalog returned by the providers-models API.
 * This shape is designed for both dynamic forms and provider dashboards.
 */

export type AIToolType = 'script' | 'image' | 'tts';

export interface ProviderModelDefinition {
  id: string;
  name: string;
  displayName: string;
  isDefault?: boolean;
}

export interface ProviderDefinition {
  name: string;
  displayName: string;
  models: ProviderModelDefinition[];
  description?: string;
  isDefault?: boolean;
}

export interface AIToolDefinition {
  id: AIToolType;
  displayName: string;
  description: string;
  providers: ProviderDefinition[];
}

export interface ProvidersCatalogResponse {
  version: string;
  generatedAt: string;
  tools: AIToolDefinition[];
  defaults: Record<AIToolType, { provider: string; model: string }>;
  // Legacy fields kept for backwards compatibility with existing clients.
  script: ProviderDefinition[];
  image: ProviderDefinition[];
  tts: ProviderDefinition[];
}

const SCRIPT_PROVIDERS: ProviderDefinition[] = [
    {
      name: 'openai',
      displayName: 'OpenAI',
      description: 'High-quality general purpose LLMs',
      isDefault: true,
      models: [
        { id: 'gpt-4o', name: 'gpt-4o', displayName: 'GPT-4o', isDefault: true },
        { id: 'gpt-4-turbo', name: 'gpt-4-turbo', displayName: 'GPT-4 Turbo' },
        { id: 'gpt-3.5-turbo', name: 'gpt-3.5-turbo', displayName: 'GPT-3.5 Turbo' },
      ],
    },
    {
      name: 'claude',
      displayName: 'Anthropic Claude',
      description: 'Long-context and reasoning-focused LLMs',
      models: [
        { id: 'claude-3-opus', name: 'claude-3-opus', displayName: 'Claude 3 Opus' },
        { id: 'claude-3-sonnet', name: 'claude-3-sonnet', displayName: 'Claude 3 Sonnet' },
        { id: 'claude-3-haiku', name: 'claude-3-haiku', displayName: 'Claude 3 Haiku' },
      ],
    },
    {
      name: 'groq',
      displayName: 'Groq',
      description: 'Low-latency inference models',
      models: [
        { id: 'mixtral-8x7b', name: 'mixtral-8x7b', displayName: 'Mixtral 8x7b' },
        { id: 'llama-2-70b', name: 'llama-2-70b', displayName: 'Llama 2 70b' },
      ],
    },
    {
      name: 'together-ai',
      displayName: 'TogetherAI',
      description: 'Hosted open-source model catalog',
      models: [
        { id: 'mistralai/Mixtral-8x7B-Instruct-v0.1', name: 'mistralai/Mixtral-8x7B-Instruct-v0.1', displayName: 'Mixtral 8x7B Instruct' },
        { id: 'meta-llama/Llama-2-70b-chat-hf', name: 'meta-llama/Llama-2-70b-chat-hf', displayName: 'Llama 2 70b Chat' },
      ],
    },
    {
      name: 'ollama',
      displayName: 'Ollama (Local)',
      description: 'Local/self-hosted inference via Ollama runtime',
      models: [
        { id: 'mistral', name: 'mistral', displayName: 'Mistral' },
        { id: 'llama2', name: 'llama2', displayName: 'Llama 2' },
        { id: 'neural-chat', name: 'neural-chat', displayName: 'Neural Chat' },
      ],
    },
  ];

const IMAGE_PROVIDERS: ProviderDefinition[] = [
    {
      name: 'dalle',
      displayName: 'DALL-E',
      description: 'OpenAI image generation models',
      isDefault: true,
      models: [
        { id: 'dall-e-3', name: 'dall-e-3', displayName: 'DALL-E 3', isDefault: true },
        { id: 'dall-e-2', name: 'dall-e-2', displayName: 'DALL-E 2' },
      ],
    },
    {
      name: 'stable-diffusion',
      displayName: 'Stable Diffusion',
      description: 'Open image generation family',
      models: [
        { id: 'sd-xl', name: 'sd-xl', displayName: 'Stable Diffusion XL' },
        { id: 'sd-3', name: 'sd-3', displayName: 'Stable Diffusion 3' },
        { id: 'sd-2.1', name: 'sd-2.1', displayName: 'Stable Diffusion 2.1' },
      ],
    },
    {
      name: 'leonardo',
      displayName: 'Leonardo AI',
      description: 'Creative style and visual generation models',
      models: [
        { id: 'leonardo-diffusion', name: 'leonardo-diffusion', displayName: 'Leonardo Diffusion' },
        { id: 'leonardo-vision', name: 'leonardo-vision', displayName: 'Leonardo Vision' },
      ],
    },
    {
      name: 'together-ai',
      displayName: 'TogetherAI',
      description: 'Open-source diffusion models via hosted APIs',
      models: [
        { id: 'black-forest-labs/FLUX.1-schnell', name: 'black-forest-labs/FLUX.1-schnell', displayName: 'FLUX.1 Schnell' },
        { id: 'black-forest-labs/FLUX.1-dev', name: 'black-forest-labs/FLUX.1-dev', displayName: 'FLUX.1 Dev' },
      ],
    },
  ];

const TTS_PROVIDERS: ProviderDefinition[] = [
    {
      name: 'openai',
      displayName: 'OpenAI',
      description: 'OpenAI speech synthesis models',
      isDefault: true,
      models: [
        { id: 'tts-1-hd', name: 'tts-1-hd', displayName: 'TTS-1 HD', isDefault: true },
        { id: 'tts-1', name: 'tts-1', displayName: 'TTS-1' },
      ],
    },
    {
      name: 'elevenlabs',
      displayName: 'ElevenLabs',
      description: 'Premium multi-language voice synthesis',
      models: [
        { id: 'eleven_multilingual_v2', name: 'eleven_multilingual_v2', displayName: 'Multilingual v2' },
        { id: 'eleven_monolingual_v1', name: 'eleven_monolingual_v1', displayName: 'Monolingual v1' },
      ],
    },
    {
      name: 'google-tts',
      displayName: 'Google Cloud TTS',
      description: 'Cloud text-to-speech voices from Google',
      models: [
        { id: 'default', name: 'default', displayName: 'Default' },
      ],
    },
    {
      name: 'edge-tts',
      displayName: 'Microsoft Edge TTS',
      description: 'Browser-based neural voices',
      models: [
        { id: 'edge-default', name: 'edge-default', displayName: 'Edge Default' },
      ],
    },
    {
      name: 'coqui',
      displayName: 'Coqui TTS',
      description: 'Open-source TTS models and pipelines',
      models: [
        { id: 'coqui-default', name: 'coqui-default', displayName: 'Coqui Default' },
      ],
    },
    {
      name: 'groq',
      displayName: 'Groq',
      description: 'High throughput synthesis/inference backends',
      models: [
        { id: 'groq-default', name: 'groq-default', displayName: 'Groq Default' },
      ],
    },
  ];

export const PROVIDERS_MODELS_CONFIG: ProvidersCatalogResponse = {
  version: '1.0.0',
  generatedAt: new Date().toISOString(),
  tools: [
    {
      id: 'script',
      displayName: 'LLM (Script Generation)',
      description: 'Text generation providers used for script/story creation',
      providers: SCRIPT_PROVIDERS,
    },
    {
      id: 'image',
      displayName: 'Image Generation',
      description: 'Image generation providers used for scene visuals',
      providers: IMAGE_PROVIDERS,
    },
    {
      id: 'tts',
      displayName: 'Text-to-Speech',
      description: 'Audio generation providers used for narration/voice',
      providers: TTS_PROVIDERS,
    },
  ],
  defaults: {
    script: { provider: 'openai', model: 'gpt-4o' },
    image: { provider: 'dalle', model: 'dall-e-3' },
    tts: { provider: 'openai', model: 'tts-1-hd' },
  },
  script: SCRIPT_PROVIDERS,
  image: IMAGE_PROVIDERS,
  tts: TTS_PROVIDERS,
};
