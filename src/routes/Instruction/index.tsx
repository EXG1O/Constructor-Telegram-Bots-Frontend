import React, { ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from 'react-router-dom';

import Page from 'components/Page';

import SectionDisplay from './components/SectionDisplay';

import { SectionsAPI } from 'services/api/instruction/main';
import { APIResponse } from 'services/api/instruction/types';

export interface LoaderData {
	sections: APIResponse.SectionsAPI.Get;
}

export async function loader(): Promise<LoaderData> {
	const response = await SectionsAPI.get();

	if (!response.ok) {
		throw Error('Failed to fetch data.');
	}

	return { sections: response.json };
}

function Instruction(): ReactElement {
	const { t, i18n } = useTranslation('instruction');

	const { sections } = useRouteLoaderData('instruction') as LoaderData;

	const title = useMemo<string>(() => t('title'), [i18n.language]);

	return (
		<Page title={title} grid>
			<h1 className='fw-semibold text-center'>{title}</h1>
			{sections.map((section) => (
				<SectionDisplay key={section.id} section={section} />
			))}
		</Page>
	);
}

export default Instruction;
