import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { StoreService } from '../store/store.service';
export declare class WebhookService {
    private configService;
    private storeService;
    private logger;
    constructor(configService: ConfigService, storeService: StoreService);
    initializeChatbot(req: Request): string;
    getStores(coordinates: number[]): Promise<{
        attachment: {
            type: string;
            payload: {
                template_type: string;
                elements: any;
            };
        };
    }>;
    checkingAttachments(attachment: Record<string, any>): Promise<{
        attachment: {
            type: string;
            payload: {
                template_type: string;
                elements: any;
            };
        };
    }>;
    createPayload({ action, data }: {
        action: string;
        data?: string;
    }): string;
    handleIncomming(req: Request): HttpStatus.ACCEPTED | HttpStatus.NOT_FOUND;
    handleMessage(sender_psid: string, received_message: Record<string, any>): Promise<void>;
    handlePostback(sender_psid: string, received_postback: any): Promise<void>;
    callSendAPI(sender_psid: string, response: Record<string, any>): void;
}
