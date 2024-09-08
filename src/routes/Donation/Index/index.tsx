import React, { ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import Page from 'components/Page';

import SectionDisplay from './components/SectionDisplay';

import { ButtonsAPI, SectionsAPI } from 'services/api/donations/main';
import { APIResponse } from 'services/api/donations/types';

export interface LoaderData {
	sections: APIResponse.SectionsAPI.Get;
	buttons: APIResponse.ButtonsAPI.Get;
}

export async function loader(): Promise<LoaderData> {
	const [sectionsResponse, buttonsResponse] = await Promise.all([
		SectionsAPI.get(),
		ButtonsAPI.get(),
	]);

	if (!sectionsResponse.ok || !buttonsResponse.ok) {
		throw Error('Failed to fetch data.');
	}

	return {
		sections: sectionsResponse.json,
		buttons: buttonsResponse.json,
	};
}

function Index(): ReactElement {
	const { t, i18n } = useTranslation('donation-index');

	const { sections, buttons } = useRouteLoaderData('donation-index') as LoaderData;

	const title = useMemo<string>(() => t('title'), [i18n.language]);

	return (
		<Page title={title} grid>
			<h1 className='fw-semibold text-center'>{title}</h1>
			{sections.map((section) => (
				<SectionDisplay key={section.id} section={section} />
			))}
			<div className='d-flex gap-2 mt-auto'>
				{buttons.map((button) => (
					<Button
						key={button.id}
						as='a'
						href={button.url}
						target='_blank'
						variant='dark'
						className='flex-fill'
					>
						{button.text}
					</Button>
				))}
			</div>
		</Page>
	);
}

export default Index;
