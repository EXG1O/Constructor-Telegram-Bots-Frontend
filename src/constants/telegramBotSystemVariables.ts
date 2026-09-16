import i18n from 'i18n';

export type TelegramBotSystemVariablesType = 'personal' | 'global';

const telegramBotSystemVariables: Record<
  TelegramBotSystemVariablesType,
  { name: string; getDescription: () => string }[]
> = {
  personal: [
    {
      name: 'CHAT_ID',
      getDescription: () => i18n.t('telegramBotSystemVariables.personal.CHAT_ID'),
    },
    {
      name: 'CHAT_TYPE',
      getDescription: () => i18n.t('telegramBotSystemVariables.personal.CHAT_TYPE'),
    },
    {
      name: 'CHAT_NAME',
      getDescription: () => i18n.t('telegramBotSystemVariables.personal.CHAT_NAME'),
    },
    {
      name: 'CHAT_USERNAME',
      getDescription: () => i18n.t('telegramBotSystemVariables.personal.CHAT_USERNAME'),
    },
    {
      name: 'CHAT_FULL_NAME',
      getDescription: () =>
        i18n.t('telegramBotSystemVariables.personal.CHAT_FULL_NAME'),
    },
    {
      name: 'CHAT_LINK',
      getDescription: () => i18n.t('telegramBotSystemVariables.personal.CHAT_LINK'),
    },
    {
      name: 'USER_ID',
      getDescription: () => i18n.t('telegramBotSystemVariables.personal.USER_ID'),
    },
    {
      name: 'USER_IS_BOT',
      getDescription: () => i18n.t('telegramBotSystemVariables.personal.USER_IS_BOT'),
    },
    {
      name: 'USER_IS_PREMIUM',
      getDescription: () =>
        i18n.t('telegramBotSystemVariables.personal.USER_IS_PREMIUM'),
    },
    {
      name: 'USER_NAME',
      getDescription: () => i18n.t('telegramBotSystemVariables.personal.USER_NAME'),
    },
    {
      name: 'USER_USERNAME',
      getDescription: () => i18n.t('telegramBotSystemVariables.personal.USER_USERNAME'),
    },
    {
      name: 'USER_FIRST_NAME',
      getDescription: () =>
        i18n.t('telegramBotSystemVariables.personal.USER_FIRST_NAME'),
    },
    {
      name: 'USER_LAST_NAME',
      getDescription: () =>
        i18n.t('telegramBotSystemVariables.personal.USER_LAST_NAME'),
    },
    {
      name: 'USER_FULL_NAME',
      getDescription: () =>
        i18n.t('telegramBotSystemVariables.personal.USER_FULL_NAME'),
    },
    {
      name: 'USER_LANGUAGE_CODE',
      getDescription: () =>
        i18n.t('telegramBotSystemVariables.personal.USER_LANGUAGE_CODE'),
    },
    {
      name: 'USER_LINK',
      getDescription: () => i18n.t('telegramBotSystemVariables.personal.USER_LINK'),
    },
    {
      name: 'USER_MESSAGE_ID',
      getDescription: () =>
        i18n.t('telegramBotSystemVariables.personal.USER_MESSAGE_ID'),
    },
    {
      name: 'USER_MESSAGE_TEXT',
      getDescription: () =>
        i18n.t('telegramBotSystemVariables.personal.USER_MESSAGE_TEXT'),
    },
    {
      name: 'USER_MESSAGE_DATE',
      getDescription: () =>
        i18n.t('telegramBotSystemVariables.personal.USER_MESSAGE_DATE'),
    },
    {
      name: 'USER_MESSAGE_LINK',
      getDescription: () =>
        i18n.t('telegramBotSystemVariables.personal.USER_MESSAGE_LINK'),
    },
  ],
  global: [
    {
      name: 'BOT_ID',
      getDescription: () => i18n.t('telegramBotSystemVariables.global.BOT_ID'),
    },
    {
      name: 'BOT_NAME',
      getDescription: () => i18n.t('telegramBotSystemVariables.global.BOT_NAME'),
    },
    {
      name: 'BOT_USERNAME',
      getDescription: () => i18n.t('telegramBotSystemVariables.global.BOT_USERNAME'),
    },
    {
      name: 'BOT_FULL_NAME',
      getDescription: () => i18n.t('telegramBotSystemVariables.global.BOT_FULL_NAME'),
    },
    {
      name: 'BOT_LINK',
      getDescription: () => i18n.t('telegramBotSystemVariables.global.BOT_LINK'),
    },
  ],
};

export default telegramBotSystemVariables;
