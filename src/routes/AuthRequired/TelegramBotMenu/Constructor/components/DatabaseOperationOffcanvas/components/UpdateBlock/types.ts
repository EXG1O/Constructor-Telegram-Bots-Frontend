export interface UpdateOperation {
  overwrite: boolean;
  lookup_field_name: string;
  lookup_field_value: string;
  create_if_not_found: boolean;
  new_data: string;
}

export interface UpdateBlockFormValues {
  update_operation: UpdateOperation;
}
