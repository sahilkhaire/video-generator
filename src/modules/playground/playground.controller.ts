import {
  Controller,
  Get,
  Header,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeController } from '@nestjs/swagger';
import { promises as fs } from 'fs';
import { join } from 'path';
import { Public } from '../../common/decorators/public.decorator';

@ApiExcludeController()
@Controller('ui')
export class PlaygroundController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @Public()
  @Header('Content-Type', 'text/html')
  async getUi(): Promise<string> {
    await this.ensureEnabled();
    return this.readAsset('index.html');
  }

  @Get('assets/playground.css')
  @Public()
  @Header('Content-Type', 'text/css; charset=utf-8')
  async getCss(): Promise<string> {
    await this.ensureEnabled();
    return this.readAsset('playground.css');
  }

  @Get('assets/playground.js')
  @Public()
  @Header('Content-Type', 'application/javascript; charset=utf-8')
  async getJs(): Promise<string> {
    await this.ensureEnabled();
    return this.readAsset('playground.js');
  }

  private async ensureEnabled(): Promise<void> {
    const enabled = this.configService.get<boolean>('app.enablePlaygroundUi', false);
    if (!enabled) throw new NotFoundException('Route not found');
  }

  private async readAsset(fileName: string): Promise<string> {
    const candidatePaths = [
      join(__dirname, 'assets', fileName),
      join(process.cwd(), 'src', 'modules', 'playground', 'assets', fileName),
      join(process.cwd(), 'dist', 'modules', 'playground', 'assets', fileName),
    ];

    for (const filePath of candidatePaths) {
      try {
        return await fs.readFile(filePath, 'utf8');
      } catch {
        // Try next candidate path.
      }
    }

    throw new InternalServerErrorException(`Playground asset missing: ${fileName}`);
  }
}
