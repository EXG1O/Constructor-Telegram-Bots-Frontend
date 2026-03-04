import type { StartCommand, StartCommandBlockFormValues } from './types';

export const defaultStartCommand: StartCommand = { payload: '', description: '' };
export const defaultStartCommandBlockFormValues: StartCommandBlockFormValues = {
  start_command: defaultStartCommand,
  show_start_command_payload: false,
  show_start_command_description: false,
};
