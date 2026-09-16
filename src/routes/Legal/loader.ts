import { type LoaderFunctionArgs, redirect } from 'react-router-dom';
import i18n from 'i18n';
import type { TOptions } from 'i18next';

import { RouteID } from 'routes';

import { createMessageToast } from 'components/ui/ToastContainer';

import { DocumentAPI } from 'api/legal';
import type { DocumentType } from 'api/legal/enums';
import type { APIResponse } from 'api/legal/types';
import { isDocumentType } from 'api/legal/utils';

import reverse from 'utils/reverse';

interface StrictTOptions extends TOptions {
  ns: `${RouteID.Legal}`;
}

export interface LoaderData {
  type: DocumentType;
  document: APIResponse.DocumentAPI.Get;
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

  const response = await DocumentAPI.get({ type });

  if (!response.ok) {
    createMessageToast({
      message: i18n.t('messages.loader.error'),
      level: 'error',
    });
    throw redirect(reverse(RouteID.Home));
  }

  return { type, document: response.json };
}

export default loader;
