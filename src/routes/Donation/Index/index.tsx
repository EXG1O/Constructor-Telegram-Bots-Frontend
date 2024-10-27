import React, { ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';
import Page from 'components/Page';

import SectionDisplay from './components/SectionDisplay';

import useDonationRouteLoaderData from './hooks/useDonationRouteLoaderData';

function Index(): ReactElement {
	const { t, i18n } = useTranslation('donation-index');

	const { sections, buttons } = useDonationRouteLoaderData();

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
