import { initReactI18next } from 'react-i18next';
import Language from 'enums/language';
import i18n from 'i18next';
import Backend from 'i18next-http-backend';

import settings from 'settings';

import getLocationLanguage from 'utils/getLocationLanguage';

function getLanguage(): Language {
  const locationLang: Language | null = getLocationLanguage();
  if (locationLang) return locationLang;

  const htmlLang: string | null | undefined = document
    .querySelector('html')
    ?.getAttribute('lang');
  if (htmlLang && Object.values<string>(Language).includes(htmlLang))
    return htmlLang as Language;

  return Language.English;
}

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    debug: settings.DEBUG,
    supportedLngs: Object.values(Language),
    lng: getLanguage(),
    fallbackLng: false,
    ns: ['global', 'error-boundary'],
    defaultNS: 'global',
    backend: {
      loadPath: `${settings.PUBLIC_PATH}locale/{{lng}}/{{ns}}.json`,
    },
  });

export default i18n;
