export enum ContentType {
  SCRIPT = 'script',
  IMAGE = 'image',
  AUDIO = 'audio',
}

export interface IProviderCallRecord {
  id: string;
  provider: string;
  contentType: ContentType;
  estimatedCostUsd: number;
  durationMs: number;
  success: boolean;
  timestamp: Date;
}

export interface IProviderCostSummary {
  provider: string;
  contentType: ContentType;
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  totalEstimatedCostUsd: number;
  averageEstimatedCostUsd: number;
  averageDurationMs: number;
}

export interface ICostSummary {
  totalEstimatedCostUsd: number;
  totalCalls: number;
  byProvider: IProviderCostSummary[];
  trackedSince: Date;
}
