import React, { ReactElement, memo } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import Dropdown, { DropdownProps } from 'react-bootstrap/Dropdown';

import useToast from 'services/hooks/useToast';

import { LoaderData as LanguagesLoaderData } from 'routes/Languages';

import { LanguagesAPI } from 'services/api/languages/main';

export type LanguagesDropdownProps = Omit<DropdownProps, 'children'>;

function LanguagesDropdown(props: LanguagesDropdownProps): ReactElement<LanguagesDropdownProps> {
	const { languages } = useRouteLoaderData('languages') as LanguagesLoaderData;

	const { createMessageToast } = useToast();

	async function setLanguage(langCode: string): Promise<void> {
		const response = await LanguagesAPI.set({ lang_code: langCode });

		if (response.ok) {
			window.location.href = location.pathname;
		} else {
			createMessageToast({
				message: gettext('Не удалось изменить язык!'),
				level: 'error',
			});
		}
	}

	return (
		<Dropdown {...props}>
			<Dropdown.Toggle bsPrefix=' ' variant='primary'>
				{languages.current.toUpperCase()}
			</Dropdown.Toggle>
			<Dropdown.Menu className='text-center'>
				{Object.entries(languages.available).map((language, index) => (
					<Dropdown.Item
						key={index}
						onClick={() => setLanguage(language[0])}
					>
						{language[1]}
					</Dropdown.Item>
				))}
			</Dropdown.Menu>
		</Dropdown>
	);
}

export default memo(LanguagesDropdown);