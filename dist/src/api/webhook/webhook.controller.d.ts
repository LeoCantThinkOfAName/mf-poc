import { WebhookService } from './webhook.service';
import { Request } from 'express';
export declare class WebhookController {
    private readonly webhookService;
    constructor(webhookService: WebhookService);
    initialize(req: Request): any;
    processWebhook(req: Request): any;
}
