import React, { ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Page from 'components/Page';

import SectionDisplay from './components/SectionDisplay';

import useInstructionRouteLoaderData from './hooks/useInstructionRouteLoaderData';

function Instruction(): ReactElement {
	const { t, i18n } = useTranslation('instruction');

	const { sections } = useInstructionRouteLoaderData();

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
