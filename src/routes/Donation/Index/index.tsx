import React, { ReactElement } from 'react';

import { useRouteLoaderData } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import Page from 'components/Page';

import { SectionsAPI, ButtonsAPI } from 'services/api/donations/main';
import { APIResponse } from 'services/api/donations/types';

import SectionDisplay from './components/SectionDisplay';

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
		throw Error('Failed to fetch data!');
	}

	return {
		sections: sectionsResponse.json,
		buttons: buttonsResponse.json,
	};
}

const title: string = gettext('Пожертвование');

function Index(): ReactElement {
	const { sections, buttons } = useRouteLoaderData('donation-index') as LoaderData;

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
