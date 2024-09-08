import { format } from 'date-fns';
import { enUS, ru, uk } from 'date-fns/locale';
import i18n from 'i18n';

export default function (date: string, style: string = 'd MMM yyyy H:MM'): string {
	return format(date, style, {
		locale: i18n.language === 'en' ? enUS : i18n.language === 'uk' ? uk : ru,
	});
}
