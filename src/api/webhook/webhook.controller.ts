import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { Request } from 'express';

@Controller('api/webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  // @Post()
  // create(@Body() createWebhookDto: CreateWebhookDto) {
  //   return this.webhookService.create(createWebhookDto);
  // }

  @Get()
  initialize(@Req() req: Request): any {
    return this.webhookService.initializeChatbot(req);
  }

  @Post()
  processWebhook(@Req() req: Request): any {
    return this.webhookService.handleIncomming(req);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.webhookService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWebhookDto: UpdateWebhookDto) {
  //   return this.webhookService.update(+id, updateWebhookDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.webhookService.remove(+id);
  // }
}
