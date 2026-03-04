export interface StartCommand {
  payload: string;
  description: string;
}

export interface StartCommandBlockFormValues {
  start_command: StartCommand;
  show_start_command_payload: boolean;
  show_start_command_description: boolean;
}
