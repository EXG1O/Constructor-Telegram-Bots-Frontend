import { type LoaderFunctionArgs, redirect } from 'react-router-dom';
import i18n from 'i18n';
import type { TOptions } from 'i18next';

import { RouteID } from 'routes';

import { createMessageToast } from 'components/ui/ToastContainer';

import type { Document, DocumentType } from 'api';
import { LegalService } from 'api';
import isDocumentType from 'api/utils/isDocumentType';

import reverse from 'utils/reverse';

interface StrictTOptions extends TOptions {
  ns: `${RouteID.Legal}`;
}

export interface LoaderData {
  type: DocumentType;
  document: Document;
}

async function loader({ params: { type } }: LoaderFunctionArgs): Promise<LoaderData> {
  if (!type || !isDocumentType(type)) {
    createMessageToast({
      message: i18n.t<string, StrictTOptions, string, StrictTOptions>(
        'messages.getDocument.error',
        { ns: 'legal', context: 'notFound' },
      ),
      level: 'error',
    });
    throw redirect(reverse(RouteID.Home));
  }

  const { data, error } = await LegalService.getDocument({ path: { type } });

  if (error || !data) {
    createMessageToast({
      message: i18n.t('messages.loader.error'),
      level: 'error',
    });
    throw redirect(reverse(RouteID.Home));
  }

  return { type, document: data };
}

export default loader;
