import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { StoreModule } from '../store/store.module';
import { StoreService } from '../store/store.service';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  imports: [HttpModule, ConfigModule, StoreModule],
  controllers: [WebhookController],
  providers: [WebhookService, StoreService],
})
export class WebhookModule {}
