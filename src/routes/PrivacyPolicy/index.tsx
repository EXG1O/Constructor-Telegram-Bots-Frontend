import React, { type ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import InfoPage, { type InfoPageOptions } from 'components/shared/InfoPage';

import usePrivacyPolicyRouteLoaderData from './hooks/usePrivacyPolicyRouteLoaderData';

import { SectionsAPI } from 'api/privacy-policy';

function PrivacyPolicy(): ReactElement {
  const { t, i18n } = useTranslation(RouteID.PrivacyPolicy);

  const { sections: initialSections } = usePrivacyPolicyRouteLoaderData();

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

export default PrivacyPolicy;
