import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import fetch from 'node-fetch';
import { Store } from '../store/entities/store.entity';

import { StoreService } from '../store/store.service';

@Injectable()
export class WebhookService {
  private logger = new Logger(WebhookService.name);

  constructor(
    private configService: ConfigService,
    private storeService: StoreService,
  ) {}

  initializeChatbot(req: Request): string {
    const mode = req.query['hub.mode'] as string;
    const token = req.query['hub.verify_token'] as string;
    const challenge = req.query['hub.challenge'] as string;

    if (
      mode === 'subscribe' &&
      token === this.configService.get('VERIFY_TOKEN')
    ) {
      this.logger.log('webhook verified.');
      return challenge;
    }

    this.logger.warn('VERIFY_TOKEN does not match');
    throw new HttpException(
      'VERIFY_TOKEN does not match',
      HttpStatus.FORBIDDEN,
    );
  }

  async getStores(coordinates: number[]) {
    const stores = await this.storeService.findNearest({
      type: 'Point',
      coordinates,
    });

    return {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: stores.map((store: Store) => {
            return {
              title: store.name,
              subtitle: `Address: ${store.address}\u000ABusiness Hour: ${store.opening} ~ ${store.closing}\u000ATel: ${store.tel}\u000AEmail: ${store.email}`,
              image_url: store.img,
              buttons: [
                {
                  type: 'web_url',
                  title: 'Start a session!',
                  url: 'https://google.com',
                },
              ],
            };
          }),
        },
      },
    };
  }

  async checkingAttachments(attachment: Record<string, any>) {
    const { type } = attachment;

    const switchCase = async () => {
      switch (type) {
        case 'location':
          const {
            payload: {
              coordinates: { lat, long },
            },
          } = attachment;
          return await this.getStores([long, lat]);
      }
    };

    return switchCase();
  }

  createPayload({ action, data }: { action: string; data?: string }): string {
    return JSON.stringify({
      action,
      data,
    });
  }

  handleIncomming(req: Request) {
    const { body } = req;

    if (body.object === 'page') {
      const entries = body.entry as any[];

      entries.forEach((entry) => {
        const webhook_event = entry.messaging[0] as Record<string, any>;
        const sender_psid = webhook_event.sender.id;

        console.log(webhook_event);

        if (webhook_event.message) {
          this.logger.log(
            `webhook message event recieved from sender_psid: ${sender_psid}`,
          );
          this.handleMessage(sender_psid, webhook_event.message);
        }

        if (webhook_event.postback) {
          this.logger.log(
            `webhook postback event recieved from sender_psid: ${sender_psid}`,
          );
          this.handlePostback(sender_psid, webhook_event.postback);
        }
      });

      return HttpStatus.ACCEPTED;
    } else {
      return HttpStatus.NOT_FOUND;
    }
  }

  async handleMessage(
    sender_psid: string,
    received_message: Record<string, any>,
  ) {
    let response: Record<string, any>;

    if (received_message.text) {
      response = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: "Is This the neighborhood you're looking for?",
                subtitle: 'Select Yes/No to continue...',
                image_url: `${this.configService.get(
                  'GOOGLE_MAP_STATIC_URL',
                )}?center=${
                  received_message.text
                },CA&zoom=15&size=400x400&key=${this.configService.get(
                  'GOOGLE_MAP_TOKEN',
                )}`,
                buttons: [
                  {
                    type: 'postback',
                    title: 'YES!',
                    payload: this.createPayload({
                      action: 'FIND_STORES',
                      data: received_message.text,
                    }),
                  },
                  {
                    type: 'postback',
                    title: 'NO...',
                    payload: this.createPayload({ action: 'RETRY' }),
                  },
                ],
              },
            ],
          },
        },
      };
    }

    if (received_message.attachments) {
      response = await this.checkingAttachments(
        received_message.attachments[0],
      );
    }

    this.callSendAPI(sender_psid, response);
  }

  async handlePostback(sender_psid: string, received_postback: any) {
    let response;
    const payload = JSON.parse(received_postback.payload);
    const { action, data } = payload;

    switch (action) {
      case 'RETRY':
        response = {
          text: 'Send me your address, or share your location with me!',
        };
        break;
      case 'FIND_STORES':
        const location = await fetch(
          `${this.configService.get(
            'GOOGLE_MAP_GEOCODING_URL',
          )}?address=${data}&key=${this.configService.get('GOOGLE_MAP_TOKEN')}`,
        )
          .then((res: any) => res.json())
          .then((res: any) => {
            return res.results[0].geometry.location;
          })
          .catch((err: any) => {
            this.logger.error(`webhook error: ${err}`);
          });
        response = await this.getStores([location.lng, location.lat]);
        break;
      case 'GET_STARTED':
        response = {
          text: 'Send me your address, or share your location with me!',
        };
        break;
      default:
        response = {
          text: 'Send me your address, or share your location with me!',
        };
    }

    this.callSendAPI(sender_psid, response);
  }

  callSendAPI(sender_psid: string, response: Record<string, any>): void {
    const request_body = {
      recipient: {
        id: sender_psid,
      },
      message: response,
    };

    console.log(request_body);

    fetch(
      `${this.configService.get(
        'FB_MESSAGE_URL',
      )}?access_token=${this.configService.get('PAGE_ACCESS_TOKEN')}`,
      {
        method: 'POST',
        body: JSON.stringify(request_body),
        headers: { 'Content-Type': 'application/json' },
      },
    )
      .then((res: any) => res.json())
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => {
        this.logger.error(`webhook error: ${err}`);
      });
  }
}
