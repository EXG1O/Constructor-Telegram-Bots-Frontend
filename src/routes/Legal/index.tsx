import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import formatDate from 'i18n/formatDate';
import type { TOptions } from 'i18next';

import type { RouteID } from 'routes';

import Markdown from 'components/ui/Markdown';
import Page from 'components/ui/Page';

import useLegalRouteLoaderData from './hooks/useLegalRouteLoaderData';

import { DocumentType } from 'api/legal/enums';

interface StrictTOptions extends TOptions {
  context: `${DocumentType.TermsOfService | DocumentType.PrivacyPolicy}`;
}

function Legal(): ReactElement {
  const { t } = useTranslation<`${RouteID.Legal}`, any>('legal');

  const { type, document } = useLegalRouteLoaderData();

  const title: string = t<string, StrictTOptions, string, StrictTOptions>('title', {
    context:
      type === DocumentType.TermsOfService ? 'terms-of-service' : 'privacy-policy',
  });

  return (
    <Page title={title} flex gutters className='flex-auto'>
      <h2 className='w-full text-center text-4xl font-semibold text-foreground'>
        {title}
      </h2>
      <div className='w-full'>
        <Markdown>{document.content}</Markdown>
      </div>
      <small className='w-full text-end text-xs text-muted'>
        {formatDate(document.updated_date)}
      </small>
    </Page>
  );
}

export default Legal;
