import React, { ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Page from 'components/Page';

import SectionDisplay from './components/SectionDisplay';

import usePrivacyPolicyRouteLoaderData from './hooks/usePrivacyPolicyRouteLoaderData';

function PrivacyPolicy(): ReactElement {
	const { t, i18n } = useTranslation(RouteID.PrivacyPolicy);

	const { sections } = usePrivacyPolicyRouteLoaderData();

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

export default PrivacyPolicy;
