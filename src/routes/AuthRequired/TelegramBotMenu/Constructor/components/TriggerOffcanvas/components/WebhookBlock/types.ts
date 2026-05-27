export interface Webhook {
  url: string | null;
}

export interface WebhookBlockFormValues {
  webhook: Webhook;
}
