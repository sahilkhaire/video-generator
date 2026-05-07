import { Module } from '@nestjs/common';
import { CostController } from './cost.controller';
import { CostTrackingService } from './cost-tracking.service';

@Module({
  controllers: [CostController],
  providers: [CostTrackingService],
  exports: [CostTrackingService],
})
export class CostModule {}
