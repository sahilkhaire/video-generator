import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ClaudeScriptProvider } from './claude-script.provider';
import {
  ProviderNotConfiguredException,
  ScriptGenerationException,
} from '../../../../common/exceptions/content-generation.exception';
import { GenerateScriptRequestDto } from '../../../../domain/dto/generate-script.dto';
import { VideoPlatform, VideoStyle, SceneTransition } from '../../../../domain/enums/video.enums';

jest.mock('@anthropic-ai/sdk', () => {
  const mockCreate = jest.fn();
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      messages: { create: mockCreate },
    })),
    __mockCreate: mockCreate,
  };
});

const AnthropicMock = jest.requireMock('@anthropic-ai/sdk');

describe('ClaudeScriptProvider', () => {
  let provider: ClaudeScriptProvider;
  let configService: jest.Mocked<ConfigService>;
  let mockCreate: jest.Mock;

  const validRequest: GenerateScriptRequestDto = {
    topic: 'The lifecycle of a butterfly',
    platform: VideoPlatform.YOUTUBE,
    style: VideoStyle.ANIMATED,
    targetDuration: 30,
  };

  const mockScriptJson = JSON.stringify({
    title: 'Butterfly Life Cycle',
    description: 'Animated guide to butterfly metamorphosis.',
    scenes: [
      {
        sequenceNumber: 1,
        narration: 'A butterfly begins its life as a tiny egg.',
        imageDescription: 'A tiny white egg on a green leaf, soft lighting, animated style',
        duration: 10,
        transition: 'fade',
      },
      {
        sequenceNumber: 2,
        narration: 'The caterpillar hatches and starts eating.',
        imageDescription: 'A colourful caterpillar eating a leaf, animated style',
        duration: 10,
        transition: 'cut',
      },
      {
        sequenceNumber: 3,
        narration: 'Inside the chrysalis, transformation begins.',
        imageDescription: 'A glowing chrysalis hanging from a branch, magical light effects',
        duration: 10,
        transition: 'dissolve',
      },
    ],
  });

  beforeEach(async () => {
    mockCreate = AnthropicMock.__mockCreate;
    mockCreate.mockReset();
    AnthropicMock.default.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClaudeScriptProvider,
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    provider = module.get<ClaudeScriptProvider>(ClaudeScriptProvider);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('getProviderName', () => {
    it('should return "claude"', () => {
      expect(provider.getProviderName()).toBe('claude');
    });
  });

  describe('generateScript', () => {
    it('should throw ProviderNotConfiguredException when API key is missing', async () => {
      // Arrange
      (configService.get as jest.Mock).mockReturnValue(undefined);

      // Act & Assert
      await expect(provider.generateScript(validRequest)).rejects.toThrow(
        ProviderNotConfiguredException,
      );
    });

    it('should generate a valid script successfully', async () => {
      // Arrange
      (configService.get as jest.Mock).mockImplementation((key: string, defaultVal?: string) => {
        if (key === 'providers.claude.apiKey') return 'sk-ant-test-key';
        if (key === 'providers.script.model') return 'claude-opus-4-5';
        return defaultVal;
      });

      mockCreate.mockResolvedValueOnce({
        content: [{ type: 'text', text: mockScriptJson }],
      });

      // Act
      const result = await provider.generateScript(validRequest);

      // Assert
      expect(result.title).toBe('Butterfly Life Cycle');
      expect(result.platform).toBe(VideoPlatform.YOUTUBE);
      expect(result.style).toBe(VideoStyle.ANIMATED);
      expect(result.scenes).toHaveLength(3);
      expect(result.totalDuration).toBe(30);
      expect(result.generatedAt).toBeInstanceOf(Date);
    });

    it('should assign a uuid to each scene', async () => {
      // Arrange
      (configService.get as jest.Mock).mockImplementation((key: string, defaultVal?: string) => {
        if (key === 'providers.claude.apiKey') return 'sk-ant-test-key';
        return defaultVal;
      });

      mockCreate.mockResolvedValueOnce({
        content: [{ type: 'text', text: mockScriptJson }],
      });

      // Act
      const result = await provider.generateScript(validRequest);

      // Assert
      result.scenes.forEach((scene) => {
        expect(scene.id).toMatch(/^[0-9a-f-]{36}$/);
      });
    });

    it('should default to FADE transition for unknown transition values', async () => {
      // Arrange
      const scriptWithBadTransition = JSON.stringify({
        ...JSON.parse(mockScriptJson),
        scenes: [{ ...JSON.parse(mockScriptJson).scenes[0], transition: 'zoom' }],
      });

      (configService.get as jest.Mock).mockImplementation((key: string, defaultVal?: string) => {
        if (key === 'providers.claude.apiKey') return 'sk-ant-test-key';
        return defaultVal;
      });

      mockCreate.mockResolvedValueOnce({
        content: [{ type: 'text', text: scriptWithBadTransition }],
      });

      // Act
      const result = await provider.generateScript(validRequest);

      // Assert
      expect(result.scenes[0].transition).toBe(SceneTransition.FADE);
    });

    it('should throw ScriptGenerationException when response has no text block', async () => {
      // Arrange
      (configService.get as jest.Mock).mockImplementation((key: string, defaultVal?: string) => {
        if (key === 'providers.claude.apiKey') return 'sk-ant-test-key';
        return defaultVal;
      });

      mockCreate.mockResolvedValueOnce({ content: [] });

      // Act & Assert
      await expect(provider.generateScript(validRequest)).rejects.toThrow(
        ScriptGenerationException,
      );
    });

    it('should throw ScriptGenerationException when response contains no JSON', async () => {
      // Arrange
      (configService.get as jest.Mock).mockImplementation((key: string, defaultVal?: string) => {
        if (key === 'providers.claude.apiKey') return 'sk-ant-test-key';
        return defaultVal;
      });

      mockCreate.mockResolvedValueOnce({
        content: [{ type: 'text', text: 'Sorry, I cannot help with that.' }],
      });

      // Act & Assert
      await expect(provider.generateScript(validRequest)).rejects.toThrow(
        ScriptGenerationException,
      );
    });

    it('should throw ScriptGenerationException when API call fails', async () => {
      // Arrange
      (configService.get as jest.Mock).mockImplementation((key: string, defaultVal?: string) => {
        if (key === 'providers.claude.apiKey') return 'sk-ant-test-key';
        return defaultVal;
      });

      mockCreate.mockRejectedValueOnce(new Error('Rate limit exceeded'));

      // Act & Assert
      await expect(provider.generateScript(validRequest)).rejects.toThrow(
        ScriptGenerationException,
      );
    });

    it('should default to CARTOON style when style not provided', async () => {
      // Arrange
      const requestWithoutStyle: GenerateScriptRequestDto = {
        topic: 'Ocean life',
        platform: VideoPlatform.INSTAGRAM_REELS,
        targetDuration: 15,
      };

      (configService.get as jest.Mock).mockImplementation((key: string, defaultVal?: string) => {
        if (key === 'providers.claude.apiKey') return 'sk-ant-test-key';
        return defaultVal;
      });

      mockCreate.mockResolvedValueOnce({
        content: [{ type: 'text', text: mockScriptJson }],
      });

      // Act
      const result = await provider.generateScript(requestWithoutStyle);

      // Assert
      expect(result.style).toBe(VideoStyle.CARTOON);
    });
  });
});
