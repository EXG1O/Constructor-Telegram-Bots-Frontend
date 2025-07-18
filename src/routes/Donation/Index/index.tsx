import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Page from 'components/ui/Page';
import Spinner from 'components/ui/Spinner';
import { createMessageToast } from 'components/ui/ToastContainer';

import MethodTable from './components/MethodTable';
import SectionItem from './components/SectionItem';

import useDonationRouteLoaderData from './hooks/useDonationRouteLoaderData';

import { SectionsAPI } from 'api/donations';
import { Section } from 'api/donations/types';

function Index(): ReactElement {
  const { t, i18n } = useTranslation(RouteID.Donation);

  const { sections: initialSections } = useDonationRouteLoaderData();

  const title: string = t('title');

  const [sections, setSections] = useState<Section[]>(initialSections);
  const [loading, setLoading] = useState<boolean>(false);

  const isInitialRenderRef = useRef<boolean>(true);

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
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;
      return;
    }

    updateSections();
  }, [i18n.language]);

  return (
    <Page title={title} flex gutters className='flex-auto'>
      <h2 className='text-center text-4xl font-semibold text-foreground'>{title}</h2>
      {!loading ? (
        sections.map((section) => <SectionItem key={section.id} section={section} />)
      ) : (
        <div className='flex flex-auto items-center justify-center'>
          <Spinner />
        </div>
      )}
      <MethodTable />
    </Page>
  );
}

export default Index;
