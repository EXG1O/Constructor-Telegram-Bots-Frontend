import React, { type ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import InfoPage, { type InfoPageOptions } from 'components/shared/InfoPage';

import useTermsOfServiceRouteLoaderData from './hooks/useTermsOfServiceRouteLoaderData';

import { SectionsAPI } from 'api/terms-of-service';

function TermsOfService(): ReactElement {
  const { t, i18n } = useTranslation(RouteID.TermsOfService);

  const { sections: initialSections } = useTermsOfServiceRouteLoaderData();

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
    <InfoPage title={t('title')} initialSections={initialSections} options={options} />
  );
}

export default TermsOfService;
