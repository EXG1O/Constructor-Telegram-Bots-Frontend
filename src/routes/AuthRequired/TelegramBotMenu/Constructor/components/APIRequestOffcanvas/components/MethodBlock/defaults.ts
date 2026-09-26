import { Method } from './enums';
import type { MethodBlockFormValues } from './types';

export const defaultMethod: Method = Method.Get;
export const defaultMethodBlockFormValues: MethodBlockFormValues = {
  method: defaultMethod,
};
