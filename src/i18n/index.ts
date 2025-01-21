import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import Backend from 'i18next-http-backend';

import settings from 'settings';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    debug: settings.DEBUG,
    lng: document.querySelector('html')?.getAttribute('lang') ?? 'ru',
    ns: 'global',
    defaultNS: 'global',
    fallbackLng: false,
    backend: {
      loadPath: `${settings.PUBLIC_PATH}locale/{{lng}}/{{ns}}.json`,
    },
  });

export default i18n;
