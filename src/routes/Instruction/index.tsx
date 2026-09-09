import React, { type ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Page from 'components/ui/Page';
import Spinner from 'components/ui/Spinner';
import { createMessageToast } from 'components/ui/ToastContainer';

import SectionItem from './components/SectionItem';

import useInstructionRouteLoaderData from './hooks/useInstructionRouteLoaderData';

import { SectionsAPI } from 'api/instruction';
import type { Section } from 'api/instruction/types';

function Instruction(): ReactElement {
  const { t, i18n } = useTranslation(RouteID.Instruction);

  const { sections: initialSections } = useInstructionRouteLoaderData();

  const [sections, setSections] = useState<Section[]>(initialSections);
  const [loading, setLoading] = useState<boolean>(false);

  const title: string = t('title');

  useEffect(() => {
    const refreshSections = async () => {
      setLoading(true);

      const response = await SectionsAPI.get();

      if (!response.ok) {
        createMessageToast({
          message: t('messages.getSections.error'),
          level: 'error',
        });
        return;
      }

      setSections(response.json);
      setLoading(false);
    };

    i18n.on('languageChanged', refreshSections);
    return () => i18n.off('languageChanged', refreshSections);
  }, [i18n.language]);

  return (
    <Page title={title} flex gutters className='flex-auto'>
      <h2 className='text-center text-4xl font-semibold text-foreground'>{title}</h2>
      {!loading ? (
        sections.map((section, index) => <SectionItem key={index} section={section} />)
      ) : (
        <div className='flex flex-auto items-center justify-center'>
          <Spinner />
        </div>
      )}
    </Page>
  );
}

export default Instruction;
