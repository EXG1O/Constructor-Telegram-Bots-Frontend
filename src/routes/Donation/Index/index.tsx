import React, { ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Page from 'components/Page';

import MethodTable from './components/MethodTable';
import SectionDisplay from './components/SectionDisplay';

import useDonationRouteLoaderData from './hooks/useDonationRouteLoaderData';

function Index(): ReactElement {
  const { t, i18n } = useTranslation(RouteID.Donation);

  const { sections } = useDonationRouteLoaderData();

  const title = useMemo<string>(() => t('title'), [i18n.language]);

  return (
    <Page title={title} grid>
      <h1 className='fw-semibold text-center'>{title}</h1>
      {sections.map((section) => (
        <SectionDisplay key={section.id} section={section} />
      ))}
      <MethodTable />
    </Page>
  );
}

export default Index;
