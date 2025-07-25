import { Type } from './components/TypeBlock';

export function getCreateBlockOpen(type: Type): boolean {
  return type === Type.Create;
}

export function getUpdateBlockOpen(type: Type): boolean {
  return type === Type.Update;
}
