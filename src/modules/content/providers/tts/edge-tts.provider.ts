import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { promises as fs } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  ITTSProvider,
  IGeneratedAudio,
} from '../../../../domain/interfaces/tts-provider.interface';
import { GenerateAudioRequestDto } from '../../../../domain/dto/generate-audio.dto';
import { AudioFormat } from '../../../../domain/enums/video.enums';
import { AudioGenerationException } from '../../../../common/exceptions/content-generation.exception';

const AVERAGE_WORDS_PER_SECOND = 2.5;
const DEFAULT_VOICE = 'en-US-AriaNeural';

@Injectable()
export class EdgeTTSProvider implements ITTSProvider {
  private readonly logger = new Logger(EdgeTTSProvider.name);

  constructor(private readonly configService: ConfigService) {}

  getProviderName(): string {
    return 'edge-tts';
  }

  async generateAudio(request: GenerateAudioRequestDto): Promise<IGeneratedAudio> {
    this.logger.log(`Generating TTS audio via Edge TTS: "${request.text.slice(0, 50)}..."`);

    const voice =
      request.voice ??
      this.configService.get<string>('providers.edgeTts.voice', DEFAULT_VOICE);
    const outputPath = await this.resolveOutputPath(request.outputPath);

    try {
      await this.ensureDirectoryExists(outputPath);

      const tts = new MsEdgeTTS();
      await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
      await tts.toFile(outputPath, request.text);

      this.logger.log(`Edge TTS audio saved to: ${outputPath}`);

      const speed = request.speed ?? 1.0;

      return {
        filePath: outputPath,
        duration: this.estimateDuration(request.text, speed),
        format: AudioFormat.MP3,
        sampleRate: 24000,
        text: request.text,
      };
    } catch (error) {
      if (error instanceof AudioGenerationException) throw error;
      this.logger.error('Edge TTS generation failed', error);
      throw new AudioGenerationException('edge-tts', error as Error);
    }
  }

  private async resolveOutputPath(requestedPath?: string): Promise<string> {
    if (requestedPath) return requestedPath;
    const tempDir = this.configService.get<string>('video.storage.tempPath', './temp');
    return join(tempDir, 'audio', `${uuidv4()}.mp3`);
  }

  private async ensureDirectoryExists(filePath: string): Promise<void> {
    const dir = filePath.substring(0, filePath.lastIndexOf('/'));
    if (dir) {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  private estimateDuration(text: string, speed: number): number {
    const wordCount = text.trim().split(/\s+/).length;
    return wordCount / (AVERAGE_WORDS_PER_SECOND * speed);
  }
}
