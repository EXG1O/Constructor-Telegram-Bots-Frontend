export interface Settings {
  reply_to_user_message: boolean;
  delete_user_message: boolean;
  send_as_new_message: boolean;
}

export interface SettingsBlockFormValues {
  settings: Settings;
}
