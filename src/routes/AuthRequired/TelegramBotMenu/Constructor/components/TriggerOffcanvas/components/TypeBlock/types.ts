export enum Type {
  StartCommand = 'startCommand',
  Command = 'command',
  Message = 'message',
  AnyMessage = 'anyMessage',
}

export interface TypeBlockFormValues {
  type: Type;
}
