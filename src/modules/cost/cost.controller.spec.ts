import { Test, TestingModule } from '@nestjs/testing';
import { CostController } from './cost.controller';
import { CostTrackingService } from './cost-tracking.service';
import { ContentType, ICostSummary } from '../../domain/interfaces/cost-tracking.interface';

describe('CostController', () => {
  let controller: CostController;
  let mockCostTrackingService: jest.Mocked<CostTrackingService>;

  const mockSummary: ICostSummary = {
    totalEstimatedCostUsd: 0.09,
    totalCalls: 2,
    byProvider: [
      {
        provider: 'openai',
        contentType: ContentType.SCRIPT,
        totalCalls: 1,
        successfulCalls: 1,
        failedCalls: 0,
        totalEstimatedCostUsd: 0.05,
        averageEstimatedCostUsd: 0.05,
        averageDurationMs: 1200,
      },
      {
        provider: 'dalle',
        contentType: ContentType.IMAGE,
        totalCalls: 1,
        successfulCalls: 1,
        failedCalls: 0,
        totalEstimatedCostUsd: 0.04,
        averageEstimatedCostUsd: 0.04,
        averageDurationMs: 2500,
      },
    ],
    trackedSince: new Date('2026-01-01'),
  };

  beforeEach(async () => {
    mockCostTrackingService = {
      recordCall: jest.fn(),
      getRecords: jest.fn().mockReturnValue([]),
      getSummary: jest.fn().mockReturnValue(mockSummary),
      reset: jest.fn(),
    } as unknown as jest.Mocked<CostTrackingService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CostController],
      providers: [{ provide: CostTrackingService, useValue: mockCostTrackingService }],
    }).compile();

    controller = module.get<CostController>(CostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSummary', () => {
    it('should return the cost summary from service', () => {
      // Act
      const result = controller.getSummary();

      // Assert
      expect(result).toBe(mockSummary);
      expect(mockCostTrackingService.getSummary).toHaveBeenCalledTimes(1);
    });

    it('should include byProvider breakdown in the response', () => {
      // Act
      const result = controller.getSummary();

      // Assert
      expect(result.byProvider).toHaveLength(2);
      expect(result.totalCalls).toBe(2);
      expect(result.totalEstimatedCostUsd).toBeCloseTo(0.09);
    });
  });

  describe('reset', () => {
    it('should delegate to cost tracking service reset', () => {
      // Act
      controller.reset();

      // Assert
      expect(mockCostTrackingService.reset).toHaveBeenCalledTimes(1);
    });
  });
});
