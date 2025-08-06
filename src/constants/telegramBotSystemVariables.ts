export type TelegramBotSystemVariableType = 'personal' | 'global';

const telegramBotSystemVariables: Record<TelegramBotSystemVariableType, string[]> = {
  personal: [
    'USER_ID',
    'USER_USERNAME',
    'USER_FIRST_NAME',
    'USER_LAST_NAME',
    'USER_FULL_NAME',
    'USER_LANGUAGE_CODE',
    'USER_MESSAGE_ID',
    'USER_MESSAGE_TEXT',
    'USER_MESSAGE_DATE',
  ],
  global: ['BOT_NAME', 'BOT_USERNAME'],
};

export default telegramBotSystemVariables;
