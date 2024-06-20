import { Params, redirect } from 'react-router-dom';

import { reverse } from 'routes';

import { createMessageToast } from 'components/ToastContainer';

import { UserAPI } from 'services/api/users/main';

export interface LoaderProps {
	params: Params<'userID' | 'confirmCode'>;
}

export type LoaderData = Response;

export async function loader({ params }: LoaderProps): Promise<LoaderData> {
	const { userID, confirmCode } = params;

	if (userID && confirmCode) {
		const response = await UserAPI.login({
			user_id: Number.parseInt(userID),
			confirm_code: confirmCode,
		});

		if (response.ok) {
			createMessageToast({
				message: gettext('Успешная авторизация.'),
				level: 'success',
			});
			return redirect(reverse('telegram-bots'));
		} else if (response.status === 404) {
			createMessageToast({
				message: gettext('Пользователь не найден.'),
				level: 'error',
			});
		} else if (response.status === 401) {
			createMessageToast({
				message: gettext('Неверный код подтверждения.'),
				level: 'error',
			});
		}
	} else {
		createMessageToast({
			message: gettext('Не удалось пройти авторизацию по неизвестным причинам.'),
			level: 'error',
		});
	}

	return redirect(reverse('home'));
}
