import React, { type ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import InfoPage, { type InfoPageOptions } from 'components/shared/InfoPage';

import MethodTable from './components/MethodTable';

import useDonationRouteLoaderData from './hooks/useDonationRouteLoaderData';

import { SectionsAPI } from 'api/donations';

function Index(): ReactElement {
  const { t, i18n } = useTranslation(RouteID.Donation);

  const { sections: initialSections } = useDonationRouteLoaderData();

  const options = useMemo<InfoPageOptions>(
    () => ({
      getSections: {
        func: async () => {
          const response = await SectionsAPI.get();
          return response.ok ? response.json : null;
        },
        messages: {
          error: t('messages.getSections.error'),
        },
      },
    }),
    [i18n.language],
  );

  return (
    <InfoPage title={t('title')} initialSections={initialSections} options={options}>
      <MethodTable />
    </InfoPage>
  );
}

export default Index;
