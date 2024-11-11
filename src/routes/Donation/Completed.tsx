import React, { ReactElement, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Page from 'components/Page';

function Completed(): ReactElement {
	const { t, i18n } = useTranslation(RouteID.DonationCompleted);

	const title = useMemo<string>(() => t('title'), [i18n.language]);

	return (
		<Page title={title} align='center' grid className='text-center'>
			<h1 className='fw-semibold'>{title}</h1>
			<p className='lead'>
				<Trans t={t} i18nKey='text' components={[<br key={0} />]} />
			</p>
		</Page>
	);
}

export default Completed;
