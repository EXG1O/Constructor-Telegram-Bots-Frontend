import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import Backend from 'i18next-http-backend';

i18n.use(Backend)
	.use(initReactI18next)
	.init({
		debug: true,
		lng: document.querySelector('html')?.getAttribute('lang') ?? 'ru',
		ns: 'global',
		defaultNS: 'global',
		fallbackLng: false,
		backend: { loadPath: '/locale/{{lng}}/{{ns}}.json' },
	});

export default i18n;
