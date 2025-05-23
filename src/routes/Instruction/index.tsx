import React, { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Spinner from 'components/ui/Spinner';
import Page from 'components/shared/Page';
import { createMessageToast } from 'components/ui/ToastContainer';

import SectionDisplay from './components/SectionDisplay';

import useInstructionRouteLoaderData from './hooks/useInstructionRouteLoaderData';

import { SectionsAPI } from 'api/instruction/main';
import { Section } from 'api/instruction/types';

function Instruction(): ReactElement {
  const { t, i18n } = useTranslation(RouteID.Instruction);

  const { sections: initialSections } = useInstructionRouteLoaderData();

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
        <Spinner size='lg' className='m-auto' />
      )}
    </Page>
  );
}

export default Instruction;
