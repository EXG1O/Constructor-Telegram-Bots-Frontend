import type { Webhook, WebhookBlockFormValues } from './types';

export const defaultWebhook: Webhook = { url: null };
export const defaultWebhookBlockFormValues: WebhookBlockFormValues = {
  webhook: defaultWebhook,
};
