import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { GlobalExceptionFilter } from './../src/common/filters/global-exception.filter';
import { LoggingInterceptor } from './../src/common/interceptors/logging.interceptor';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Replicate main.ts bootstrap
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ─── Root ────────────────────────────────────────────────────────────────────

  describe('GET /api', () => {
    it('should return API info', () => {
      return request(app.getHttpServer())
        .get('/api')
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body).toHaveProperty('message', 'Video Generation API');
          expect(res.body).toHaveProperty('version');
        });
    });
  });

  // ─── Deep health (terminus) ──────────────────────────────────────────────────

  describe('GET /api/health', () => {
    it('should return a health check response', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect((res: request.Response) => {
          // 200 when healthy, 503 when Redis is unavailable — both are valid in CI
          expect([200, 503]).toContain(res.status);
          expect(res.body).toHaveProperty('status');
        });
    });
  });

  // ─── Costs ───────────────────────────────────────────────────────────────────

  describe('GET /api/costs/summary', () => {
    it('should return cost summary (public route)', () => {
      return request(app.getHttpServer())
        .get('/api/costs/summary')
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body).toHaveProperty('totalCalls');
          expect(res.body).toHaveProperty('totalEstimatedCostUsd');
          expect(res.body).toHaveProperty('byProvider');
          expect(Array.isArray(res.body.byProvider)).toBe(true);
        });
    });
  });

  describe('DELETE /api/costs/reset', () => {
    it('should reset cost data and return 204', () => {
      return request(app.getHttpServer()).delete('/api/costs/reset').expect(204);
    });
  });

  // ─── Videos ──────────────────────────────────────────────────────────────────

  describe('POST /api/videos/generate', () => {
    it('should return 400 when body is missing required fields', () => {
      return request(app.getHttpServer()).post('/api/videos/generate').send({}).expect(400);
    });

    it('should return 400 when platform is invalid', () => {
      return request(app.getHttpServer())
        .post('/api/videos/generate')
        .send({ topic: 'test', platform: 'invalid_platform', targetDuration: 30 })
        .expect(400);
    });
  });

  describe('GET /api/videos/providers', () => {
    it('should return active provider names', () => {
      return request(app.getHttpServer())
        .get('/api/videos/providers')
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body).toHaveProperty('script');
          expect(res.body).toHaveProperty('image');
          expect(res.body).toHaveProperty('tts');
        });
    });
  });

  describe('GET /api/videos/jobs/:jobId', () => {
    it('should return 404 for unknown jobId', () => {
      return request(app.getHttpServer()).get('/api/videos/jobs/non-existent-job-id').expect(404);
    });
  });

  // ─── Error shape ─────────────────────────────────────────────────────────────

  describe('Error response shape', () => {
    it('unknown route should return 404 with structured error', () => {
      return request(app.getHttpServer())
        .get('/api/unknown-route-xyz')
        .expect(404)
        .expect((res: request.Response) => {
          expect(res.body).toHaveProperty('statusCode', 404);
          expect(res.body).toHaveProperty('error');
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('path');
        });
    });
  });
});
