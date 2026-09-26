import { ConnectionObjectType } from 'api';

export type NodeType = Exclude<
  ConnectionObjectType,
  typeof ConnectionObjectType.MessageKeyboardButton
>;
export const NodeType = ConnectionObjectType;
