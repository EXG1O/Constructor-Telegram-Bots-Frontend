export interface Command {
  command: string;
  description: string;
}

export interface CommandBlockFormValues {
  command: Command;
  show_command_description: boolean;
}
