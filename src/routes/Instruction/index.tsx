import React, { type ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import InfoPage, { type InfoPageOptions } from 'components/shared/InfoPage';

import useInstructionRouteLoaderData from './hooks/useInstructionRouteLoaderData';

import { SectionsAPI } from 'api/instruction';

function Instruction(): ReactElement {
  const { t, i18n } = useTranslation(RouteID.Instruction);

  const { sections: initialSections } = useInstructionRouteLoaderData();

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

export default Instruction;
