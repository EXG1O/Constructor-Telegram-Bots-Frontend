import React, { ReactElement } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import Container from 'react-bootstrap/Container';

import Title from 'components/Title';

import SectionDisplay from './components/SectionDisplay';

import { SectionsAPI } from 'services/api/privacy_policy/main';
import { APIResponse } from 'services/api/privacy_policy/types';

export interface LoaderData {
	sections: APIResponse.SectionsAPI.Get;
}

export async function loader(): Promise<LoaderData> {
	const response = await SectionsAPI.get();

	if (!response.ok) {
		throw Error('Failed to fetch data!');
	}

	return { sections: response.json };
}

const title: string = gettext('Политика конфиденциальности');

function PrivacyPolicy(): ReactElement {
	const { sections } = useRouteLoaderData('privacy-policy') as LoaderData;

	return (
		<Title title={title}>
			<Container as='main' className='vstack gap-3 gap-lg-4 my-3 my-lg-4'>
				<h1 className='fw-semibold text-center mb-0'>{title}</h1>
				{sections.map(section => (
					<SectionDisplay key={section.id} section={section} />
				))}
			</Container>
		</Title>
	);
}

export default PrivacyPolicy;