import { Type } from './components/TypeBlock';

export function getStartCommandBlockOpen(type: Type): boolean {
  return type === Type.StartCommand;
}

export function getCommandBlockOpen(type: Type): boolean {
  return type === Type.Command;
}

export function getMessageBlockOpen(type: Type): boolean {
  return type === Type.Message;
}
