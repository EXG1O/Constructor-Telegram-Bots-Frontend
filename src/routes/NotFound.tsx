import { redirect } from 'react-router-dom';

import { createMessageToast } from 'components/ToastContainer';

import { reverse } from 'routes';

export type LoaderData = Response;

export async function loader(): Promise<LoaderData> {
	createMessageToast({
		message: gettext('Страница не найдена.'),
		level: 'error',
	});
	return redirect(reverse('home'));
}
