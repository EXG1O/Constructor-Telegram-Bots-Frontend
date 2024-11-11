import { redirect } from 'react-router-dom';
import i18n from 'i18n';
import { TOptions } from 'i18next';

import { reverse, RouteID } from 'routes';

import { createMessageToast } from 'components/ToastContainer';

export type LoaderData = Response;

const langNamespace: string = 'not-found';
const langOptions: TOptions = { ns: langNamespace };

async function loader(): Promise<LoaderData> {
	await i18n.loadNamespaces(langNamespace);

	createMessageToast({
		message: i18n.t('text', langOptions),
		level: 'error',
	});

	return redirect(reverse(RouteID.Home));
}

export default loader;
