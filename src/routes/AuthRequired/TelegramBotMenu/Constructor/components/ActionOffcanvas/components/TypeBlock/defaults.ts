import { Type } from './enums';
import type { TypeBlockFormValues } from './types';

export const defaultType: Type = Type.MessageDeletion;
export const defaultTypeBlockFormValues: TypeBlockFormValues = {
  type: defaultType,
};
