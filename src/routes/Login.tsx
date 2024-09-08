import { Params, redirect } from 'react-router-dom';
import i18n from 'i18n';
import { TOptions } from 'i18next';

import { reverse } from 'routes';

import { createMessageToast } from 'components/ToastContainer';

import { UserAPI } from 'services/api/users/main';

export interface LoaderProps {
	params: Params<'userID' | 'confirmCode'>;
}

export type LoaderData = Response;

const langNamespace: string = 'login';
const langOptions: TOptions = { ns: langNamespace };

export async function loader({ params }: LoaderProps): Promise<LoaderData> {
	await i18n.loadNamespaces(langNamespace);

	const { userID, confirmCode } = params;

	if (userID && confirmCode) {
		const response = await UserAPI.login({
			user_id: Number.parseInt(userID),
			confirm_code: confirmCode,
		});

		if (response.ok) {
			createMessageToast({
				message: i18n.t('messages.loginUser.success', langOptions),
				level: 'success',
			});
			return redirect(reverse('telegram-bots'));
		} else {
			createMessageToast({
				message: i18n.t('messages.loginUser.error', {
					...langOptions,
					context: response.status,
				}),
				level: 'error',
			});
		}
	} else {
		createMessageToast({
			message: i18n.t('messages.loginUser.error', langOptions),
			level: 'error',
		});
	}

	return redirect(reverse('home'));
}
