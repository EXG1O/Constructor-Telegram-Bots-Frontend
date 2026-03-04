import type { CreateBlockFormValues, CreateOperation } from './types';

export const defaultCreateOperation: CreateOperation = {
  data: JSON.stringify({ key: 'value' }, undefined, 2),
};
export const defaultCreateBlockFormValues: CreateBlockFormValues = {
  create_operation: defaultCreateOperation,
};
