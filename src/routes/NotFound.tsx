import { redirect } from 'react-router-dom';

import { reverse } from 'routes';

import { createMessageToast } from 'components/ToastContainer';

export type LoaderData = Response;

export async function loader(): Promise<LoaderData> {
	createMessageToast({
		message: gettext('Страница не найдена.'),
		level: 'error',
	});
	return redirect(reverse('home'));
}
