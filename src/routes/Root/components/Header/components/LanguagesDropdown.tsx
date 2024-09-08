import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from 'react-router-dom';

import { LoaderData as LanguagesLoaderData } from 'routes/Languages';

import Dropdown, { DropdownProps } from 'react-bootstrap/Dropdown';

import { createMessageToast } from 'components/ToastContainer';

import { LanguagesAPI } from 'services/api/languages/main';

export type LanguagesDropdownProps = Omit<DropdownProps, 'children'>;

function LanguagesDropdown(
	props: LanguagesDropdownProps,
): ReactElement<LanguagesDropdownProps> {
	const { t, i18n } = useTranslation('root', { keyPrefix: 'languagesDropdown' });

	const { languages } = useRouteLoaderData('languages') as LanguagesLoaderData;

	async function setLanguage(langCode: string): Promise<void> {
		const response = await LanguagesAPI.set({ lang_code: langCode });

		if (response.ok) {
			await i18n.changeLanguage(langCode);
		} else {
			createMessageToast({
				message: t('messages.changeLanguage.error'),
				level: 'error',
			});
		}
	}

	return (
		<Dropdown {...props}>
			<Dropdown.Toggle variant='primary'>
				{i18n.language.toUpperCase()}
			</Dropdown.Toggle>
			<Dropdown.Menu>
				{Object.entries(languages).map((language, index) => (
					<Dropdown.Item key={index} onClick={() => setLanguage(language[0])}>
						{language[1]}
					</Dropdown.Item>
				))}
			</Dropdown.Menu>
		</Dropdown>
	);
}

export default memo(LanguagesDropdown);
