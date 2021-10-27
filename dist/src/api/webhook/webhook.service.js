"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WebhookService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const node_fetch_1 = require("node-fetch");
const store_service_1 = require("../store/store.service");
let WebhookService = WebhookService_1 = class WebhookService {
    constructor(configService, storeService) {
        this.configService = configService;
        this.storeService = storeService;
        this.logger = new common_1.Logger(WebhookService_1.name);
    }
    initializeChatbot(req) {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];
        if (mode === 'subscribe' &&
            token === this.configService.get('VERIFY_TOKEN')) {
            this.logger.log('webhook verified.');
            return challenge;
        }
        this.logger.warn('VERIFY_TOKEN does not match');
        throw new common_1.HttpException('VERIFY_TOKEN does not match', common_1.HttpStatus.FORBIDDEN);
    }
    async getStores(coordinates) {
        const stores = await this.storeService.findNearest({
            type: 'Point',
            coordinates,
        });
        return {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    elements: stores.map((store) => {
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
    async checkingAttachments(attachment) {
        const { type } = attachment;
        const switchCase = async () => {
            switch (type) {
                case 'location':
                    const { payload: { coordinates: { lat, long }, }, } = attachment;
                    return await this.getStores([long, lat]);
            }
        };
        return switchCase();
    }
    createPayload({ action, data }) {
        return JSON.stringify({
            action,
            data,
        });
    }
    handleIncomming(req) {
        const { body } = req;
        if (body.object === 'page') {
            const entries = body.entry;
            entries.forEach((entry) => {
                const webhook_event = entry.messaging[0];
                const sender_psid = webhook_event.sender.id;
                console.log(webhook_event);
                if (webhook_event.message) {
                    this.logger.log(`webhook message event recieved from sender_psid: ${sender_psid}`);
                    this.handleMessage(sender_psid, webhook_event.message);
                }
                if (webhook_event.postback) {
                    this.logger.log(`webhook postback event recieved from sender_psid: ${sender_psid}`);
                    this.handlePostback(sender_psid, webhook_event.postback);
                }
            });
            return common_1.HttpStatus.ACCEPTED;
        }
        else {
            return common_1.HttpStatus.NOT_FOUND;
        }
    }
    async handleMessage(sender_psid, received_message) {
        let response;
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
                                image_url: `${this.configService.get('GOOGLE_MAP_STATIC_URL')}?center=${received_message.text},CA&zoom=15&size=400x400&key=${this.configService.get('GOOGLE_MAP_TOKEN')}`,
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
            response = await this.checkingAttachments(received_message.attachments[0]);
        }
        this.callSendAPI(sender_psid, response);
    }
    async handlePostback(sender_psid, received_postback) {
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
                const location = await (0, node_fetch_1.default)(`${this.configService.get('GOOGLE_MAP_GEOCODING_URL')}?address=${data}&key=${this.configService.get('GOOGLE_MAP_TOKEN')}`)
                    .then((res) => res.json())
                    .then((res) => {
                    return res.results[0].geometry.location;
                })
                    .catch((err) => {
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
    callSendAPI(sender_psid, response) {
        const request_body = {
            recipient: {
                id: sender_psid,
            },
            message: response,
        };
        console.log(request_body);
        (0, node_fetch_1.default)(`${this.configService.get('FB_MESSAGE_URL')}?access_token=${this.configService.get('PAGE_ACCESS_TOKEN')}`, {
            method: 'POST',
            body: JSON.stringify(request_body),
            headers: { 'Content-Type': 'application/json' },
        })
            .then((res) => res.json())
            .then((res) => {
            return res;
        })
            .catch((err) => {
            this.logger.error(`webhook error: ${err}`);
        });
    }
};
WebhookService = WebhookService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        store_service_1.StoreService])
], WebhookService);
exports.WebhookService = WebhookService;
//# sourceMappingURL=webhook.service.js.map