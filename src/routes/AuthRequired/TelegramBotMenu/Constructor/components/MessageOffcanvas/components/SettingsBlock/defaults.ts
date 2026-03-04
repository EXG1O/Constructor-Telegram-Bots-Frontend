import type { Settings, SettingsBlockFormValues } from './types';

export const defaultSettings: Settings = {
  reply_to_user_message: false,
  delete_user_message: false,
  send_as_new_message: true,
};
export const defaultSettingsBlockFormValues: SettingsBlockFormValues = {
  settings: defaultSettings,
};
