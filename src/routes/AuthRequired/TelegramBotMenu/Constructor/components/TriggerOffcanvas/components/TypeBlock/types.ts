export enum Type {
  StartCommand = 'startCommand',
  Command = 'command',
  Message = 'message',
  AnyMessage = 'anyMessage',
  Webhook = 'webhook',
}

export interface TypeBlockFormValues {
  type: Type;
}
