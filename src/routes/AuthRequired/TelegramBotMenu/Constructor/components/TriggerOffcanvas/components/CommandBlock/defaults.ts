import type { Command, CommandBlockFormValues } from './types';

export const defaultCommand: Command = { command: '', description: '' };
export const defaultCommandBlockFormValues: CommandBlockFormValues = {
  command: defaultCommand,
  show_command_description: false,
};
