import React, { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Loading from 'components/Loading';
import Page from 'components/Page';
import { createMessageToast } from 'components/ToastContainer';

import MethodTable from './components/MethodTable';
import SectionDisplay from './components/SectionDisplay';

import useDonationRouteLoaderData from './hooks/useDonationRouteLoaderData';

import { SectionsAPI } from 'api/donations/main';
import { Section } from 'api/donations/types';

function Index(): ReactElement {
  const { t, i18n } = useTranslation(RouteID.Donation);

  const { sections: initialSections } = useDonationRouteLoaderData();

  const title = useMemo<string>(() => t('title'), [i18n.language]);
  const isInitialRender = useRef<boolean>(true);

  const [sections, setSections] = useState<Section[]>(initialSections);
  const [loading, setLoading] = useState<boolean>(false);

  async function updateSections(): Promise<void> {
    setLoading(true);

    const response = await SectionsAPI.get();

    if (response.ok) {
      setSections(response.json);
    } else {
      createMessageToast({
        message: t('messages.getSections.error'),
        level: 'error',
      });
    }

    setLoading(false);
  }

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    updateSections();
  }, [i18n.language]);

  return (
    <Page title={title} grid>
      <h1 className='fw-semibold text-center'>{title}</h1>
      {!loading ? (
        sections.map((section) => <SectionDisplay key={section.id} section={section} />)
      ) : (
        <Loading size='lg' className='m-auto' />
      )}
      <MethodTable />
    </Page>
  );
}

export default Index;
