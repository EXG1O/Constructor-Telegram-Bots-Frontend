import type { UpdateBlockFormValues, UpdateOperation } from './types';

export const defaultUpdateOperation: UpdateOperation = {
  overwrite: true,
  lookup_field_name: '',
  lookup_field_value: '',
  create_if_not_found: true,
  new_data: JSON.stringify({ key: 'value' }, undefined, 2),
};
export const defaultUpdateBlockFormValues: UpdateBlockFormValues = {
  update_operation: defaultUpdateOperation,
};
