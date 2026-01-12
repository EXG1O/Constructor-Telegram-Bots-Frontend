export type TelegramBotSystemVariablesType = 'personal' | 'global';

const telegramBotSystemVariables: Record<TelegramBotSystemVariablesType, string[]> = {
  personal: [
    'CHAT_ID',
    'CHAT_TYPE',
    'CHAT_NAME',
    'CHAT_USERNAME',
    'CHAT_FULL_NAME',
    'CHAT_LINK',
    'USER_ID',
    'USER_IS_BOT',
    'USER_IS_PREMIUM',
    'USER_NAME',
    'USER_USERNAME',
    'USER_FIRST_NAME',
    'USER_LAST_NAME',
    'USER_FULL_NAME',
    'USER_LANGUAGE_CODE',
    'USER_LINK',
    'USER_MESSAGE_ID',
    'USER_MESSAGE_TEXT',
    'USER_MESSAGE_DATE',
    'USER_MESSAGE_LINK',
  ],
  global: ['BOT_ID', 'BOT_NAME', 'BOT_USERNAME', 'BOT_FULL_NAME', 'BOT_LINK'],
};

export default telegramBotSystemVariables;
